"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service, ServiceWhyHireReason } from "@/lib/services/types";
import { getServiceSectionHeading, getServiceSectionSupport } from "@/lib/services";
import { cn } from "@/lib/utils";
import { SERVICE_CONTACT_CTA } from "@/settings/services/shared";

const BENTO_SPANS = [
  "md:col-span-2 md:row-span-1",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-2",
] as const;

function ReasonCard({
  reason,
  index,
  reduced,
}: {
  reason: ServiceWhyHireReason;
  index: number;
  reduced: boolean;
}) {
  const span = BENTO_SPANS[index % BENTO_SPANS.length];
  const featured = index === 0 || index === 3;

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.07, 0.28),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("min-w-0 list-none", span)}
    >
      <article
        className={cn(
          "group relative flex h-full min-h-[11.5rem] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 transition-all duration-300",
          "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glow",
          featured && "bg-gradient-to-br from-card via-card to-primary/[0.04]",
        )}
      >
        <span
          className="pointer-events-none absolute -right-2 -top-3 font-mono text-[5.5rem] font-bold leading-none text-foreground/[0.04] select-none"
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={cn(
            "relative z-10 inline-flex w-fit rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest",
            featured
              ? "border-primary/25 bg-primary/10 text-primary"
              : "border-border/80 bg-muted/50 text-muted-foreground",
          )}
        >
          {reason.tag}
        </span>

        <h3
          className={cn(
            "relative z-10 mt-4 font-heading font-bold tracking-tight text-foreground",
            featured ? "text-xl sm:text-2xl" : "text-lg",
          )}
        >
          {reason.title}
        </h3>

        <p className="relative z-10 mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {reason.description}
        </p>

        <div
          className={cn(
            "relative z-10 mt-5 h-px w-8 bg-gradient-to-r from-primary/70 to-transparent transition-[width] duration-500 group-hover:w-16",
          )}
          aria-hidden
        />
      </article>
    </motion.li>
  );
}

export function ServiceWhyHireSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const { reasons, highlights } = service.whyHire;
  const whyHireHeading = getServiceSectionHeading(service, "whyHire");
  const whyHireSupport = getServiceSectionSupport(service, "whyHire");

  return (
    <section
      id="why-hire"
      aria-labelledby="why-hire-heading"
      className="relative scroll-mt-28 overflow-hidden py-16 md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.12),transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.header
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Why hire me
          </span>
          <h2
            id="why-hire-heading"
            className="font-heading mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-[2.75rem]"
          >
            {whyHireHeading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {whyHireSupport}
          </p>
        </motion.header>

        <ul className="mt-12 grid list-none gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {reasons.map((reason, i) => (
            <ReasonCard key={reason.title} reason={reason} index={i} reduced={reduced} />
          ))}
        </ul>

        {highlights?.length ? (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 sm:mt-10 sm:grid-cols-3"
          >
            {highlights.map((item) => (
              <div
                key={item.label}
                className="bg-card/90 px-5 py-4 text-center dark:bg-card/70 sm:py-5"
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-foreground sm:text-[15px]">
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>
        ) : null}

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center sm:mt-12"
        >
          <Link
            href={SERVICE_CONTACT_CTA.href}
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/35 hover:bg-primary/5 hover:text-primary"
          >
            {SERVICE_CONTACT_CTA.label}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
