"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { CommandPalette } from "./CommandPalette";
import { ShortcutsOverlay, ShortcutsTrigger } from "./ShortcutsOverlay";
import { AccentPicker } from "./AccentPicker";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  // { id: "projects", label: "Projects" },
  // { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const active = useActiveSection();
  const { percent, pastHero } = useScrollProgress();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout>;

    const GO_MAP: Record<string, string> = {
      h: "home",
      a: "about",
      s: "skills",
      e: "experience",
      c: "contact",
    };

    const handler = (e: KeyboardEvent) => {
      // Skip when typing in inputs / textareas / contenteditable
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
        return;

      const key = e.key.toLowerCase();

      // ? → shortcuts overlay
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

      if (gPressed && GO_MAP[key]) {
        e.preventDefault();
        gPressed = false;
        clearTimeout(gTimer);
        document.getElementById(GO_MAP[key])?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearTimeout(gTimer);
    };
  }, [toggleTheme]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong shadow-lg py-3" : "py-5",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <button
          onClick={() => scrollTo("home")}
          className="font-heading text-xl font-bold tracking-tight"
        >
          <span className="gradient-text">{siteConfig.name}</span>
          <span className="text-muted-foreground font-normal">.dev</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
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
              className="hidden items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm md:flex"
              aria-label={`Reading ${active} — ${percent}% through page`}
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
              <span className="capitalize font-medium">{active}</span>
              <span className="opacity-60">·</span>
              <span className="tabular-nums">{percent}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {/* ⌘K search trigger — visible on md+ as a pill, icon-only on mobile */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
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
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
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
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-strong mx-4 mt-2 overflow-hidden rounded-xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "relative rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                    active === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active === item.id && (
                    <motion.div
                      layoutId="mobile-nav-active"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command palette — controlled from navbar search button */}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      {/* Keyboard shortcuts overlay */}
      <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </motion.header>
  );
}
