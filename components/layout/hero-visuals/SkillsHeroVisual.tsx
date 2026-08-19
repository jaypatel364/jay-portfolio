"use client";

import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { SKILL_GROUPS } from "@/components/sections/skills/skill-data";
import { HeroVisualFrame } from "./HeroVisualFrame";

const ORBIT_NAMES = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "GraphQL",
] as const;

const ORBIT = SKILL_GROUPS.flatMap((g) => g.skills).filter((s) =>
  (ORBIT_NAMES as readonly string[]).includes(s.name),
);

/** Skills hero — a slow orbit of the daily stack around a MERN core. */
export function SkillsHeroVisual() {
  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <HeroVisualFrame
      className="min-h-[340px] sm:min-h-[380px]"
      label="Orbiting stack: React, Next.js, TypeScript, Node.js, MongoDB, PostgreSQL, Docker, GraphQL"
    >
      <div className="relative mx-auto aspect-square w-full min-h-[340px] sm:min-h-[380px]">
        <div className="absolute inset-[30%] rounded-full border border-primary/15" />
        <div className="absolute inset-8 rounded-full border border-dashed border-border/70 sm:inset-10" />

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border border-primary/30 bg-background/85 shadow-glow backdrop-blur-md sm:h-24 sm:w-24">
            <span className="font-heading text-base font-bold tracking-tight gradient-text sm:text-lg">
              MERN
            </span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px]">
              Daily stack
            </span>
          </div>
        </div>

        <div
          className="hero-orbit absolute inset-8 sm:inset-10"
          style={reducedMotion ? undefined : { animation: "hero-orbit 28s linear infinite" }}
          aria-hidden
        >
          {ORBIT.map((skill, i) => {
            const angle = (i / ORBIT.length) * 360;
            const Icon = skill.icon;
            const color = isDark ? skill.darkColor : skill.lightColor;

            return (
              <div
                key={skill.name}
                className="absolute inset-0"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div
                  className="hero-orbit-rev absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                  style={
                    reducedMotion ? undefined : { animation: "hero-orbit-rev 28s linear infinite" }
                  }
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-background/95 shadow-sm backdrop-blur-sm sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color }} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </HeroVisualFrame>
  );
}
