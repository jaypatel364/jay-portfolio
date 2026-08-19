"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Database,
  FileStack,
  Gauge,
  Layout,
  Monitor,
  Plug,
  Server,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { innerPages } from "@/settings/pages";

const ICON_MAP: Record<string, LucideIcon> = {
  layout: Layout,
  monitor: Monitor,
  server: Server,
  zap: Zap,
  forms: FileStack,
  database: Database,
  plug: Plug,
  gauge: Gauge,
  wrench: Wrench,
};

/** Soft checkerboard tones using theme tokens (light + dark safe). */
const CARD_TONES = [
  "bg-primary/[0.06] hover:bg-primary/[0.1]",
  "bg-muted/70 hover:bg-muted",
  "bg-primary/[0.06] hover:bg-primary/[0.1]",
  "bg-muted/70 hover:bg-muted",
  "bg-primary/[0.06] hover:bg-primary/[0.1]",
  "bg-muted/70 hover:bg-muted",
  "bg-primary/[0.06] hover:bg-primary/[0.1]",
  "bg-muted/70 hover:bg-muted",
  "bg-primary/[0.06] hover:bg-primary/[0.1]",
] as const;

export function ServicesSection() {
  const { services } = siteConfig;
  const [hovered, setHovered] = useState<number | null>(null);
  const contactHref = `${innerPages.contact.path}/`;

  return (
    <section id="services" aria-labelledby="services-heading" className="relative py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {services.label}
          </span>
          <h2
            id="services-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            {services.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {services.intro}
          </p>
        </motion.div>

        <ul className="mt-12 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Layout;
            const isActive = hovered === i;

            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(i * 0.04, 0.28),
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
              >
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 p-6 transition-all duration-300 sm:p-7",
                    CARD_TONES[i % CARD_TONES.length],
                    isActive && "border-primary/35 shadow-glow -translate-y-1",
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-background/70 text-primary shadow-sm transition-all duration-300",
                        isActive &&
                          "scale-105 border-primary/40 bg-primary text-primary-foreground shadow-glow",
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.1} aria-hidden />
                    </span>
                    <span className="font-mono text-[11px] font-semibold tabular-nums text-muted-foreground/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-heading relative mt-5 text-lg font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
