"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/shared";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";
import { GameZoneTrigger } from "@/components/features/games";
import { SKILL_GROUPS } from "./skill-data";
import { SkillSphere } from "./SkillSphere";
import { OverflowPill, SkillPill, CategoryCard } from "./SkillPills";
import { FILTERS, ViewToggle, type FilterKey, type SkillView } from "./ViewToggle";

// ── Main section ──────────────────────────────────────────────────────────────

export function SkillsSection() {
  const totalSkills = SKILL_GROUPS.reduce((acc, g) => acc + g.skills.length, 0);
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  // Sphere is the default — it's the premium experience
  const [view, setView] = useState<SkillView>("sphere");

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

  const activeGroup =
    activeFilter === "all" ? null : (SKILL_GROUPS.find((g) => g.category === activeFilter) ?? null);

  // Skills to show in the sphere — all when "All", filtered group otherwise
  const sphereSkills =
    activeFilter === "all" ? SKILL_GROUPS.flatMap((g) => g.skills) : (activeGroup?.skills ?? []);

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

        {/* Filter tabs + view toggle — always visible together */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          <div
            className="flex items-center gap-2 flex-wrap justify-center"
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
          </div>

          {/* View toggle — always shown, desktop only */}
          <ViewToggle view={view} onChange={setView} />
        </motion.div>

        {/* ── Game Zone trigger ── */}
        {siteConfig.showGameZone && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mt-6 hidden md:flex justify-center"
          >
            <GameZoneTrigger />
          </motion.div>
        )}

        {/* Content */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilter}-${view}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {/* ── SPHERE view (desktop) ── */}
              {view === "sphere" && (
                <>
                  {/* Category header when a single filter is active */}
                  {activeGroup && (
                    <div className="mb-8 flex items-center justify-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow">
                        {React.createElement(activeGroup.icon, {
                          className: "h-5 w-5 text-primary-foreground",
                        })}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold">{activeGroup.category}</h3>
                        <p className="text-xs text-muted-foreground">{activeGroup.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Sphere — desktop */}
                  <div className="hidden md:flex justify-center">
                    <SkillSphere skills={sphereSkills} isDark={isDark} />
                  </div>

                  {/* Mobile fallback — pill grid (sphere is too small on mobile) */}
                  <div className="md:hidden">
                    {activeFilter === "all" ? (
                      <div className="grid gap-12">
                        {SKILL_GROUPS.map((group, i) => (
                          <CategoryCard
                            key={group.category}
                            group={group}
                            index={i}
                            isDark={isDark}
                          />
                        ))}
                      </div>
                    ) : (
                      activeGroup && (
                        <div className="flex flex-wrap justify-center gap-3">
                          {activeGroup.skills.map((skill, si) => (
                            <SkillPill
                              key={skill.name}
                              skill={skill}
                              delay={si * 0.05}
                              isDark={isDark}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </>
              )}

              {/* ── GRID / LIST view ── */}
              {view === "list" && (
                <>
                  {activeFilter === "all" ? (
                    <div className="grid gap-12 lg:grid-cols-3">
                      {SKILL_GROUPS.map((group, i) => (
                        <CategoryCard
                          key={group.category}
                          group={group}
                          index={i}
                          isDark={isDark}
                        />
                      ))}
                    </div>
                  ) : (
                    activeGroup && (
                      <>
                        <div className="mb-8 flex items-center justify-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow">
                            {React.createElement(activeGroup.icon, {
                              className: "h-5 w-5 text-primary-foreground",
                            })}
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-bold">
                              {activeGroup.category}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {activeGroup.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                          {activeGroup.skills.map((skill, si) => (
                            <OverflowPill
                              key={skill.name}
                              skill={skill}
                              isDark={isDark}
                              delay={si * 0.04}
                            />
                          ))}
                        </div>
                      </>
                    )
                  )}
                </>
              )}
            </motion.div>
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
