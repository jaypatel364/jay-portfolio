"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/services/types";
import { servicePath } from "@/lib/services";
import { cn } from "@/lib/utils";

/** Editorial capability index — numbered rows, not a card grid. */
export function ServiceCapabilityIndex({ service }: { service: Service }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const cap = service.capabilities[active];

  return (
    <section
      id="capabilities"
      className="scroll-mt-32 w-full border-y border-border/60 bg-muted/15 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            What we do
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {service.whatWeDo.heading}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-border/80 border-y border-border/80">
          {service.capabilities.map((item, index) => {
            const selected = active === index;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "group flex w-full flex-col gap-3 py-6 text-left transition-colors sm:flex-row sm:items-start sm:gap-8 md:py-8",
                  selected && "bg-primary/[0.03]",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-sm font-bold tabular-nums transition-colors",
                    selected ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "font-heading text-xl font-bold tracking-tight sm:text-2xl",
                      selected ? "text-primary" : "text-foreground",
                    )}
                  >
                    {item.title}
                  </h3>
                  <motion.p
                    initial={false}
                    animate={{ opacity: selected ? 1 : 0.65 }}
                    className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    {item.description}
                  </motion.p>
                  {selected && item.relatedServiceSlug ? (
                    <Link
                      href={servicePath(item.relatedServiceSlug)}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Related service
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {!reduced && cap ? (
          <p className="sr-only" aria-live="polite">
            {cap.title}: {cap.description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
