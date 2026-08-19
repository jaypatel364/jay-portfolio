"use client";

import { motion } from "framer-motion";
import { Compass, Layers, LifeBuoy, Rocket, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  compass: Compass,
  layers: Layers,
  rocket: Rocket,
  "life-buoy": LifeBuoy,
};

/** Skills page — four-step delivery process. */
export function ProcessSection() {
  const { process } = siteConfig;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative border-t border-border/60 py-10 md:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {process.label}
          </span>
          <h2
            id="process-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            {process.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {process.intro}
          </p>
        </motion.div>

        <ol className="relative mt-12 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[2.75rem] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />

          {process.steps.map((step, i) => {
            const Icon = ICON_MAP[step.icon] ?? Compass;

            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(i * 0.06, 0.24),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300",
                    "hover:border-primary/25 hover:shadow-glow",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" strokeWidth={2.1} aria-hidden />
                    </span>
                    <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-heading mt-5 text-lg font-bold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
