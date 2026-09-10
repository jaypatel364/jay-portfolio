"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HeroVisualFrame } from "./HeroVisualFrame";

export type ServicesHeroItem = {
  title: string;
};

interface ServicesHeroVisualProps {
  services: readonly ServicesHeroItem[];
}

function shortLabel(title: string) {
  return title.replace(" Development", "").replace(" Optimization", "").replace(" Stack", "");
}

/** Purely decorative /services hero — service map, not links or tech logos. */
export function ServicesHeroVisual({ services }: ServicesHeroVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const labels = services.map((s) => shortLabel(s.title)).slice(0, 6);
  const [hub, ...orbit] = labels.length
    ? labels
    : ["Full Stack", "Frontend", "Backend", "SaaS", "MVP", "Performance"];

  // Even orbit — same radius for every satellite so nothing crowds the hub.
  const nodes = [
    { label: orbit[0] ?? "Backend", x: "16%", y: "16%", lx: 55, ly: 42 },
    { label: orbit[1] ?? "Frontend", x: "84%", y: "16%", lx: 265, ly: 42 },
    { label: orbit[2] ?? "MERN", x: "10%", y: "58%", lx: 42, ly: 145 },
    { label: orbit[3] ?? "MVP", x: "90%", y: "58%", lx: 278, ly: 145 },
    { label: orbit[4] ?? "SaaS", x: "50%", y: "86%", lx: 160, ly: 210 },
  ];

  return (
    <HeroVisualFrame label="Map of web development services around a full-stack core">
      <div className="relative flex min-h-[300px] flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            Service map
          </p>
          <span className="font-mono text-[10px] text-muted-foreground">engagement.flow</span>
        </div>

        <div className="relative mt-3 min-h-[240px] flex-1">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 320 240"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            {nodes.map((node, i) =>
              reduced ? (
                <line
                  key={node.label}
                  x1={160}
                  y1={110}
                  x2={node.lx}
                  y2={node.ly}
                  stroke="var(--border)"
                  strokeWidth={1.25}
                  strokeDasharray="4 5"
                />
              ) : (
                <motion.line
                  key={node.label}
                  x1={160}
                  y1={110}
                  x2={node.lx}
                  y2={node.ly}
                  stroke="var(--border)"
                  strokeWidth={1.25}
                  strokeDasharray="4 5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                />
              ),
            )}
          </svg>

          <motion.div
            className="absolute left-1/2 top-[42%] z-10 w-[42%] max-w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/15 to-card px-3 py-3 text-center shadow-sm"
            initial={reduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-heading text-sm font-bold leading-tight tracking-tight text-foreground">
              {hub}
            </p>
            <p className="mt-1 text-[10px] font-medium text-muted-foreground">Core engagement</p>
          </motion.div>

          {nodes.map((node, i) => (
            <motion.div
              key={node.label}
              className="absolute z-[1] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/80 bg-background/85 px-2.5 py-1.5 shadow-sm backdrop-blur-sm"
              style={{ left: node.x, top: node.y }}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.35 }}
            >
              <p className="whitespace-nowrap text-[11px] font-semibold text-foreground">
                {node.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* <div className="mt-2 flex items-center justify-center gap-2 border-t border-border/60 pt-3">
          {["Discover", "Build", "Ship", "Support"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              {i > 0 ? (
                <span className="h-px w-3 bg-border sm:w-4" aria-hidden />
              ) : null}
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {step}
              </span>
            </div>
          ))}
        </div> */}
      </div>
    </HeroVisualFrame>
  );
}
