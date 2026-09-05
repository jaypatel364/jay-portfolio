"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";

/** When you need this + who it's for — merged, editorial. */
export function ServiceFitSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="w-full py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Signs you need this
            </p>
            <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight">Sound familiar?</h2>
            <ul className="mt-8 space-y-4">
              {service.problems.slice(0, 5).map((p, i) => (
                <motion.li
                  key={p.title}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-l-2 border-primary/40 pl-4"
                >
                  <p className="font-heading font-semibold text-foreground">{p.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                </motion.li>
              ))}
            </ul>
            <p className="mt-8 font-heading text-lg font-semibold text-primary">
              That&apos;s where {service.title.toLowerCase()} comes in.
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Built for
            </p>
            <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight">Who this is for</h2>
            <ul className="mt-8 divide-y divide-border/70">
              {service.audiences.map((aud) => (
                <li key={aud.title} className="py-5 first:pt-0">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-foreground">
                    {aud.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {aud.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
