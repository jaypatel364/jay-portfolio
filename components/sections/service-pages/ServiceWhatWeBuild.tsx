"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceWhatWeBuild({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const items = service.whatWeBuild ?? service.deliverables.map((d) => d.title);
  if (!items.length) return null;

  return (
    <SectionFrame
      id="what-we-build"
      label="Deliverables"
      title="What we build"
      description="Concrete outputs — not abstract service labels."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <motion.li
            key={item}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: Math.min(i * 0.04, 0.24), duration: 0.35 }}
            className="group relative overflow-hidden rounded-xl border border-border/70 bg-card/40 px-4 py-3.5 transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
          >
            <span className="font-mono text-[10px] font-bold tabular-nums text-muted-foreground/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 font-heading text-sm font-semibold text-foreground group-hover:text-primary">
              {item}
            </p>
          </motion.li>
        ))}
      </ul>
    </SectionFrame>
  );
}
