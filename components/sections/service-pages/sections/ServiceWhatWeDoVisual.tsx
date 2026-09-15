"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceWhatWeDoVisualProps {
  serviceTitle: string;
  stackItems: string[];
  className?: string;
}

/** Vertical scope panel for What I Do — all covered layers shown equally, no sequencing. */
export function ServiceWhatWeDoVisual({
  serviceTitle,
  stackItems,
  className,
}: ServiceWhatWeDoVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const layers = stackItems.slice(0, 5);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative w-full", className)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-premium",
          "sm:rounded-[1.75rem]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div
          className="pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-12 bottom-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />

        <div className="relative space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                In scope
              </p>
              <p className="font-heading mt-1.5 text-base font-bold tracking-tight text-foreground sm:text-lg">
                {serviceTitle}
              </p>
            </div>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Layers className="h-4 w-4" aria-hidden />
            </span>
          </div>

          {layers.length > 0 ? (
            <ul className="relative space-y-1" aria-label={`${serviceTitle} covered areas`}>
              <div
                className="pointer-events-none absolute bottom-3.5 left-0 top-3.5 w-7"
                aria-hidden
              >
                <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary/35" />
              </div>

              {layers.map((layer, i) => (
                <li
                  key={layer}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3 py-2.5 pr-1"
                >
                  <span className="relative z-[1] flex h-7 w-7 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground shadow-glow">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden />
                    <span className="sr-only">{String(i + 1).padStart(2, "0")} covered</span>
                  </span>
                  <span className="min-w-0 text-sm font-semibold leading-snug text-foreground">
                    {layer}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {layers.length > 0 ? (
            <p className="border-t border-border/60 pt-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {layers.length} areas covered
            </p>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
