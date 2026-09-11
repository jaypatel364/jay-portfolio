"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceWhatWeDoCollageProps {
  /** Center badge label, e.g. "FULL STACK" */
  badgeLabel: string;
  /** Up to 4 orbiting tech labels */
  stackItems: string[];
  className?: string;
}

/** Overlapping image collage + floating stack badge — inspired by zigzag editorial layouts. */
export function ServiceWhatWeDoCollage({
  badgeLabel,
  stackItems,
  className,
}: ServiceWhatWeDoCollageProps) {
  const reduced = useReducedMotion() ?? false;
  const orbit = stackItems.slice(0, 4);

  return (
    <div className={cn("relative mx-auto w-full max-w-[520px] select-none", className)} aria-hidden>
      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />

      {/* Top-left panel — code surface */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[1] w-[78%] overflow-hidden rounded-[1.75rem] border border-border/70 bg-[#0f1219] shadow-premium dark:border-border/50"
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[10px] text-white/40">app.tsx</span>
        </div>
        <pre className="overflow-hidden px-4 py-4 font-mono text-[11px] leading-5 sm:text-xs sm:leading-6">
          <code>
            <span className="text-violet-400">const</span>{" "}
            <span className="text-sky-300">product</span> <span className="text-white/50">=</span>{" "}
            <span className="text-violet-400">await</span>{" "}
            <span className="text-amber-300">build</span>
            <span className="text-white/60">({"\n"}</span>
            <span className="text-emerald-300">{"  "}frontend</span>
            <span className="text-white/50">,</span>
            {"\n"}
            <span className="text-emerald-300">{"  "}api</span>
            <span className="text-white/50">,</span>
            {"\n"}
            <span className="text-emerald-300">{"  "}data</span>
            {"\n"}
            <span className="text-white/60">)</span>
            <span className="text-white/50">;</span>
          </code>
        </pre>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
      </motion.div>

      {/* Bottom-right panel — workspace surface */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[2] -mt-10 ml-auto w-[72%] overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-premium dark:bg-card/90 sm:-mt-14"
      >
        <div className="relative aspect-[4/3] bg-gradient-to-br from-muted via-background to-muted/80 dark:from-muted/40 dark:via-background dark:to-card">
          <div className="absolute inset-0 bg-grid opacity-40" />
          {/* Desk / screen silhouette */}
          <div className="absolute inset-x-[12%] top-[18%] bottom-[28%] rounded-xl border border-border/80 bg-background/90 shadow-inner dark:bg-background/60">
            <div className="flex h-full flex-col p-2.5 sm:p-3">
              <div className="mb-2 flex gap-1">
                <span className="h-1.5 flex-1 rounded-full bg-primary/35" />
                <span className="h-1.5 w-8 rounded-full bg-muted-foreground/25" />
              </div>
              <div className="grid flex-1 grid-cols-3 gap-1.5">
                <div className="col-span-2 rounded-md bg-primary/10 dark:bg-primary/15" />
                <div className="rounded-md bg-muted-foreground/10" />
                <div className="rounded-md bg-muted-foreground/10" />
                <div className="col-span-2 rounded-md bg-muted-foreground/10" />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-[18%] bottom-[12%] h-3 rounded-full bg-foreground/10 dark:bg-foreground/15" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        </div>
      </motion.div>

      {/* Floating stack badge */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.86 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-[42%] z-[3] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-full border border-primary/25 bg-primary/10 shadow-[0_12px_40px_color-mix(in_oklch,var(--primary)_18%,transparent)] backdrop-blur-md dark:border-primary/35 dark:bg-primary/15 sm:h-[8.75rem] sm:w-[8.75rem]">
          {/* Dashed orbit ring */}
          <svg
            viewBox="0 0 140 140"
            className="absolute inset-1.5 h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)] text-primary/45"
          >
            <circle
              cx="70"
              cy="70"
              r="58"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          </svg>

          <p className="relative z-[1] max-w-[4.5rem] text-center font-heading text-[11px] font-bold uppercase leading-tight tracking-wide text-foreground sm:text-xs">
            {badgeLabel}
          </p>

          {orbit.map((item, i) => {
            const angle = (-90 + i * (360 / Math.max(orbit.length, 1))) * (Math.PI / 180);
            const r = 46;
            const x = 50 + (r / 70) * 50 * Math.cos(angle);
            const y = 50 + (r / 70) * 50 * Math.sin(angle);
            return (
              <span
                key={item}
                className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background text-[8px] font-bold uppercase tracking-tight text-foreground shadow-sm dark:bg-card sm:h-9 sm:w-9 sm:text-[9px]"
                style={{ left: `${x}%`, top: `${y}%` }}
                title={item}
              >
                {shortTech(item)}
              </span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function shortTech(label: string): string {
  const map: Record<string, string> = {
    React: "Re",
    "Next.js": "Nx",
    "Node.js": "No",
    TypeScript: "TS",
    PostgreSQL: "PG",
    MongoDB: "Mg",
    Express: "Ex",
    GraphQL: "GQL",
    AWS: "AWS",
    Docker: "Dk",
    Redis: "Rd",
    Stripe: "St",
  };
  if (map[label]) return map[label];
  const cleaned = label.replace(/\.js$/i, "").replace(/[^a-zA-Z0-9]/g, "");
  return cleaned.slice(0, 2).toUpperCase() || label.slice(0, 2).toUpperCase();
}
