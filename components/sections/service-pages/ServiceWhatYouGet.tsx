"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { Service } from "@/lib/services/types";

/** Concrete deliverables — editorial two-column, not icon cards. */
export function ServiceWhatYouGet({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const items = service.whatWeBuild ?? service.deliverables.map((d) => d.title);

  return (
    <section className="w-full py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Deliverables
            </p>
            <h2 className="font-heading mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
              What you get is a product foundation — not a slide deck.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Tangible outputs from {service.title.toLowerCase()} engagements, scoped to what your
              product actually needs.
            </p>
          </div>

          <motion.ul
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="divide-y divide-border/80 border-y border-border/80"
          >
            {items.map((item, i) => (
              <li key={item} className="flex items-start gap-4 py-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="font-heading font-semibold text-foreground">{item}</p>
                  {service.deliverables[i]?.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {service.deliverables[i].description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
