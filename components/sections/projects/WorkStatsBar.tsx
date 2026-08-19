"use client";

import { motion } from "framer-motion";
import { Briefcase, Code2, Layers, Rocket } from "lucide-react";
import { features } from "@/settings/features";
import { getWorkPageStats } from "@/settings/projects";
import { cn } from "@/lib/utils";

const STAT_ICONS = [Briefcase, Rocket, Layers, Code2] as const;

/** Work page — quick scan stats above the project catalog. */
export function WorkStatsBar() {
  const stats = getWorkPageStats();

  const items = [
    { label: "Selected projects", value: stats.projectCount },
    { label: "Production builds", value: stats.productionCount },
    { label: "Technologies", value: stats.techCount },
    ...(features.showCaseStudies && stats.caseStudyCount > 0
      ? [{ label: "Case studies", value: stats.caseStudyCount }]
      : [{ label: "Live demos", value: stats.demoCount }]),
  ];

  return (
    <section
      aria-label="Work overview stats"
      className="border-b border-border/60 pb-8 pt-2 md:pb-10"
    >
      <motion.ul
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="grid list-none grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
      >
        {items.map(({ label, value }, i) => {
          const Icon = STAT_ICONS[i] ?? Briefcase;

          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 px-4 py-4 backdrop-blur-sm",
                "transition-colors hover:border-primary/20 hover:bg-card",
              )}
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                <Icon className="h-4 w-4" strokeWidth={2.1} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-2xl font-bold tabular-nums leading-none">
                  {value}
                </span>
                <span className="mt-1 block text-xs font-medium text-muted-foreground">
                  {label}
                </span>
              </span>
            </li>
          );
        })}
      </motion.ul>
    </section>
  );
}
