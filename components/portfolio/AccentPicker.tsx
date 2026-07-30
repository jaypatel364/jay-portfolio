"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { ACCENT_PRESETS } from "@/lib/accent-colors";
import { useAccent } from "@/hooks/use-accent";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function AccentPicker() {
  const { resolvedTheme } = useTheme();
  const { accentId, setAccent } = useAccent(resolvedTheme);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  // Position the popover below the trigger button
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPopoverStyle({
      position: "fixed",
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }, [open]);

  // Close on Escape or outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  const currentPreset = ACCENT_PRESETS.find((p) => p.id === accentId)!;

  const popover = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={popoverStyle}
          className="z-[90] min-w-[160px] rounded-xl border border-border bg-card p-2.5 shadow-premium"
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
                onClick={() => { setAccent(preset.id); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                  preset.id === accentId
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-accent",
                )}
              >
                {/* Swatch */}
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
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Accent color: ${currentPreset.label}. Click to change.`}
        aria-expanded={open}
        className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex items-center justify-center relative"
      >
        <Palette className="h-4.5 w-4.5" />
        {/* Live swatch dot */}
        <span
          className="absolute bottom-1 right-1 h-2 w-2 rounded-full ring-1 ring-card"
          style={{ background: currentPreset.swatch }}
        />
      </button>

      {typeof document !== "undefined" &&
        createPortal(popover, document.body)}
    </>
  );
}
