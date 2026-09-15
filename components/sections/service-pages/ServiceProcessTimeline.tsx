"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceProcessTimeline({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <SectionFrame
      id="process"
      label="Process"
      title="How I approach this work"
      description="Service-specific steps — not a generic agency checklist."
      theme="muted"
      fullBleed
    >
      <div className="relative">
        <div
          className="hidden lg:absolute lg:left-0 lg:right-0 lg:top-[2.75rem] lg:block lg:h-px lg:bg-border/80"
          aria-hidden
        />

        <ol className="grid gap-8 lg:grid-cols-4 lg:gap-6">
          {service.process.slice(0, 8).map((step, index) => (
            <motion.li
              key={step.title}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className="relative"
            >
              <div className="mb-4 flex items-center gap-3 lg:flex-col lg:items-start">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 font-mono text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-foreground lg:mt-2">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground lg:pr-2">
                {step.description}
              </p>
              {index < service.process.length - 1 ? (
                <span className="mt-6 block font-mono text-primary/50 lg:hidden" aria-hidden>
                  ↓
                </span>
              ) : null}
            </motion.li>
          ))}
        </ol>
      </div>
    </SectionFrame>
  );
}
