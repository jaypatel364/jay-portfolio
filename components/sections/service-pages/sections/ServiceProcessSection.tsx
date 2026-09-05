"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { ServiceSectionShell } from "../primitives/ServiceSectionShell";

/** Compact process — all steps visible; detail expands in one panel (less scroll). */
export function ServiceProcessSection({ service }: { service: Service }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const steps = service.process;
  const current = steps[active] ?? steps[0];

  return (
    <ServiceSectionShell
      id="process"
      label="Process"
      title="My process"
      description="How I approach this service from discovery through delivery."
      theme="muted"
      width="wide"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start lg:gap-10">
        {/* Step selector — dense grid, not a tall vertical timeline */}
        <ol className="grid gap-2 sm:grid-cols-2">
          {steps.map((step, index) => {
            const selected = active === index;
            return (
              <li key={step.title}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={selected}
                  className={cn(
                    "group flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200",
                    selected
                      ? "border-primary/40 bg-primary/[0.07] shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_20%,transparent)]"
                      : "border-border/70 bg-card/60 hover:border-primary/25 hover:bg-primary/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold tabular-nums transition-colors",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary group-hover:bg-primary/15",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 pt-1">
                    <span
                      className={cn(
                        "font-heading block text-sm font-bold leading-snug tracking-tight sm:text-[15px]",
                        selected ? "text-primary" : "text-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Active step detail */}
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-premium sm:p-7">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
            Step {String(active + 1).padStart(2, "0")} of {String(steps.length).padStart(2, "0")}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={current?.title}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="font-heading mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {current?.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {current?.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
            <button
              type="button"
              disabled={active === 0}
              onClick={() => setActive((v) => Math.max(0, v - 1))}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={active >= steps.length - 1}
              onClick={() => setActive((v) => Math.min(steps.length - 1, v + 1))}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:underline disabled:opacity-40"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </ServiceSectionShell>
  );
}
