"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";

/** Technology as layered story — not a logo grid. */
export function ServiceTechLayers({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="w-full bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          Technology
        </p>
        <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Stack in context
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Tools chosen for product stage, team skills, and maintainability — not trend cycles.
        </p>

        <div className="relative mt-12 space-y-0">
          {service.technologies.map((group, i) => (
            <motion.div
              key={group.category}
              initial={reduced ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="grid gap-4 border-t border-border/70 py-6 sm:grid-cols-[180px_1fr] sm:items-center"
            >
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                {group.category}
              </h3>
              <p className="text-base font-medium leading-relaxed text-foreground">
                {group.items.join(" · ")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
