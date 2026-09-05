"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { ServiceSectionShell } from "../primitives/ServiceSectionShell";

export function ServiceAudiencesSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <ServiceSectionShell
      id="audiences"
      label="Fit"
      title="Who this service is for"
      description="Recognize yourself in one of these profiles — each maps to a different starting point."
      width="wide"
    >
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 md:grid-cols-2">
        {service.audiences.map((audience, i) => (
          <motion.li
            key={audience.title}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-6 dark:bg-card/80 md:p-8"
          >
            <h3 className="font-heading text-xl font-bold text-foreground">{audience.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {audience.description}
            </p>
          </motion.li>
        ))}
      </ul>
    </ServiceSectionShell>
  );
}
