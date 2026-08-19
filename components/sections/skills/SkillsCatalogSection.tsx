"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { SKILL_GROUPS } from "./skill-data";
import { OverflowPill } from "./SkillPills";

export function SkillsCatalogSection() {
  const { skillsPage } = siteConfig;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeCategory, setActiveCategory] = useState(SKILL_GROUPS[0].category);

  const activeGroup = SKILL_GROUPS.find((g) => g.category === activeCategory) ?? SKILL_GROUPS[0];
  const allSkillNames = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => s.name));

  return (
    <section id="stack-catalog" aria-labelledby="stack-catalog-heading" className="py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2
          id="stack-catalog-heading"
          className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {skillsPage.catalogTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {skillsPage.catalogIntro}
        </p>
      </motion.div>

      {/* SEO-friendly full list for crawlers */}
      <p className="sr-only">Jay Patel tech stack includes {allSkillNames.join(", ")}.</p>

      <div
        className="mt-10 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Skill categories"
      >
        {SKILL_GROUPS.map((group) => {
          const Icon = group.icon;
          const selected = group.category === activeCategory;
          return (
            <button
              key={group.category}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveCategory(group.category)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                selected
                  ? "border-primary/40 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground",
              )}
            >
              {selected && (
                <motion.div
                  layoutId="skills-catalog-tab"
                  className="absolute inset-0 rounded-full bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{group.category}</span>
              <span className="relative z-10 rounded-full bg-background/80 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                {group.skills.length}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={activeGroup.category}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-premium"
        >
          <div className="border-b border-border bg-muted/30 px-6 py-5 md:px-8">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <activeGroup.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold">{activeGroup.category}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{activeGroup.description}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {skillsPage.categories[activeGroup.category]}
                </p>
              </div>
            </div>
          </div>

          <ul className="flex flex-wrap gap-3 p-6 md:p-8">
            {activeGroup.skills.map((skill, i) => (
              <li key={skill.name}>
                <OverflowPill skill={skill} isDark={isDark} delay={Math.min(i * 0.03, 0.2)} />
              </li>
            ))}
          </ul>
        </motion.article>
      </AnimatePresence>

      {/* Keyword row for SEO + scanability */}
      <div className="mt-10 rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8">
        <h3 className="font-heading text-lg font-bold">MERN &amp; beyond — at a glance</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          MongoDB, Express.js, React, Node.js — plus Next.js, TypeScript, PostgreSQL, GraphQL,
          Redis, Docker, and AWS for apps that need to scale beyond a demo.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {allSkillNames.map((name) => (
            <span
              key={name}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
