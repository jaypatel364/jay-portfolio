"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp } from "lucide-react";

type StatItem = { label?: string; value?: string };

export function BlogStatsBlock({ items }: { items: StatItem[] }) {
  const reduced = useReducedMotion() ?? false;

  if (!items.length) return null;

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          whileHover={reduced ? undefined : { y: -2 }}
          className="group relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card/80 via-card/50 to-primary/[0.04] px-5 py-6 text-center shadow-sm transition-shadow hover:border-primary/25 hover:shadow-[0_8px_32px_var(--primary)_/_0.08]"
        >
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60"
            aria-hidden
          />
          <div className="relative z-10">
            <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" aria-hidden />
            </div>
            <p className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-[1.75rem]">
              {item.value}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {item.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
