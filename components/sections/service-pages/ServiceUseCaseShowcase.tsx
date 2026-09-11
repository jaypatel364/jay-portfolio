"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceUseCaseShowcase({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <SectionFrame
      id="use-cases"
      label="Use cases"
      title="Built for products that need to move"
      fullBleed
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {service.useCases.map((uc, i) => (
          <motion.li
            key={uc.title}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="group relative overflow-hidden rounded-2xl border border-border/70 p-6 transition-colors hover:border-primary/30"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-0"
              aria-hidden
            />
            <h3 className="font-heading relative text-xl font-bold text-foreground">{uc.title}</h3>
            <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
              {uc.description}
            </p>
          </motion.li>
        ))}
      </ul>

      {service.audiences.length ? (
        <div id="audiences" className="mt-16 border-t border-border/60 pt-16">
          <h3 className="font-heading text-2xl font-bold">Who this is for</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {service.audiences.map((aud) => (
              <li key={aud.title} className="rounded-xl border border-border/60 bg-card/30 p-5">
                <h4 className="font-heading font-semibold text-foreground">{aud.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{aud.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </SectionFrame>
  );
}
