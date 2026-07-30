"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SectionHeading } from "./SectionHeading";
import {
  Atom,
  Server,
  Wrench,
  MonitorSmartphone,
  Database,
  GitBranch,
  Container,
  Cloud,
  TestTube,
  Workflow,
  Pen,
  FileCode,
  Braces,
  Layers,
  PaintBucket,
  LayoutGrid,
  Cable,
  SearchCode,
  Globe,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  icon: LucideIcon;
  color: string;
}

interface SkillGroup {
  category: string;
  icon: LucideIcon;
  description: string;
  skills: Skill[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Frontend",
    icon: MonitorSmartphone,
    description: "Crafting pixel-perfect, responsive user interfaces",
    skills: [
      { name: "React", icon: Atom, color: "oklch(0.7 0.15 220)" },
      { name: "Next.js", icon: Globe, color: "oklch(0.75 0.02 0)" },
      { name: "TypeScript", icon: Braces, color: "oklch(0.6 0.15 250)" },
      { name: "Tailwind CSS", icon: PaintBucket, color: "oklch(0.7 0.15 200)" },
      { name: "Redux / Zustand", icon: Layers, color: "oklch(0.65 0.2 310)" },
      { name: "HTML / CSS", icon: FileCode, color: "oklch(0.7 0.18 30)" },
    ],
  },
  {
    category: "Backend",
    icon: Server,
    description: "Building robust, scalable server-side architectures",
    skills: [
      { name: "Node.js", icon: Server, color: "oklch(0.65 0.2 145)" },
      { name: "Express.js", icon: Cable, color: "oklch(0.7 0.02 0)" },
      { name: "MongoDB", icon: Database, color: "oklch(0.65 0.18 145)" },
      { name: "PostgreSQL", icon: Database, color: "oklch(0.6 0.15 250)" },
      { name: "REST APIs", icon: LayoutGrid, color: "oklch(0.7 0.15 200)" },
      { name: "GraphQL", icon: SearchCode, color: "oklch(0.6 0.2 330)" },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: Wrench,
    description: "Streamlining workflows & deployments",
    skills: [
      { name: "Git / GitHub", icon: GitBranch, color: "oklch(0.65 0.2 30)" },
      { name: "Docker", icon: Container, color: "oklch(0.6 0.15 250)" },
      { name: "AWS", icon: Cloud, color: "oklch(0.7 0.18 45)" },
      { name: "Jest / Vitest", icon: TestTube, color: "oklch(0.65 0.18 145)" },
      { name: "CI/CD", icon: Workflow, color: "oklch(0.6 0.15 280)" },
      { name: "Figma", icon: Pen, color: "oklch(0.65 0.2 350)" },
    ],
  },
];

function SkillPill({ skill, delay }: { skill: Skill; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = skill.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
    >
      <motion.div
        animate={hovered ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3.5 cursor-default overflow-hidden transition-colors duration-300 hover:border-primary/40"
      >
        {/* Glow behind icon on hover */}
        <motion.div
          animate={hovered ? { opacity: 0.15, scale: 1.5 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute left-4 h-10 w-10 rounded-full blur-xl"
          style={{ backgroundColor: skill.color }}
        />

        <div
          className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300"
          style={{
            backgroundColor: hovered
              ? `color-mix(in oklch, ${skill.color} 20%, transparent)`
              : "var(--muted)",
          }}
        >
          <Icon
            className="h-4.5 w-4.5 transition-colors duration-300"
            style={{ color: hovered ? skill.color : "var(--muted-foreground)" }}
          />
        </div>

        <span className="relative z-10 text-sm font-semibold tracking-tight">{skill.name}</span>
      </motion.div>
    </motion.div>
  );
}

function CategoryCard({ group, index }: { group: SkillGroup; index: number }) {
  const Icon = group.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="space-y-6"
    >
      {/* Category header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">{group.category}</h3>
          <p className="text-xs text-muted-foreground">{group.description}</p>
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 gap-3">
        {group.skills.map((skill, si) => (
          <SkillPill key={skill.name} skill={skill} delay={index * 0.1 + si * 0.06} />
        ))}
      </div>
    </motion.div>
  );
}

type FilterKey = "all" | "Frontend" | "Backend" | "Tools & DevOps";

const FILTERS: { label: string; value: FilterKey }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "Frontend" },
  { label: "Backend", value: "Backend" },
  { label: "Tools", value: "Tools & DevOps" },
];

export function SkillsSection() {
  const totalSkills = SKILL_GROUPS.reduce((acc, g) => acc + g.skills.length, 0);
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  // Parse the numeric part of the exp label (e.g. "3.5+" → 3.5, "< 1" → 0)
  const expNumeric = expLabel.startsWith("<") ? 0 : parseFloat(expLabel);
  // Count up in half-year units so 3.5 → count 7 halves → display as (n/2)
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

  // Format the animated experience value back to "X+" or "X.5+"
  const animatedExp =
    expHalfCount === 0
      ? "< 1"
      : expHalfCount % 2 === 0
        ? `${expHalfCount / 2}+`
        : `${(expHalfCount / 2).toFixed(1)}+`;

  const visibleGroups =
    activeFilter === "all" ? SKILL_GROUPS : SKILL_GROUPS.filter((g) => g.category === activeFilter);

  return (
    <section id="skills" className="relative overflow-hidden px-6 py-14 md:py-28">
      {/* Ambient glow */}
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
          <div>
            <span
              ref={skillRef as React.RefObject<HTMLSpanElement>}
              className="text-2xl font-bold gradient-text tabular-nums"
            >
              {skillCount}+
            </span>
            <p className="text-xs text-muted-foreground">Tools & Technologies</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span
              ref={expRef as React.RefObject<HTMLSpanElement>}
              className="text-2xl font-bold gradient-text tabular-nums"
            >
              {animatedExp}
            </span>
            <p className="text-xs text-muted-foreground">Years Experience</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span
              ref={projRef as React.RefObject<HTMLSpanElement>}
              className="text-2xl font-bold gradient-text tabular-nums"
            >
              {projCount}+
            </span>
            <p className="text-xs text-muted-foreground">Production Projects</p>
          </div>
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

        {/* Category cards — animate on filter change */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "grid gap-12",
                visibleGroups.length === 1 ? "max-w-sm mx-auto" : "lg:grid-cols-3",
              )}
            >
              {visibleGroups.map((group, i) => (
                <CategoryCard key={group.category} group={group} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sparkle badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-14 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Always learning & exploring new technologies
          </div>
        </motion.div>
      </div>
    </section>
  );
}
