"use client";

import { motion } from "framer-motion";
import { Globe2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Filter types ──────────────────────────────────────────────────────────────

type FilterKey = "all" | "Frontend" | "Backend" | "Tools & DevOps";
type SkillView = "sphere" | "list";

const FILTERS: { label: string; value: FilterKey }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "Frontend" },
  { label: "Backend", value: "Backend" },
  { label: "Tools", value: "Tools & DevOps" },
];

// ── View toggle — Grid ↔ 3D Sphere (shared across all filters) ───────────────

function ViewToggle({ view, onChange }: { view: SkillView; onChange: (v: SkillView) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28, delay: 0.1 }}
      className="hidden md:flex items-center gap-0.5 rounded-xl border border-border/60 bg-card p-1 shadow-sm"
      role="group"
      aria-label="Switch skills view"
    >
      {(
        [
          { value: "sphere" as const, icon: Globe2, label: "3D Sphere" },
          { value: "list" as const, icon: LayoutGrid, label: "Grid" },
        ] as const
      ).map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          title={label}
          aria-pressed={view === value}
          className={cn(
            "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            view === value ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {view === value && (
            <motion.div
              layoutId="skill-view-active"
              className="absolute inset-0 rounded-lg bg-primary/10"
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            />
          )}
          <Icon className="relative z-10 h-3.5 w-3.5" />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </motion.div>
  );
}

export type { FilterKey, SkillView };
export { FILTERS, ViewToggle };
