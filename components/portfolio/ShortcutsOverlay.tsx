"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shortcut {
  keys: string[];
  description: string;
  category: "Navigation" | "Actions" | "UI";
}

const SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ["G", "H"], description: "Go to Home", category: "Navigation" },
  { keys: ["G", "A"], description: "Go to About", category: "Navigation" },
  { keys: ["G", "S"], description: "Go to Skills", category: "Navigation" },
  { keys: ["G", "E"], description: "Go to Experience", category: "Navigation" },
  // { keys: ["G", "P"], description: "Go to Projects (G+O also works)", category: "Navigation" }, // hidden
  { keys: ["G", "C"], description: "Go to Contact", category: "Navigation" },
  // Actions
  { keys: ["⌘", "K"], description: "Open command palette", category: "Actions" },
  { keys: ["?"], description: "Show this overlay", category: "Actions" },
  // UI
  { keys: ["Esc"], description: "Close any overlay / modal", category: "UI" },
  { keys: ["T"], description: "Toggle dark / light mode", category: "UI" },
];

const CATEGORIES = ["Navigation", "Actions", "UI"] as const;

interface ShortcutsOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function ShortcutsOverlay({ open, onClose }: ShortcutsOverlayProps) {
  const portalRef = useRef<Element | null>(null);

  // Resolve portal target on the client only
  useEffect(() => {
    portalRef.current = document.body;
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const content = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="shortcuts-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel — fixed to viewport, never affected by ancestor transforms */}
          <motion.div
            key="shortcuts-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, scale: 0.94, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-[81] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card shadow-premium"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Keyboard className="h-4 w-4 text-primary-foreground" />
                </div>
                <h2 className="font-heading text-base font-bold">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close shortcuts overlay"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Shortcut groups */}
            <div className="divide-y divide-border">
              {CATEGORIES.map((cat) => {
                const items = SHORTCUTS.filter((s) => s.category === cat);
                return (
                  <div key={cat} className="px-6 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {cat}
                    </p>
                    <ul className="space-y-2.5">
                      {items.map((s) => (
                        <li key={s.description} className="flex items-center justify-between gap-4">
                          <span className="text-sm text-foreground">{s.description}</span>
                          <span className="flex shrink-0 items-center gap-1">
                            {s.keys.map((key, i) => (
                              <span key={i} className="flex items-center gap-1">
                                <kbd className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-foreground shadow-sm">
                                  {key}
                                </kbd>
                                {i < s.keys.length - 1 && (
                                  <span className="text-xs text-muted-foreground">then</span>
                                )}
                              </span>
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="border-t border-border px-6 py-3">
              <p className="text-center text-xs text-muted-foreground">
                Press{" "}
                <kbd className="inline-flex h-5 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]">
                  Esc
                </kbd>{" "}
                or click outside to close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Render into document.body so ancestor transforms (navbar) don't offset fixed positioning
  if (typeof document === "undefined" || !portalRef.current) return content;
  return createPortal(content, portalRef.current);
}

/**
 * Small trigger button rendered in the navbar.
 * Shows a ? badge; tooltip appears on hover.
 */
export function ShortcutsTrigger({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
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
