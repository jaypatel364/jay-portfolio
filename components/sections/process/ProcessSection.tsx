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
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  compass: Compass,
  layers: Layers,
  rocket: Rocket,
  "life-buoy": LifeBuoy,
};

/** Skills page — interactive four-step delivery process. */
export function ProcessSection() {
  const { process } = siteConfig;
  const [active, setActive] = useState(0);
  const baseId = useId();

  const steps = process.steps;
  const lastIndex = steps.length - 1;
  const nextStep = active < lastIndex ? steps[active + 1] : null;
  const prevStep = active > 0 ? steps[active - 1] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest?.("#process")) return;
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
  }, [lastIndex]);

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative border-t border-border/60 py-10 md:py-16"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {process.label}
          </span>
          <h2
            id="process-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            {process.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {process.intro}
          </p>
        </motion.div>

        {/*
          Rail: node — connector — node — … so the progress line never runs under icons.
          Click to select (no hover-jump). Past steps show a check on solid background.
        */}
        <div className="mx-auto mt-12 w-full min-w-0 max-w-3xl overflow-x-auto px-1 sm:px-2">
          <ol
            className="flex w-full min-w-0 list-none items-start"
            role="tablist"
            aria-label="Delivery process steps"
          >
            {steps.map((step, i) => {
              const Icon = ICON_MAP[step.icon] ?? Compass;
              const isActive = active === i;
              const isDone = i < active;
              // Fill the segment leading into this node once you've reached it
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

                  <div className="flex w-14 shrink-0 flex-col items-center sm:w-[5.5rem]">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`${baseId}-panel-${i}`}
                      id={`${baseId}-tab-${i}`}
                      onClick={() => setActive(i)}
                      className={cn(
                        "group flex w-full flex-col items-center gap-2.5 rounded-xl text-center",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    >
                      <span
                        className={cn(
                          "relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-300",
                          isActive &&
                            "scale-105 border-primary bg-primary text-primary-foreground shadow-glow",
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

                      <span className="flex flex-col items-center gap-0.5 px-0.5">
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
                            "max-w-full text-center text-[10px] font-semibold leading-tight transition-colors sm:text-sm",
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
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-premium sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            {steps.map((step, i) => {
              const isActive = active === i;
              const Icon = ICON_MAP[step.icon] ?? Compass;

              return (
                <article
                  key={step.title}
                  id={`${baseId}-panel-${i}`}
                  role="tabpanel"
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

            <div className="relative mt-7 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
              <button
                type="button"
                onClick={() => setActive((v) => Math.max(0, v - 1))}
                disabled={!prevStep}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                  "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  "disabled:pointer-events-none disabled:opacity-35",
                )}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{prevStep ? prevStep.title : "Previous"}</span>
                <span className="sm:hidden">Prev</span>
              </button>

              <div className="flex items-center gap-1.5">
                {steps.map((step, i) => (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to step ${i + 1}: ${step.title}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === active
                        ? "w-5 bg-primary"
                        : i < active
                          ? "w-1.5 bg-primary/45"
                          : "w-1.5 bg-border hover:bg-muted-foreground/40",
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActive((v) => Math.min(lastIndex, v + 1))}
                disabled={!nextStep}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                  "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  "disabled:pointer-events-none disabled:opacity-35",
                )}
              >
                <span className="hidden sm:inline">{nextStep ? nextStep.title : "Next"}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
