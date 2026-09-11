"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  LifeBuoy,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  compass: Compass,
  layers: Layers,
  rocket: Rocket,
  "life-buoy": LifeBuoy,
};

export const PROCESS_ICON_CYCLE = ["compass", "layers", "rocket", "life-buoy"] as const;

export type ProcessStep = {
  title: string;
  description: string;
  icon?: string;
};

interface ProcessInteractiveProps {
  steps: ProcessStep[];
  /** Section element id — used for keyboard navigation scope. */
  sectionId?: string;
  /** Use the full parent width — recommended when there are 5+ steps. */
  fullWidth?: boolean;
  className?: string;
}

/** Horizontal step rail + detail panel — shared by Skills and service pages. */
export function ProcessInteractive({
  steps,
  sectionId = "process",
  fullWidth = true,
  className,
}: ProcessInteractiveProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  const lastIndex = steps.length - 1;
  const nextStep = active < lastIndex ? steps[active + 1] : null;
  const prevStep = active > 0 ? steps[active - 1] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest?.(`#${sectionId}`)) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => Math.min(lastIndex, v + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => Math.max(0, v - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lastIndex, sectionId]);

  if (steps.length === 0) return null;

  const widthClass = fullWidth ? "w-full" : "mx-auto w-full max-w-3xl";
  const denseRail = steps.length > 4;

  return (
    <div className={cn("min-w-0 w-full max-w-full", className)}>
      {/*
        Rail: node — connector — node — … so the progress line never runs under icons.
        Click to select (no hover-jump). Past steps show a check on solid background.
      */}
      <div
        className={cn(
          widthClass,
          "min-w-0 max-w-full overflow-x-auto overscroll-x-contain scroll-px-4 py-2 sm:overflow-x-clip sm:px-6",
        )}
      >
        <ol
          className="flex w-full min-w-0 list-none items-start"
          aria-label="Delivery process steps"
        >
          {steps.map((step, i) => {
            const iconKey = step.icon ?? PROCESS_ICON_CYCLE[i % PROCESS_ICON_CYCLE.length];
            const Icon = ICON_MAP[iconKey] ?? Compass;
            const isActive = active === i;
            const isDone = i < active;
            const segmentFilled = i <= active;

            return (
              <li
                key={step.title}
                className={cn("flex items-start", i === 0 ? "flex-none" : "min-w-0 flex-1")}
              >
                {i > 0 && (
                  <div
                    aria-hidden
                    className="mt-6 flex h-[2px] min-w-[0.75rem] flex-1 items-center px-1.5 sm:px-2.5"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-border">
                      <motion.div
                        className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
                        initial={false}
                        animate={{ scaleX: segmentFilled ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 340, damping: 36 }}
                      />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "flex shrink-0 flex-col items-center",
                    denseRail ? "w-16 sm:w-[4.5rem] lg:w-20" : "w-14 sm:w-[5.5rem]",
                  )}
                >
                  <button
                    type="button"
                    aria-current={isActive ? "step" : undefined}
                    aria-controls={`${baseId}-panel-${i}`}
                    id={`${baseId}-tab-${i}`}
                    aria-label={`Step ${i + 1}: ${step.title}`}
                    onClick={() => setActive(i)}
                    className={cn(
                      "group flex w-full flex-col items-center gap-2.5 rounded-xl px-0.5 text-center",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    )}
                  >
                    <span
                      className={cn(
                        "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-300",
                        isActive &&
                          "border-primary bg-primary text-primary-foreground shadow-glow sm:scale-105",
                        isDone && !isActive && "border-primary bg-background text-primary",
                        !isActive &&
                          !isDone &&
                          "border-border bg-card text-muted-foreground group-hover:border-primary/45 group-hover:text-foreground",
                      )}
                    >
                      {isDone && !isActive ? (
                        <Check className="h-5 w-5" strokeWidth={2.4} aria-hidden />
                      ) : (
                        <Icon className="h-5 w-5" strokeWidth={2.1} aria-hidden />
                      )}
                    </span>

                    <span className="flex w-full flex-col items-center gap-0.5">
                      <span
                        className={cn(
                          "font-mono text-[10px] font-semibold tabular-nums transition-colors",
                          isActive || isDone ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "w-full px-1 text-balance text-center text-[10px] font-semibold leading-snug transition-colors sm:text-sm",
                          isActive
                            ? "text-foreground"
                            : isDone
                              ? "text-foreground/80"
                              : "text-muted-foreground",
                        )}
                      >
                        {step.title}
                      </span>
                    </span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/*
        All step panels stay in the DOM for SEO; only the active one is visible.
        Inactive panels use the HTML `hidden` attribute (display:none) — still crawlable source.
      */}
      <div className={cn(widthClass, "mt-10 min-w-0 max-w-full")}>
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-premium sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          {steps.map((step, i) => {
            const isActive = active === i;
            const iconKey = step.icon ?? PROCESS_ICON_CYCLE[i % PROCESS_ICON_CYCLE.length];
            const Icon = ICON_MAP[iconKey] ?? Compass;

            return (
              <article
                key={step.title}
                id={`${baseId}-panel-${i}`}
                aria-labelledby={`${baseId}-tab-${i}`}
                hidden={!isActive}
                className="relative"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                  <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-glow">
                    <Icon className="h-6 w-6" strokeWidth={2.1} aria-hidden />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-xs font-semibold tabular-nums text-primary">
                        Step {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        of {String(steps.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-heading mt-1.5 text-2xl font-bold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="relative mt-7 flex min-w-0 items-center justify-between gap-2 border-t border-border/60 pt-5 sm:gap-3">
            <button
              type="button"
              onClick={() => setActive((v) => Math.max(0, v - 1))}
              disabled={!prevStep}
              className={cn(
                "inline-flex min-w-0 shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                "disabled:pointer-events-none disabled:opacity-35",
              )}
            >
              <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <div
              className="hidden min-w-0 items-center justify-center gap-0.5 overflow-hidden sm:flex"
              role="group"
              aria-label="Jump to process step"
            >
              {steps.map((step, i) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to step ${i + 1}: ${step.title}`}
                  aria-current={i === active ? "step" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background group",
                    denseRail ? "h-9 w-8" : "h-11 w-11",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block rounded-full transition-all duration-300",
                      i === active
                        ? "h-1.5 w-5 bg-primary"
                        : i < active
                          ? "h-1.5 w-1.5 bg-primary/45"
                          : "h-1.5 w-1.5 bg-border group-hover:bg-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActive((v) => Math.min(lastIndex, v + 1))}
              disabled={!nextStep}
              className={cn(
                "inline-flex min-w-0 shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                "disabled:pointer-events-none disabled:opacity-35",
              )}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
