"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel, cn } from "@/lib/utils";

/**
 * About-page only — personal “Who I am” after the hero.
 * Intentionally different from the home About strip (story + focus + GitHub).
 */
export function WhoAmISection() {
  const { whoAmI } = siteConfig;
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);

  return (
    <section
      id="who-am-i"
      aria-labelledby="who-am-i-heading"
      className="relative px-4 py-14 sm:px-6 md:py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <div className="grid min-w-0 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Editorial column ── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 lg:col-span-7"
          >
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              $ whoami
            </span>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {whoAmI.label}
            </p>
            <h2
              id="who-am-i-heading"
              className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            >
              {whoAmI.title}
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed">
              {whoAmI.lead}
            </p>

            <div className="mt-6 space-y-4">
              {whoAmI.body.map((paragraph) => {
                const text = paragraph.replace("{year}", siteConfig.careerStartDate.slice(0, 4));
                return (
                  <p
                    key={text.slice(0, 48)}
                    className="text-base leading-relaxed text-muted-foreground"
                  >
                    {text}
                  </p>
                );
              })}
            </div>
          </motion.div>

          {/* ── Snapshot rail ── */}
          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 lg:col-span-5 lg:sticky lg:top-28"
          >
            <div className="rounded-2xl border border-border/80 bg-card/40 p-6 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Snapshot
              </p>
              <p className="mt-1 font-heading text-lg font-bold tracking-tight">
                {expLabel} years in production
              </p>

              <dl className="mt-6 space-y-0 divide-y divide-border/70">
                {whoAmI.snapshot.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <dt className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-sm font-medium text-foreground sm:text-right">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.aside>
        </div>

        {/* ── Principles — numbered, not card soup ── */}
        <ol className="mt-14 grid list-none gap-0 border-t border-border/80 sm:mt-16 md:grid-cols-3 md:divide-x md:divide-border/80">
          {whoAmI.principles.map((principle, i) => (
            <motion.li
              key={principle.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.45,
                delay: Math.min(i * 0.06, 0.2),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "border-b border-border/80 py-8 last:border-b-0 md:border-b-0 md:px-8 md:py-10",
                i === 0 && "md:pl-0",
                i === whoAmI.principles.length - 1 && "md:pr-0",
              )}
            >
              <span className="font-mono text-xs font-semibold tabular-nums text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading mt-3 text-lg font-bold tracking-tight">
                {principle.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {principle.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
