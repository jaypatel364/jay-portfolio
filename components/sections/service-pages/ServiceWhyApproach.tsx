"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";

export function ServiceWhyApproach({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="w-full border-y border-border/60 bg-muted/10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Why this approach
          </p>
          <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Fast today. Flexible tomorrow.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {service.whatWeDo.paragraphs[1] ?? service.whatWeDo.paragraphs[0]}
          </p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {service.benefits.slice(0, 3).map((b, i) => (
            <motion.li
              key={b.title}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <p className="font-mono text-xs font-bold tabular-nums text-primary">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-heading mt-2 text-lg font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
