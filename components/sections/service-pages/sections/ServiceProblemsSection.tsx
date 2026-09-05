"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { ServiceSectionShell } from "../primitives/ServiceSectionShell";

export function ServiceProblemsSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <ServiceSectionShell
      id="problems"
      label="Problems"
      title="Problems I solve"
      description="Common challenges this service addresses — stated plainly, without generic agency filler."
      width="wide"
    >
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 sm:grid-cols-2">
        {service.problems.map((problem, i) => (
          <motion.li
            key={problem.title}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card p-6 dark:bg-card/80"
          >
            <h3 className="font-heading text-base font-bold text-foreground">{problem.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {problem.description}
            </p>
          </motion.li>
        ))}
      </ul>
    </ServiceSectionShell>
  );
}
