import {
  ACCENT_PRESETS,
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT_ID,
  buildAccentBootCss,
} from "@/lib/accent-colors";
import { features } from "@/settings/features";

/** Inlined in <head> so accent vars exist before globals paint. */
export const ACCENT_BOOT_CSS = buildAccentBootCss();

const ACCENT_IDS = ACCENT_PRESETS.map((p) => p.id);

/**
 * Runs in <head> before first paint: theme class, accent data attribute + cookie sync,
 * optional boot cover, and unregisters any leftover PWA service worker from older deploys.
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

    var valid = ${JSON.stringify(ACCENT_IDS)};
    var fallback = ${JSON.stringify(DEFAULT_ACCENT_ID)};
    var accentId = fallback;
    try {
      var storedAccent = localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)});
      if (storedAccent) {
        accentId = storedAccent;
      } else {
        var cookieMatch = document.cookie.match(
          new RegExp("(?:^|;\\\\s*)" + ${JSON.stringify(ACCENT_STORAGE_KEY)} + "=([^;]*)")
        );
        if (cookieMatch) accentId = decodeURIComponent(cookieMatch[1]);
        else accentId = root.getAttribute("data-accent") || fallback;
      }
    } catch (e) {}
    if (valid.indexOf(accentId) === -1) accentId = fallback;
    root.setAttribute("data-accent", accentId);
    document.cookie = ${JSON.stringify(ACCENT_STORAGE_KEY)} + "=" + encodeURIComponent(accentId) + ";path=/;max-age=31536000;SameSite=Lax";
  } catch (e) {
    root.classList.add("dark");
    root.setAttribute("data-accent", ${JSON.stringify(DEFAULT_ACCENT_ID)});
  }

  try {
    root.dataset.pageReady = "true";
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
  opacity: 1;
  transform: none;
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
