"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Code2, GitBranch, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";

const STACK = ["React", "Next.js", "Node.js", "TypeScript", "MongoDB"];

export function WhyChooseVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const glowX = useTransform(springX, [-0.5, 0.5], ["30%", "70%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["20%", "80%"]);

  const expLabel = getExperienceLabel(siteConfig.careerStartDate);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-primary/30 bg-card shadow-premium sm:aspect-[16/11]"
    >
      <div className="absolute inset-0 bg-grid opacity-40" />
      <motion.div
        style={{ left: glowX, top: glowY }}
        className="pointer-events-none absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
      />
      <div
        className="aurora-blob absolute -left-10 top-0 h-40 w-40 bg-primary"
        style={{ animation: "aurora-1 12s ease-in-out infinite" }}
      />
      <div
        className="aurora-blob absolute -bottom-8 right-0 h-36 w-36 bg-glow"
        style={{ animation: "aurora-2 14s ease-in-out infinite" }}
      />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-lg font-bold text-primary-foreground shadow-glow">
              {siteConfig.name.charAt(0)}
            </div>
            <div>
              <p className="font-heading text-sm font-bold">{siteConfig.fullName}</p>
              <p className="text-xs text-muted-foreground">Full Stack Developer</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" />
            Available
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {STACK.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-lg border border-border/80 bg-background/70 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { value: `${expLabel}y`, label: "Experience" },
              { value: `${siteConfig.projectCount}+`, label: "Projects" },
              { value: "100+", label: "Forms shipped" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="rounded-xl border border-border/70 bg-background/60 px-2 py-2.5 text-center backdrop-blur-sm"
              >
                <p className="font-heading text-base font-bold gradient-text sm:text-lg">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/50 px-3 py-2.5 font-mono text-[11px] text-muted-foreground backdrop-blur-sm">
          <GitBranch className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">git commit -m &quot;ship clean UI + robust API&quot;</span>
          <Code2 className="ml-auto h-3.5 w-3.5 shrink-0 text-primary/70" />
        </div>
      </div>
    </div>
  );
}
