"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { ServiceSectionShell } from "../primitives/ServiceSectionShell";

/** Layered technology ecosystem — category rails with interactive chips. */
export function ServiceTechnologiesSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const groups = service.technologies;

  return (
    <ServiceSectionShell
      id="technologies"
      label="Technologies"
      title="Technologies & tools"
      description="Stack grouped by layer — chosen for maintainability, not hype."
      width="wide"
    >
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/50 p-5 shadow-premium dark:bg-card/30 sm:p-8">
        {/* Ambient depth */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl"
          aria-hidden
        />

        <ul className="relative space-y-5 sm:space-y-6">
          {groups.map((group, i) => (
            <motion.li
              key={group.category}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-3 sm:grid-cols-[140px_1fr] sm:items-start sm:gap-6 lg:grid-cols-[160px_1fr]"
            >
              <div className="flex items-center gap-2.5 sm:pt-1.5">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 font-mono text-[10px] font-bold text-primary",
                  )}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
                  {group.category}
                </h3>
              </div>

              <div className="relative min-w-0">
                {/* Soft connector line between layers on desktop */}
                {/* {i < groups.length - 1 ? (
                  <span
                    className="pointer-events-none absolute -bottom-5 left-3 hidden h-5 w-px bg-gradient-to-b from-border to-transparent sm:block"
                    aria-hidden
                  />
                ) : null} */}

                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item, j) => (
                    <motion.li
                      key={item}
                      initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i * 0.05 + j * 0.03, 0.35) }}
                    >
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5",
                          "text-sm font-medium text-foreground shadow-sm",
                          "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-glow",
                          "dark:bg-background/40",
                        )}
                      >
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </ServiceSectionShell>
  );
}
