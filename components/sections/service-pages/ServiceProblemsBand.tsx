"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceProblemsBand({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <SectionFrame
      id="problems"
      label="Problems"
      title="Challenges this service addresses"
      theme="accent"
      fullBleed
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3">
        {service.problems.map((problem, i) => (
          <motion.article
            key={problem.title}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="bg-card p-6"
          >
            <h3 className="font-heading text-base font-bold text-foreground">{problem.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {problem.description}
            </p>
          </motion.article>
        ))}
      </div>
    </SectionFrame>
  );
}
