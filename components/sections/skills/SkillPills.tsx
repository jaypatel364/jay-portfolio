"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Skill, SkillGroup } from "./skill-data";

// ── Overflow pill — compact badge for extra skills ────────────────────────────

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
          <Icon aria-hidden role="presentation" size={14} style={{ color }} />
        </span>
        <span className="text-xs font-semibold" style={{ color: hovered ? color : undefined }}>
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
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
        className="relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-border bg-card px-4 py-4 cursor-default w-[79px] transition-all duration-200"
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
          <Icon aria-hidden role="presentation" size={22} style={{ color }} />
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
  // In the "All" view, only show up to previewCount skills
  const visibleSkills = group.skills.slice(0, group.previewCount);
  const showhiddenCount = false;
  const hiddenCount = group.skills.length - visibleSkills.length;

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
        {visibleSkills.map((skill, si) => (
          <SkillPill
            key={skill.name}
            skill={skill}
            delay={index * 0.08 + si * 0.04}
            isDark={isDark}
          />
        ))}
        {/* "+N more" badge — click a category filter to see all in the sphere */}
        {showhiddenCount && hiddenCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: index * 0.08 + visibleSkills.length * 0.04,
              ease: "backOut",
            }}
            className="flex items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-4 w-[79px] cursor-default"
          >
            <span className="text-center text-[11px] font-semibold leading-tight text-primary/70">
              +{hiddenCount}
              <br />
              more
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export { OverflowPill, SkillPill, CategoryCard };
