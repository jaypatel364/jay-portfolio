"use client";

import type { RefObject } from "react";
import { motion } from "framer-motion";
import { Briefcase, Code2, Layers, Rocket, type LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { features } from "@/settings/features";
import { getWorkPageStats } from "@/settings/projects";

type StatItem = {
  label: string;
  value: number;
  icon: LucideIcon;
  hint: string;
};

function StatCell({ item, index, isLast }: { item: StatItem; index: number; isLast: boolean }) {
  const { count, ref } = useCountUp({
    target: item.value,
    duration: 1200,
    delay: index * 80,
  });
  const Icon = item.icon;

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "group relative list-none",
        !isLast && "border-b border-border/70 sm:border-b-0 sm:border-r",
      )}
    >
      <div className="flex h-full flex-col gap-4 px-5 py-5 transition-colors duration-300 group-hover:bg-primary/[0.03] sm:px-6 sm:py-6 md:px-7">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary",
              "transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/15 group-hover:shadow-glow",
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={2.1} aria-hidden />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
            {item.hint}
          </span>
        </div>

        <div>
          <span
            ref={ref as RefObject<HTMLSpanElement>}
            className="font-heading block text-3xl font-bold tabular-nums leading-none tracking-tight gradient-text sm:text-4xl"
          >
            {count}
          </span>
          <span className="mt-2 block text-sm font-medium text-muted-foreground">{item.label}</span>
        </div>
      </div>
    </motion.li>
  );
}

/** Work page — quick scan stats above the project catalog. */
export function WorkStatsBar() {
  const stats = getWorkPageStats();
  const { statsLabel } = siteConfig.workPage;

  const items: StatItem[] = [
    {
      label: "Selected projects",
      value: stats.projectCount,
      icon: Briefcase,
      hint: "Catalog",
    },
    {
      label: "Production builds",
      value: stats.productionCount,
      icon: Rocket,
      hint: "Deployed",
    },
    {
      label: "Technologies",
      value: stats.techCount,
      icon: Layers,
      hint: "Stack",
    },
    features.showCaseStudies && stats.caseStudyCount > 0
      ? {
          label: "Case studies",
          value: stats.caseStudyCount,
          icon: Code2,
          hint: "Deep dive",
        }
      : {
          label: "Live demos",
          value: stats.demoCount,
          icon: Code2,
          hint: "Try it",
        },
  ];

  return (
    <section
      id="work-stats"
      aria-label="Work overview stats"
      className="relative pt-4 pb-2 md:pb-4"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-40 w-[min(100%,28rem)] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-left"
      >
        {statsLabel}
      </motion.p>

      <ul className="grid overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <StatCell key={item.label} item={item} index={i} isLast={i === items.length - 1} />
        ))}
      </ul>
    </section>
  );
}
