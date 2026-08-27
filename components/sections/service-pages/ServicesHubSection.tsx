"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Gauge,
  Layout,
  Monitor,
  Rocket,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { Service, ServiceCta } from "@/lib/services/types";
import { servicePath } from "@/lib/services";
import {
  serviceCardClass,
  serviceIconWrapClass,
} from "@/components/sections/services/service-card-styles";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  layout: Layout,
  monitor: Monitor,
  server: Server,
  rocket: Rocket,
  gauge: Gauge,
};

interface ServicesHubSectionProps {
  services: Service[];
  primaryCta: ServiceCta;
  secondaryCta?: ServiceCta;
}

/** Hub grid — evolved from Skills page ServicesSection card language. */
export function ServicesHubSection({
  services,
  primaryCta,
  secondaryCta,
}: ServicesHubSectionProps) {
  return (
    <section aria-labelledby="services-hub-heading" className="py-4 md:py-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Overview
        </span>
        <h2
          id="services-hub-heading"
          className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          Product engineering services
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          The expanded version of what you see on Skills — each page goes deep on scope, system
          design, process, and proof.
        </p>
      </div>

      <ul className="mt-12 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {services.map((service, i) => {
          const Icon = ICON_MAP[service.icon] ?? Layout;
          const href = servicePath(service.slug);

          return (
            <motion.li
              key={service.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.45,
                delay: Math.min(i * 0.04, 0.28),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
            >
              <article className={cn(serviceCardClass, "hover:-translate-y-1")}>
                <Link
                  href={href}
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="sr-only">View {service.title}</span>
                </Link>

                <div className="relative flex items-start justify-between gap-3">
                  <span className={cn(serviceIconWrapClass)}>
                    <Icon className="h-5 w-5" strokeWidth={2.1} aria-hidden />
                  </span>
                  <span className="font-mono text-[11px] font-semibold tabular-nums text-muted-foreground/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-heading relative mt-5 text-lg font-bold tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {service.shortDescription}
                </p>

                <ul className="relative mt-4 space-y-1">
                  {service.cardCapabilities.slice(0, 3).map((cap) => (
                    <li key={cap} className="text-xs text-muted-foreground">
                      — {cap}
                    </li>
                  ))}
                </ul>

                <p className="relative mt-5 text-sm font-semibold text-primary">View service →</p>
              </article>
            </motion.li>
          );
        })}
      </ul>

      <div className="mt-14 flex flex-col items-center gap-3 pt-10 sm:flex-row sm:justify-center">
        <Link
          href={primaryCta.href}
          className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {primaryCta.label}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </Link>
        {secondaryCta ? (
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center justify-center rounded-full border border-border bg-card/70 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/35 hover:bg-primary/5"
          >
            {secondaryCta.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
