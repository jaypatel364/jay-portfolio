"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA } from "@/settings/services/shared";

/** Benefits visual — theme-aware workspace panel (no stock photography). */
function BenefitsVisual({ serviceTitle }: { serviceTitle: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-premium"
      role="img"
      aria-label={`Collaborative product engineering for ${serviceTitle}`}
    >
      <div className="relative aspect-[4/5] w-full sm:aspect-[5/6] lg:aspect-[4/5]">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted/70 dark:from-muted/30 dark:via-background dark:to-card" />
        <div className="absolute inset-0 bg-grid opacity-35" />
        <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20" />
        <div className="pointer-events-none absolute -right-10 bottom-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        {/* Dual workstation composition */}
        <div className="absolute inset-x-6 top-[12%] bottom-[18%] flex gap-3 sm:inset-x-8 sm:gap-4">
          <div className="flex flex-1 flex-col rounded-2xl border border-border/70 bg-background/90 p-3 shadow-inner dark:bg-background/50">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/50" />
              <span className="h-1.5 flex-1 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="grid flex-1 grid-rows-3 gap-2">
              <div className="rounded-lg bg-primary/12 dark:bg-primary/15" />
              <div className="rounded-lg bg-muted-foreground/10" />
              <div className="rounded-lg bg-muted-foreground/10" />
            </div>
          </div>
          <div className="flex flex-1 flex-col rounded-2xl border border-border/70 bg-background/80 p-3 shadow-inner dark:bg-background/40">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
              <span className="h-1.5 flex-1 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-1/2 rounded-lg bg-muted-foreground/10" />
              <div className="grid flex-1 grid-cols-2 gap-2">
                <div className="rounded-lg bg-primary/10" />
                <div className="rounded-lg bg-muted-foreground/10" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-8 bottom-6 flex items-center gap-3 rounded-xl border border-border/60 bg-card/90 px-3 py-2.5 backdrop-blur-sm dark:bg-card/70">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
            OK
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">
              Outcome-focused delivery
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Architecture · Product · Shipping
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceBenefitsSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const contactHref = SERVICE_CONTACT_CTA.href;

  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
      className="scroll-mt-28 border-y border-border/60 bg-muted/25 py-16 dark:bg-muted/10 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Intro — full width like the reference */}
        <motion.header
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Outcomes
          </span>
          <h2
            id="benefits-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Benefits & outcomes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            What improves after delivery — technical and product outcomes you can build on, not
            vanity metrics.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            If you want clarity on scope and trade-offs before committing,{" "}
            <Link
              href={contactHref}
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              discuss your project
            </Link>{" "}
            and we will map the outcomes that matter for {service.title.toLowerCase()}.
          </p>
        </motion.header>

        {/* Split: visual + checklist */}
        <div className="mt-12 grid items-start gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <BenefitsVisual serviceTitle={service.title} />
          </motion.div>

          <div className="order-1 min-w-0 lg:order-2">
            <p className="text-base font-semibold text-primary sm:text-lg">
              Benefits you get from this engagement:
            </p>

            <ul className="mt-5 space-y-1">
              {service.benefits.map((benefit, i) => (
                <motion.li
                  key={benefit.title}
                  initial={reduced ? false : { opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: Math.min(i * 0.04, 0.28), duration: 0.35 }}
                  className="group flex gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-primary/[0.04]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground sm:text-[15px]">
                      {benefit.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-8"
            >
              <Link
                href={contactHref}
                className="btn-shine inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Schedule a call
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
