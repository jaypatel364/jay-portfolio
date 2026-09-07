"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service, ServiceBenefit } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA } from "@/settings/services/shared";
import { cn } from "@/lib/utils";

const KIND_META = {
  benefit: {
    label: "Benefit",
    stripe: "from-primary via-primary/70 to-primary/15",
    chip: "border-primary/15 bg-primary/5 text-primary",
    cardHover: "hover:border-primary/35 hover:shadow-glow",
    underline: "from-primary/70",
  },
  outcome: {
    label: "Outcome",
    stripe:
      "from-emerald-500/90 via-emerald-500/50 to-emerald-500/10 dark:from-emerald-400/80 dark:via-emerald-400/45 dark:to-emerald-400/10",
    chip: "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
    cardHover:
      "hover:border-emerald-500/35 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.28)] dark:hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.22)]",
    underline: "from-emerald-500/70",
  },
} as const;

function BenefitOutcomeCard({
  benefit,
  index,
  reduced,
}: {
  benefit: ServiceBenefit;
  index: number;
  reduced: boolean;
}) {
  const meta = KIND_META[benefit.kind];

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="min-w-0"
    >
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card",
          "transition-all duration-300 hover:-translate-y-1",
          meta.cardHover,
        )}
      >
        <div
          className={cn(
            "h-1 w-full bg-gradient-to-r transition-[height] duration-300 group-hover:h-1.5",
            meta.stripe,
          )}
          aria-hidden
        />

        <div className="relative flex flex-1 flex-col p-5 sm:p-6 md:p-7">
          <span
            className={cn(
              "inline-flex w-fit rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
              meta.chip,
            )}
          >
            {meta.label}
          </span>

          <h3 className="font-heading mt-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {benefit.title}
          </h3>

          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {benefit.description}
          </p>

          <div
            className={cn(
              "mt-5 h-px w-0 bg-gradient-to-r to-transparent transition-[width] duration-500 group-hover:w-full",
              meta.underline,
            )}
            aria-hidden
          />
        </div>
      </article>
    </motion.li>
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
        <motion.header
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Value
          </span>
          <h2
            id="benefits-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Benefits & outcomes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            What you gain from the engagement, and what improves in your product after delivery —
            not vanity metrics.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            If you want clarity on scope and trade-offs before committing,{" "}
            <Link
              href={contactHref}
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              discuss your project
            </Link>{" "}
            and we will map what matters for {service.title.toLowerCase()}.
          </p>
        </motion.header>

        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-12">
          {service.benefits.map((benefit, i) => (
            <BenefitOutcomeCard key={benefit.title} benefit={benefit} index={i} reduced={reduced} />
          ))}
        </ul>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-10 sm:mt-12"
        >
          <Link
            href={contactHref}
            className="btn-shine inline-flex shrink-0 items-center justify-center gap-2 rounded-full gradient-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Schedule a call
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
