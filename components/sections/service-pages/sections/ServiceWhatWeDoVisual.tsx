"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceWhatWeDoVisualProps {
  serviceTitle: string;
  stackItems: string[];
  className?: string;
}

/** Single rounded editorial visual for What I Do — theme-aware, no stock photo. */
export function ServiceWhatWeDoVisual({
  serviceTitle,
  stackItems,
  className,
}: ServiceWhatWeDoVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const chips = stackItems.slice(0, 4);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-premium sm:rounded-[1.75rem]",
        className,
      )}
      role="img"
      aria-label={`Visual for ${serviceTitle}`}
    >
      <div className="relative aspect-[16/11] w-full sm:aspect-[5/3]">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted/80 dark:from-muted/40 dark:via-background dark:to-card" />
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />

        {/* Soft tech overlays */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-primary/25"
          viewBox="0 0 640 400"
          fill="none"
          aria-hidden
        >
          <path d="M40 320 H220 L260 260 H400" stroke="currentColor" strokeWidth="1.5" />
          <path d="M480 80 L560 80 L560 160" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="220" cy="320" r="4" fill="currentColor" />
          <circle cx="400" cy="260" r="4" fill="currentColor" />
          <circle cx="560" cy="160" r="4" fill="currentColor" />
          <path
            d="M80 60 L140 60 L140 120"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>

        <div
          className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-8 bottom-4 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />

        {/* Dual workstation panels */}
        <div className="absolute inset-x-5 top-[14%] bottom-[22%] flex gap-3 sm:inset-x-7 sm:gap-4">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-background/90 shadow-inner dark:bg-background/55">
            <div className="flex items-center gap-1.5 border-b border-border/50 px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="grid flex-1 grid-rows-3 gap-1.5 p-2.5">
              <div className="rounded-md bg-primary/15" />
              <div className="rounded-md bg-muted-foreground/10" />
              <div className="rounded-md bg-muted-foreground/10" />
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-background/80 shadow-inner dark:bg-background/45">
            <div className="flex items-center gap-1.5 border-b border-border/50 px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              <span className="h-1.5 flex-1 rounded-full bg-muted-foreground/15" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-2.5">
              <div className="h-[45%] rounded-md bg-primary/10" />
              <div className="grid flex-1 grid-cols-2 gap-1.5">
                <div className="rounded-md bg-muted-foreground/10" />
                <div className="rounded-md bg-muted-foreground/10" />
              </div>
            </div>
          </div>
        </div>

        {chips.length > 0 ? (
          <div className="absolute inset-x-5 bottom-4 flex flex-wrap gap-1.5 sm:inset-x-7">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border/70 bg-card/90 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur-sm dark:bg-card/70"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
