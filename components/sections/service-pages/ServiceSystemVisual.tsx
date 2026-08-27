"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { ServiceDetailHeroVisual } from "./hero-visuals/ServiceDetailHeroVisual";

/** Full-bleed system visualization. */
export function ServiceSystemVisual({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="system"
      className="scroll-mt-32 w-full bg-[oklch(0.15_0.012_265)] py-16 text-foreground md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              System
            </p>
            <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How the pieces connect
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {service.whatWeDo.paragraphs[0]}
            </p>
            {service.industries?.length ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {service.industries.map((ind) => (
                  <li
                    key={ind}
                    className="rounded-md border border-border/50 bg-background/10 px-2.5 py-1 text-xs text-foreground/85"
                  >
                    {ind}
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.div>

          <div className="relative min-h-[320px] lg:min-h-[400px]">
            <ServiceDetailHeroVisual slug={service.slug} title={`${service.title} system`} large />
          </div>
        </div>
      </div>
    </section>
  );
}
