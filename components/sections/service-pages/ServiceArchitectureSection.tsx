"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { SectionFrame } from "./primitives/SectionFrame";
import { ServiceDetailHeroVisual } from "./hero-visuals/ServiceDetailHeroVisual";

/** Large architecture section — reuses service-specific flow diagram at larger scale. */
export function ServiceArchitectureSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <SectionFrame
      id="architecture"
      label="Architecture"
      title="How the system comes together"
      description="A simplified view of how components connect — tailored to this service."
      theme="dark"
      fullBleed
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4 text-sm leading-relaxed text-muted-foreground"
        >
          {service.whatWeDo.paragraphs.slice(0, 2).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          {service.industries?.length ? (
            <div className="pt-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                Relevant industries
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.industries.map((ind) => (
                  <li
                    key={ind}
                    className="rounded-md border border-border/60 bg-background/40 px-2.5 py-1 text-xs text-foreground/90"
                  >
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </motion.div>

        <div className="relative">
          <ServiceDetailHeroVisual slug={service.slug} title={`${service.title} architecture`} />
        </div>
      </div>
    </SectionFrame>
  );
}
