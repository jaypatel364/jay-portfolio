"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, Search, Palette, Check } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAppearanceReady } from "@/hooks/use-appearance-ready";
import { useNavActive } from "@/hooks/use-nav-active";
import { useActiveSection } from "@/hooks/use-active-section";
import { ALL_NAV_TARGETS, PRIMARY_NAV } from "@/lib/nav";
import { navigateToNavItem } from "@/lib/navigate";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { useAccent } from "@/hooks/use-accent";
import { ACCENT_PRESETS } from "@/lib/accent-colors";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { RESUME_OPEN_EVENT } from "@/components/features/resume/open-resume";
import { Brand } from "@/components/shared";

/** cmdk / accent / resume stay out of the initial bundle until opened or idle. */
const AccentPicker = dynamic(() =>
  import("@/components/features/accent").then((m) => ({ default: m.AccentPicker })),
);
const CommandPalette = dynamic(() =>
  import("@/components/features/command-palette").then((m) => ({ default: m.CommandPalette })),
);
const ShortcutsOverlay = dynamic(() =>
  import("@/components/features/command-palette/ShortcutsOverlay").then((m) => ({
    default: m.ShortcutsOverlay,
  })),
);
const ResumeViewer = dynamic(() =>
  import("@/components/features/resume").then((m) => ({ default: m.ResumeViewer })),
);

function ShortcutsTrigger({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Show keyboard shortcuts (?)"
      title="Keyboard shortcuts"
      className={cn(
        "hidden rounded-lg border border-border bg-muted/50 px-2 py-1.5 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:inline-flex",
        className,
      )}
    >
      ?
    </button>
  );
}

/** Inline accent picker for the mobile menu — shows swatches in a row */
function MobileAccentPicker() {
  const { resolvedTheme } = useTheme();
  const { accentId, setAccent } = useAccent(resolvedTheme);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const currentPreset = ACCENT_PRESETS.find((p) => p.id === accentId)!;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Accent color: ${currentPreset.label}. Tap to change.`}
        aria-expanded={open}
        className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Palette className="h-4 w-4" />
        <span
          className="absolute bottom-1 right-1 h-2 w-2 rounded-full ring-1 ring-card"
          style={{ background: currentPreset.swatch }}
        />
      </button>

      {open ? (
        <div
          className="absolute bottom-full right-0 mb-2 z-50 min-w-[160px] origin-bottom-right animate-in fade-in zoom-in-95 slide-in-from-bottom-1 rounded-xl border border-border bg-card p-2.5 shadow-premium duration-200"
          role="listbox"
          aria-label="Choose accent color"
        >
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Accent color
          </p>
          <div className="flex flex-col gap-0.5">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                role="option"
                aria-selected={preset.id === accentId}
                onClick={() => {
                  setAccent(preset.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                  preset.id === accentId
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-full ring-1 ring-border"
                  style={{ background: preset.swatch }}
                />
                <span className="flex-1">{preset.label}</span>
                {preset.id === accentId && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const NAV_ITEMS = PRIMARY_NAV;
const JUMP_TARGETS = ALL_NAV_TARGETS;

export function Navbar() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const appearanceReady = useAppearanceReady();
  const active = useNavActive();
  const readingSection = useActiveSection();
  const { percent, pastHero } = useScrollProgress();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [chromeReady, setChromeReady] = useState(false);
  const [resumeReady, setResumeReady] = useState(false);

  useEffect(() => {
    // Sync initial state immediately — handles page refresh while already scrolled
    setScrolled(window.scrollY > 20);

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 20);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Prefetch command palette after first paint so ⌘K isn't cold.
  useEffect(() => {
    const mount = () => setChromeReady(true);
    const ric = window.requestIdleCallback;
    if (ric) {
      const id = ric(mount, { timeout: 3500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(mount, 1);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const onOpenResume = () => setResumeReady(true);
    window.addEventListener(RESUME_OPEN_EVENT, onOpenResume);
    return () => window.removeEventListener(RESUME_OPEN_EVENT, onOpenResume);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout>;

    const GO_KEYS: Record<string, string> = {
      h: "home",
      a: "about",
      s: "skills",
      e: "experience",
      d: "education",
      p: "work",
      o: "work",
      f: "faq",
      c: "contact",
    };

    const handler = (e: KeyboardEvent) => {
      // Skip when typing in inputs / textareas / contenteditable
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
        return;

      const key = e.key.toLowerCase();

      // ⌘K / Ctrl+K — open command palette, close shortcuts overlay first
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShortcutsOpen(false);
        setPaletteOpen(true);
        return;
      }

      // ? → shortcuts overlay (only when palette is closed)
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
        return;
      }

      // T → toggle theme
      if (key === "t" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // G+H/A/S/E/C → navigate to section (two-key chord, 1s window)
      if (key === "g" && !e.metaKey && !e.ctrlKey) {
        gPressed = true;
        clearTimeout(gTimer);
        gTimer = setTimeout(() => {
          gPressed = false;
        }, 1000);
        return;
      }

      if (gPressed && GO_KEYS[key]) {
        e.preventDefault();
        gPressed = false;
        clearTimeout(gTimer);
        const item = JUMP_TARGETS.find((nav) => nav.id === GO_KEYS[key]);
        if (item) navigateToNavItem(item, { pathname, router });
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearTimeout(gTimer);
    };
  }, [toggleTheme, pathname, router]);

  const goTo = (item: (typeof NAV_ITEMS)[number]) => {
    setMobileOpen(false);
    navigateToNavItem(item, { pathname, router });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong shadow-lg py-3" : "py-5",
      )}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <nav
        className="mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            goTo(NAV_ITEMS[0]);
          }}
          aria-label={`${siteConfig.fullName} — home`}
          className="min-w-0 shrink font-heading text-xl font-bold tracking-tight"
        >
          <Brand />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                goTo(item);
              }}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active === item.id ? (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-lg bg-primary/10 transition-colors duration-200"
                />
              ) : null}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Scroll progress badge — appears after scrolling past hero */}
        {pastHero ? (
          <div
            className="hidden animate-in fade-in zoom-in-95 items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm duration-200 lg:flex"
            aria-label={`Reading ${readingSection} — ${percent}% through page`}
          >
            {/* Mini arc progress ring */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="shrink-0 -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-15"
              />
              <circle
                cx="8"
                cy="8"
                r="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 6}`}
                strokeDashoffset={`${2 * Math.PI * 6 * (1 - percent / 100)}`}
                strokeLinecap="round"
                className="text-primary transition-all duration-300"
                style={{ color: "var(--primary)" }}
              />
            </svg>
            <span className="font-medium">{readingSection}</span>
            <span className="opacity-60">·</span>
            <span className="tabular-nums">{percent}%</span>
          </div>
        ) : null}

        <div className="flex shrink-0 items-center gap-2">
          {/* ⌘K search trigger — visible on md+ as a pill, icon-only on mobile */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex"
            aria-label="Open command palette"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="ml-1 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => setPaletteOpen(true)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
            aria-label="Open command palette"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Shortcuts hint button */}
          <ShortcutsTrigger onClick={() => setShortcutsOpen(true)} />

          {/* Accent + theme — hidden until storage is hydrated (avoids default flash) */}
          {appearanceReady ? (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              <AccentPicker />
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2" aria-hidden>
              <span className="inline-block size-9 shrink-0" />
              <span className="inline-block size-9 shrink-0" />
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="glass-strong mx-4 mt-2 animate-in fade-in slide-in-from-top-2 rounded-xl duration-200 lg:hidden">
          <div className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item);
                }}
                className={cn(
                  "relative rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                  active === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}

            {/* Theme & Accent row — after preferences hydrate */}
            {appearanceReady ? (
              <>
                <div className="my-2 border-t border-border" />
                <div className="flex animate-in fade-in items-center justify-between px-1 duration-200">
                  <span className="text-xs font-medium text-muted-foreground">Appearance</span>
                  <div className="flex items-center gap-1">
                    <MobileAccentPicker />
                    <button
                      onClick={toggleTheme}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Toggle theme"
                    >
                      {resolvedTheme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Heavy chrome — mount on demand or after idle to cut unused JS / TBT */}
      {(paletteOpen || chromeReady) && (
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          onOpenShortcuts={() => setShortcutsOpen(true)}
        />
      )}
      {shortcutsOpen ? (
        <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      ) : null}
      {resumeReady ? <ResumeViewer /> : null}
    </header>
  );
}
