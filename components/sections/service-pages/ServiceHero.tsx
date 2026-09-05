"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/services/types";
import { ServiceBreadcrumbs } from "./ServiceBreadcrumbs";
import { ServiceDetailHeroVisual } from "./hero-visuals/ServiceDetailHeroVisual";

interface ServiceHeroProps {
  service: Service;
}

export function ServiceHero({ service }: ServiceHeroProps) {
  const reduced = useReducedMotion() ?? false;
  const lines = service.hero.headlineLines ?? [service.hero.heading];

  return (
    <header className="relative w-full overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" aria-hidden />
      <div
        className="aurora-blob pointer-events-none absolute -left-32 top-0 h-72 w-72 bg-primary opacity-30"
        style={{ animation: reduced ? undefined : "aurora-1 14s ease-in-out infinite" }}
      />
      <div
        className="aurora-blob pointer-events-none absolute -right-24 bottom-0 h-56 w-56 bg-glow opacity-25"
        style={{ animation: reduced ? undefined : "aurora-2 16s ease-in-out infinite" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 md:pb-28 md:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,440px)] lg:gap-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0"
        >
          <ServiceBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services/" },
              { label: service.title },
            ]}
            className="mb-8"
          />

          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            {service.title}
          </p>

          <h1 className="font-heading mt-5 text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight">
            {lines.map((line, i) => (
              <span key={line} className="block text-balance">
                {i === lines.length - 1 ? <span className="text-primary">{line}</span> : line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {service.hero.description}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={service.hero.primaryCta.href}
              className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {service.hero.primaryCta.label}
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/work/"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card/70 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/35 hover:bg-primary/5"
            >
              Explore work
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full min-w-0 lg:mx-0"
        >
          <ServiceDetailHeroVisual slug={service.slug} title={service.title} large />
        </motion.div>
      </div>
    </header>
  );
}
