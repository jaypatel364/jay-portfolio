"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";

export function ServiceProcessJourney({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const steps = service.process.slice(0, 6);

  return (
    <section id="process" className="scroll-mt-32 w-full border-t border-border/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          Process
        </p>
        <h2 className="font-heading mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          How we work on {service.title.toLowerCase()}
        </h2>

        <ol className="mt-14 space-y-0">
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05 }}
              className="relative border-l border-border/80 py-8 pl-8 md:pl-12"
            >
              <span className="absolute -left-px top-10 font-mono text-xs font-bold uppercase tracking-widest text-primary [writing-mode:vertical-rl] md:top-12">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading text-xl font-bold uppercase tracking-wide md:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              {index < steps.length - 1 ? (
                <span className="mt-6 block font-mono text-primary/40" aria-hidden>
                  ↓
                </span>
              ) : null}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
