"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { MonitorSmartphone, Server, Wrench, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiRedux,
  SiHtml5,
  SiCss3,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiGraphql,
  SiPrisma,
  SiSocketdotio,
  SiGit,
  SiGithub,
  SiDocker,
  SiAmazonwebservices,
  SiJest,
  SiVitest,
  SiFigma,
  SiLinux,
  SiVite,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { useTheme } from "@/hooks/use-theme";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Skill {
  name: string;
  icon: IconType;
  lightColor: string;
  darkColor: string;
}

interface SkillGroup {
  category: string;
  icon: LucideIcon;
  description: string;
  skills: Skill[];
}

// ── Skill data ─────────────────────────────────────────────────────────────────

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Frontend",
    icon: MonitorSmartphone,
    description: "Crafting pixel-perfect, responsive interfaces",
    skills: [
      { name: "React", icon: SiReact, lightColor: "#149ECA", darkColor: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, lightColor: "#000000", darkColor: "#ffffff" },
      { name: "TypeScript", icon: SiTypescript, lightColor: "#3178C6", darkColor: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, lightColor: "#B8960C", darkColor: "#F7DF1E" },
      { name: "Tailwind CSS", icon: SiTailwindcss, lightColor: "#0891B2", darkColor: "#06B6D4" },
      { name: "Redux", icon: SiRedux, lightColor: "#6040A0", darkColor: "#764ABC" },
      { name: "HTML5", icon: SiHtml5, lightColor: "#D43B1A", darkColor: "#E34F26" },
      { name: "CSS3", icon: SiCss3, lightColor: "#1A5FA0", darkColor: "#1572B6" },
      // { name: "Vite", icon: SiVite, lightColor: "#4C52CC", darkColor: "#646CFF" },
    ],
  },
  {
    category: "Backend",
    icon: Server,
    description: "Building robust, scalable server-side systems",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, lightColor: "#2E7D32", darkColor: "#5FA04E" },
      { name: "Express.js", icon: SiExpress, lightColor: "#404040", darkColor: "#cccccc" },
      { name: "MongoDB", icon: SiMongodb, lightColor: "#2E7D32", darkColor: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, lightColor: "#2F4FD6", darkColor: "#4169E1" },
      { name: "Redis", icon: SiRedis, lightColor: "#D32E22", darkColor: "#FF4438" },
      { name: "GraphQL", icon: SiGraphql, lightColor: "#B0006F", darkColor: "#E10098" },
      { name: "Prisma", icon: SiPrisma, lightColor: "#1a6b8a", darkColor: "#5BC4D1" },
      { name: "Socket.io", icon: SiSocketdotio, lightColor: "#1a1a1a", darkColor: "#dedede" },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: Wrench,
    description: "Streamlining workflows and deployments",
    skills: [
      { name: "Git", icon: SiGit, lightColor: "#C0392B", darkColor: "#F05032" },
      { name: "GitHub", icon: SiGithub, lightColor: "#1a1a1a", darkColor: "#ffffff" },
      { name: "Docker", icon: SiDocker, lightColor: "#1A7CB8", darkColor: "#2496ED" },
      { name: "AWS", icon: SiAmazonwebservices, lightColor: "#CC7A00", darkColor: "#FF9900" },
      { name: "Jest", icon: SiJest, lightColor: "#9A0F1D", darkColor: "#C21325" },
      { name: "Vitest", icon: SiVitest, lightColor: "#4a7a10", darkColor: "#6E9F18" },
      { name: "Figma", icon: SiFigma, lightColor: "#D93B1C", darkColor: "#F24E1E" },
      { name: "Linux", icon: SiLinux, lightColor: "#B89000", darkColor: "#FCC624" },
    ],
  },
];

// ── Orbital geometry ──────────────────────────────────────────────────────────

const ORBITAL_MAX = 8; // hard cap — max skills on the ring
const RING_RADIUS = 152; // px — single ring radius
const RING_RADII = [RING_RADIUS, 256];
const RING_CAPS = [ORBITAL_MAX, 16];

function getOrbitalPositions(
  count: number,
): { x: number; y: number; ring: number; angle: number }[] {
  const positions: { x: number; y: number; ring: number; angle: number }[] = [];
  let remaining = count;
  let ringIdx = 0;

  while (remaining > 0 && ringIdx < RING_RADII.length) {
    const cap = RING_CAPS[ringIdx];
    const inRing = Math.min(remaining, cap);
    const r = RING_RADII[ringIdx];
    const offset = -Math.PI / 2;

    for (let i = 0; i < inRing; i++) {
      const angle = offset + (2 * Math.PI * i) / inRing;
      positions.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, ring: ringIdx, angle });
    }
    remaining -= inRing;
    ringIdx++;
  }
  return positions;
}

// ── Orbital skill node ────────────────────────────────────────────────────────

function OrbitalNode({
  skill,
  position,
  delay,
  isDark,
  ringRotation,
}: {
  skill: Skill;
  position: { x: number; y: number; angle: number };
  delay: number;
  isDark: boolean;
  /** live rotation angle of this node's ring (deg) — node counter-rotates to stay upright */
  ringRotation: number;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = skill.icon;
  const color = isDark ? skill.darkColor : skill.lightColor;

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{ x: position.x, y: position.y, scale: 1, opacity: 1 }}
      exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: "50%", top: "50%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Counter-rotate so node stays upright as ring spins */}
      <div style={{ transform: `rotate(${-ringRotation}deg)`, transition: "none" }}>
        <motion.div
          animate={hovered ? { scale: 1.22 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 20 }}
          className="flex flex-col items-center gap-1.5 cursor-default"
        >
          {/* Pulse ring behind node on hover */}
          {hovered && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute h-12 w-12 rounded-full"
              style={{ backgroundColor: color }}
            />
          )}

          {/* Node */}
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-200"
            style={{
              borderColor: hovered ? color : `${color}55`,
              backgroundColor: hovered ? `${color}28` : `${color}14`,
              boxShadow: hovered
                ? `0 0 20px ${color}60, 0 0 40px ${color}25, inset 0 0 12px ${color}18`
                : `0 0 8px ${color}20`,
            }}
          >
            <Icon size={20} style={{ color }} />
          </div>

          {/* Tooltip */}
          <motion.span
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6, scale: hovered ? 1 : 0.85 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute top-full mt-2 whitespace-nowrap rounded-lg border border-border bg-card/95 px-2.5 py-1 text-[11px] font-bold shadow-lg backdrop-blur-sm z-10"
            style={{ color }}
          >
            {skill.name}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Overflow pill — compact badge for 9th/10th skill ─────────────────────────

function OverflowPill({ skill, isDark, delay }: { skill: Skill; isDark: boolean; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = skill.icon;
  const color = isDark ? skill.darkColor : skill.lightColor;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={hovered ? { y: -3, scale: 1.08 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 cursor-default transition-all duration-200"
        style={{
          borderColor: hovered ? `${color}50` : `${color}22`,
          backgroundColor: hovered ? `${color}10` : undefined,
          boxShadow: hovered ? `0 6px 18px ${color}20` : undefined,
        }}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={14} style={{ color }} />
        </span>
        <span className="text-xs font-semibold" style={{ color: hovered ? color : undefined }}>
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ── Orbital canvas ─────────────────────────────────────────────────────────────

function OrbitalCanvas({ group, isDark }: { group: SkillGroup; isDark: boolean }) {
  const Icon = group.icon;

  // Split: up to ORBITAL_MAX on the ring, rest as overflow pills
  const ringSkills = group.skills.slice(0, ORBITAL_MAX);
  const overflowSkills = group.skills.slice(ORBITAL_MAX); // 0, 1 or 2 extras
  const positions = getOrbitalPositions(ringSkills.length);
  const canvas = (RING_RADIUS + 90) * 2; // fixed size now

  // Continuous ring rotation
  const [rotation, setRotation] = React.useState(0);
  const rafRef = React.useRef<number>(0);
  const lastRef = React.useRef<number>(0);

  React.useEffect(() => {
    const SPEED = 0.018; // deg/ms
    const tick = (now: number) => {
      const dt = lastRef.current ? now - lastRef.current : 0;
      lastRef.current = now;
      setRotation((prev) => (prev + SPEED * dt) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* ── Orbital ring canvas ── */}
      <div className="relative mx-auto select-none" style={{ width: canvas, height: canvas }}>
        {/* Rotating ring track */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: RING_RADIUS * 2,
            height: RING_RADIUS * 2,
            marginLeft: -RING_RADIUS,
            marginTop: -RING_RADIUS,
            transform: `rotate(${rotation}deg)`,
            border: "1px dashed",
            borderColor: "rgba(99,102,241,0.18)",
          }}
        />

        {/* Center hub */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.04 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5 z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-16 w-16 rounded-full bg-primary/20 blur-sm"
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-glow">
            <Icon className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="font-heading text-sm font-bold tracking-tight">{group.category}</span>
        </motion.div>

        {/* Ring skill nodes */}
        {ringSkills.map((skill, i) => (
          <OrbitalNode
            key={skill.name}
            skill={skill}
            position={positions[i]}
            delay={0.06 + i * 0.04}
            isDark={isDark}
            ringRotation={rotation}
          />
        ))}
      </div>

      {/* ── Overflow pills (9th, 10th skill) ── */}
      {overflowSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 + ringSkills.length * 0.04 + 0.1, duration: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          {overflowSkills.map((skill, i) => (
            <OverflowPill key={skill.name} skill={skill} isDark={isDark} delay={i * 0.06} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ── Grid pill (used in All-view and mobile fallback) ──────────────────────────

function SkillPill({ skill, delay, isDark }: { skill: Skill; delay: number; isDark: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = skill.icon;
  const color = isDark ? skill.darkColor : skill.lightColor;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay, ease: "backOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={hovered ? { y: -4, scale: 1.04 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-border bg-card px-4 py-4 cursor-default w-[86px] transition-all duration-200"
        style={{
          borderColor: hovered ? `${color}50` : undefined,
          boxShadow: hovered ? `0 8px 22px ${color}20` : undefined,
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{ background: `${color}10`, opacity: hovered ? 1 : 0 }}
          aria-hidden="true"
        />
        <span
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200"
          style={{ backgroundColor: hovered ? `${color}22` : `${color}14` }}
        >
          <Icon size={22} style={{ color }} />
        </span>
        <span className="relative z-10 text-center text-[11px] font-semibold leading-tight text-muted-foreground">
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ── Category card — used in All view ─────────────────────────────────────────

function CategoryCard({
  group,
  index,
  isDark,
}: {
  group: SkillGroup;
  index: number;
  isDark: boolean;
}) {
  const Icon = group.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">{group.category}</h3>
          <p className="text-xs text-muted-foreground">{group.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {group.skills.map((skill, si) => (
          <SkillPill
            key={skill.name}
            skill={skill}
            delay={index * 0.08 + si * 0.04}
            isDark={isDark}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── Filter types ──────────────────────────────────────────────────────────────

type FilterKey = "all" | "Frontend" | "Backend" | "Tools & DevOps";

const FILTERS: { label: string; value: FilterKey }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "Frontend" },
  { label: "Backend", value: "Backend" },
  { label: "Tools", value: "Tools & DevOps" },
];

// ── Main section ──────────────────────────────────────────────────────────────

export function SkillsSection() {
  const totalSkills = SKILL_GROUPS.reduce((acc, g) => acc + g.skills.length, 0);
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const expNumeric = expLabel.startsWith("<") ? 0 : parseFloat(expLabel);
  const expHalves = Math.round(expNumeric * 2);

  const { count: skillCount, ref: skillRef } = useCountUp({ target: totalSkills, duration: 1400 });
  const { count: expHalfCount, ref: expRef } = useCountUp({
    target: expHalves,
    duration: 1400,
    delay: 100,
  });
  const { count: projCount, ref: projRef } = useCountUp({
    target: siteConfig.projectCount,
    duration: 1400,
    delay: 200,
  });

  const animatedExp =
    expHalfCount === 0
      ? "< 1"
      : expHalfCount % 2 === 0
        ? `${expHalfCount / 2}+`
        : `${(expHalfCount / 2).toFixed(1)}+`;

  const visibleGroups =
    activeFilter === "all" ? SKILL_GROUPS : SKILL_GROUPS.filter((g) => g.category === activeFilter);

  const isSingleCategory = activeFilter !== "all";

  return (
    <section id="skills" className="relative overflow-hidden px-6 py-14 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading label="Expertise" title="Skills & Technologies" />

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-8 flex max-w-md items-center justify-center gap-8 text-center"
        >
          {[
            { ref: skillRef, val: `${skillCount}+`, label: "Tools & Technologies" },
            { ref: expRef, val: animatedExp, label: "Years Experience" },
            { ref: projRef, val: `${projCount}+`, label: "Production Projects" },
          ].map(({ ref, val, label }, i, arr) => (
            <React.Fragment key={label}>
              <div>
                <span
                  ref={ref as React.RefObject<HTMLSpanElement>}
                  className="text-2xl font-bold gradient-text tabular-nums"
                >
                  {val}
                </span>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
              {i < arr.length - 1 && <div className="h-8 w-px bg-border" />}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-2 flex-wrap"
          role="tablist"
          aria-label="Filter skills by category"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={activeFilter === f.value}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeFilter === f.value
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {activeFilter === f.value && (
                <motion.div
                  layoutId="skill-filter-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            {/* ── ALL view: three category cards with pill grids ── */}
            {!isSingleCategory && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid gap-12 lg:grid-cols-3"
              >
                {SKILL_GROUPS.map((group, i) => (
                  <CategoryCard key={group.category} group={group} index={i} isDark={isDark} />
                ))}
              </motion.div>
            )}

            {/* ── SINGLE category: orbital on desktop, grid on mobile ── */}
            {isSingleCategory && visibleGroups[0] && (
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Desktop orbital — hidden on mobile */}
                <div className="hidden md:flex justify-center">
                  <OrbitalCanvas group={visibleGroups[0]} isDark={isDark} />
                </div>

                {/* Mobile grid fallback */}
                <div className="md:hidden space-y-5">
                  <div className="flex items-center gap-3 justify-center">
                    {(() => {
                      const Icon = visibleGroups[0].icon;
                      return (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow">
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                      );
                    })()}
                    <div>
                      <h3 className="font-heading text-lg font-bold">
                        {visibleGroups[0].category}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {visibleGroups[0].description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {visibleGroups[0].skills.map((skill, si) => (
                      <SkillPill key={skill.name} skill={skill} delay={si * 0.05} isDark={isDark} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-14 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Always learning &amp; exploring new technologies
          </div>
        </motion.div>
      </div>
    </section>
  );
}
