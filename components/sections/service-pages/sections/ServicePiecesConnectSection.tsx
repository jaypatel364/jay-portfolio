"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { ServiceDetailHeroVisual } from "../hero-visuals/ServiceDetailHeroVisual";
import { ServiceSectionShell } from "../primitives/ServiceSectionShell";

/** How technical layers connect — theme-aware diagram, service-specific flows. */
export function ServicePiecesConnectSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <ServiceSectionShell
      id="pieces-connect"
      label="System"
      title="How the pieces connect"
      description="These are not isolated deliverables — they work together as one product system."
      theme="contrast"
      width="wide"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          {service.whatWeDo.paragraphs.slice(0, 2).map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          {service.industries?.length ? (
            <div className="pt-2">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
                Where this shows up
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.industries.map((ind) => (
                  <li
                    key={ind}
                    className="rounded-md border border-border/70 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground dark:bg-background/40"
                  >
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </motion.div>

        <div className="relative min-h-[320px] lg:min-h-[380px]">
          <ServiceDetailHeroVisual
            slug={service.slug}
            title={`${service.title} system architecture`}
            large
          />
        </div>
      </div>
    </ServiceSectionShell>
  );
}
