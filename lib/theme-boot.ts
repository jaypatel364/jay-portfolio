import { ACCENT_PRESETS, ACCENT_STORAGE_KEY, DEFAULT_ACCENT_ID } from "@/lib/accent-colors";
import { features } from "@/settings/features";

const ACCENT_MAP = Object.fromEntries(
  ACCENT_PRESETS.map((p) => [p.id, { light: p.light, dark: p.dark }]),
);

/**
 * Runs in <head> before first paint: theme class, accent CSS vars, optional boot cover,
 * and unregisters any leftover PWA service worker from older deploys.
 */
export function getThemeBootScript(): string {
  const showBoot = features.showLoadingScreen;
  return `
(function () {
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem("portfolio-theme");
    var dark =
      stored === "dark" ||
      (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", !!dark);

    var presets = ${JSON.stringify(ACCENT_MAP)};
    var accentId = localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)}) || ${JSON.stringify(DEFAULT_ACCENT_ID)};
    var preset = presets[accentId] || presets[${JSON.stringify(DEFAULT_ACCENT_ID)}];
    var vars = dark ? preset.dark : preset.light;
    for (var k in vars) root.style.setProperty(k, vars[k]);
  } catch (e) {
    root.classList.add("dark");
  }

  try {
    root.dataset.pagePending = "true";
  } catch (e) {}

  ${
    showBoot
      ? `try {
    if (!sessionStorage.getItem("jay_boot_done")) root.dataset.booting = "true";
  } catch (e) {}`
      : ""
  }

  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        for (var i = 0; i < regs.length; i++) regs[i].unregister();
      });
    }
    if (window.caches) {
      caches.keys().then(function (keys) {
        for (var i = 0; i < keys.length; i++) caches.delete(keys[i]);
      });
    }
  } catch (e) {}
})();
`.trim();
}

export const PAGE_REVEAL_CSS = `
html[data-page-pending="true"] .site-shell {
  opacity: 0;
  transform: translateY(10px);
}
`.trim();

export const BOOT_COVER_CSS = `
html[data-booting="true"] #site-boot-cover {
  display: block !important;
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: #fafaf8;
}
html.dark[data-booting="true"] #site-boot-cover {
  background: #0e0f17;
}
`.trim();
