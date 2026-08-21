"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Code2, Package, Rocket, Users, type LucideIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { SKILL_GROUPS } from "./skill-data";
import { OverflowPill } from "./SkillPills";

const LENS: {
  key: "userLens" | "builderLens" | "shippingLens";
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "userLens", label: "For users", icon: Users },
  { key: "builderLens", label: "How I build", icon: Code2 },
  { key: "shippingLens", label: "How it ships", icon: Rocket },
];

export function SkillsCatalogSection() {
  const { skillsPage } = siteConfig;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const baseId = useId();
  const [activeCategory, setActiveCategory] = useState(SKILL_GROUPS[0].category);

  const activeGroup = SKILL_GROUPS.find((g) => g.category === activeCategory) ?? SKILL_GROUPS[0];
  const activeLayer = skillsPage.layers[activeGroup.category];
  const allSkillNames = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => s.name));

  return (
    <section id="stack-catalog" aria-labelledby="stack-catalog-heading" className="py-10 md:py-16">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          {skillsPage.catalogLabel}
        </span>
        <h2
          id="stack-catalog-heading"
          className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {skillsPage.catalogTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {skillsPage.catalogIntro}
        </p>
      </motion.div>

      {/* Crawlable full inventory (also helps screen readers) */}
      <p className="sr-only">
        Jay Patel production tech stack includes {allSkillNames.join(", ")}. Layers: Frontend with
        React and Next.js, Backend with Node.js APIs and databases, and Tools &amp; DevOps for
        shipping.
      </p>

      {/* ── Request pipeline — how pieces connect ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="mx-auto mt-10 max-w-4xl"
      >
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          How a feature moves through the stack
        </p>
        <ol className="mt-4 flex list-none flex-wrap items-stretch justify-center gap-2 sm:gap-0">
          {skillsPage.pipeline.map((stage, i) => (
            <li key={stage.id} className="flex items-center">
              <div className="rounded-2xl border border-border/70 bg-card px-3.5 py-3 text-center sm:min-w-[7.5rem] sm:px-4">
                <span className="font-mono text-[10px] font-semibold tabular-nums text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{stage.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {stage.detail}
                </p>
              </div>
              {i < skillsPage.pipeline.length - 1 && (
                <ArrowRight
                  className="mx-1 hidden h-4 w-4 shrink-0 text-muted-foreground/50 sm:mx-2 sm:block"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </motion.div>

      {/* ── Layer cards — always in the DOM for SEO ── */}
      <div
        className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5"
        role="tablist"
        aria-label="Stack layers"
      >
        {SKILL_GROUPS.map((group, i) => {
          const layer = skillsPage.layers[group.category];
          const Icon = group.icon;
          const selected = group.category === activeCategory;

          return (
            <motion.article
              key={group.category}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.45,
                delay: Math.min(i * 0.06, 0.2),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                id={`${baseId}-tab-${i}`}
                onClick={() => setActiveCategory(group.category)}
                className={cn(
                  "group flex h-full w-full flex-col rounded-2xl border p-5 text-left transition-all duration-300 sm:p-6",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "border-primary/40 bg-card shadow-glow"
                    : "border-border/70 bg-card/60 hover:border-primary/25 hover:bg-card",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors",
                      selected
                        ? "border-primary/40 bg-primary text-primary-foreground"
                        : "border-primary/15 bg-primary/10 text-primary",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
                    {String(group.skills.length).padStart(2, "0")} tools
                  </span>
                </div>

                <h3 className="font-heading mt-4 text-lg font-bold tracking-tight">
                  {group.category}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {layer?.summary ?? group.description}
                </p>

                {layer?.highlights && (
                  <ul className="mt-4 space-y-1.5">
                    {layer.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs leading-snug text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Always-visible skill names for crawlers + scanability */}
                <p className="mt-4 border-t border-border/60 pt-3 text-[11px] leading-relaxed text-muted-foreground/90">
                  <span className="font-semibold text-foreground/70">Includes: </span>
                  {group.skills.map((s) => s.name).join(" · ")}
                </p>

                <span
                  className={cn(
                    "mt-4 text-xs font-semibold transition-colors",
                    selected ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                  )}
                >
                  {selected ? "Viewing details ↓" : "Explore layer →"}
                </span>
              </button>
            </motion.article>
          );
        })}
      </div>

      {/* ── Active layer deep-dive ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeGroup.category}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${SKILL_GROUPS.findIndex((g) => g.category === activeCategory)}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-premium"
        >
          <div className="border-b border-border/70 px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <activeGroup.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold tracking-tight">
                  {activeGroup.category}
                </h3>
                <p className="text-sm text-muted-foreground">{activeGroup.description}</p>
              </div>
            </div>

            {/* Three perspectives */}
            {activeLayer && (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {LENS.map(({ key, label, icon: LensIcon }) => (
                  <div key={key} className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                    <div className="flex items-center gap-2 text-primary">
                      <LensIcon className="h-4 w-4" aria-hidden />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {activeLayer[key]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-7">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" aria-hidden />
              <h4 className="text-sm font-semibold text-foreground">Tools in this layer</h4>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {activeGroup.skills.length}
              </span>
            </div>
            <ul className="flex flex-wrap gap-3">
              {activeGroup.skills.map((skill, i) => (
                <li key={skill.name}>
                  <OverflowPill skill={skill} isDark={isDark} delay={Math.min(i * 0.03, 0.2)} />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Approach principles — always crawlable ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
        className="mt-14"
      >
        <h3 className="font-heading text-center text-xl font-bold tracking-tight sm:text-2xl">
          {skillsPage.approach.title}
        </h3>
        <ol className="mt-8 grid list-none gap-6 border-t border-border/80 pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border/80">
          {skillsPage.approach.items.map((item, i) => (
            <li
              key={item.title}
              className={cn(
                "lg:px-6",
                i === 0 && "lg:pl-0",
                i === skillsPage.approach.items.length - 1 && "lg:pr-0",
              )}
            >
              <span className="font-mono text-xs font-semibold tabular-nums text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="font-heading mt-2 text-base font-bold tracking-tight">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
