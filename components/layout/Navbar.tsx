"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Search, Palette, Check } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useNavActive } from "@/hooks/use-nav-active";
import { useActiveSection } from "@/hooks/use-active-section";
import { ALL_NAV_TARGETS, PRIMARY_NAV } from "@/lib/nav";
import { navigateToNavItem } from "@/lib/navigate";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { useAccent } from "@/hooks/use-accent";
import { ACCENT_PRESETS } from "@/lib/accent-colors";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { AccentPicker } from "@/components/features/accent";
import { Brand } from "@/components/shared";

/** cmdk / resume stay out of the initial bundle until opened or idle. */
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute bottom-full right-0 mb-2 z-50 min-w-[160px] rounded-xl border border-border bg-card p-2.5 shadow-premium"
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
                  {preset.id === accentId && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const NAV_ITEMS = PRIMARY_NAV;
const JUMP_TARGETS = ALL_NAV_TARGETS;

export function Navbar() {
  const { resolvedTheme, toggleTheme } = useTheme();
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

  useEffect(() => {
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

  // Prefetch command palette / resume after first paint so ⌘K isn't cold.
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
      <nav className="mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <button
          onClick={() => goTo(NAV_ITEMS[0])}
          aria-label={`${siteConfig.fullName} — home`}
          className="min-w-0 shrink font-heading text-xl font-bold tracking-tight"
        >
          <Brand />
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item)}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active === item.id && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Scroll progress badge — appears after scrolling past hero */}
        <AnimatePresence>
          {pastHero && (
            <motion.div
              key="scroll-badge"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="hidden items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm lg:flex"
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
            </motion.div>
          )}
        </AnimatePresence>

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

          {/* Accent color picker */}
          <AccentPicker />

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="glass-strong mx-4 mt-2 rounded-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => goTo(item)}
                  className={cn(
                    "relative rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                    active === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-border" />

              {/* Theme & Accent row */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium text-muted-foreground">Appearance</span>
                <div className="flex items-center gap-1">
                  {/* Accent color swatches */}
                  <MobileAccentPicker />
                  {/* Light / Dark toggle */}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heavy chrome — mount on demand or after idle to cut unused JS / TBT */}
      {(paletteOpen || chromeReady) && (
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          onOpenShortcuts={() => setShortcutsOpen(true)}
        />
      )}
      {(shortcutsOpen || chromeReady) && (
        <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      )}
      {(paletteOpen || chromeReady) && <ResumeViewer />}
    </header>
  );
}
