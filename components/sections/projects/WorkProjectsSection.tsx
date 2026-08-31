"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, Code2, Layout, Server, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import {
  PROJECTS,
  PROJECT_FILTERS,
  isProjectPublished,
  projectHref,
  type Project,
  type ProjectCategory,
} from "@/settings/projects";
import { ProjectVisual } from "./ProjectVisual";
import { ProjectCardActions } from "./ProjectCardActions";

type Filter = (typeof PROJECT_FILTERS)[number];

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  fullstack: "Full Stack",
  frontend: "Frontend",
  backend: "Backend",
};

const FILTER_META: Record<Filter, { label: string; icon: LucideIcon }> = {
  all: { label: "All", icon: Boxes },
  fullstack: { label: "Fullstack", icon: Layout },
  frontend: { label: "Frontend", icon: Code2 },
  backend: { label: "Backend", icon: Server },
};

function filterCount(filter: Filter) {
  if (filter === "all") return PROJECTS.length;
  return PROJECTS.filter((p) => p.category === filter).length;
}

export function WorkProjectsSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const { catalog } = siteConfig.workPage;

  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section
      id="work-catalog"
      className="relative mt-12 md:mt-16"
      aria-labelledby="work-catalog-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-24 -z-10 mx-auto h-64 max-w-3xl rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          {catalog.label}
        </span>
        <h2
          id="work-catalog-heading"
          className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          {catalog.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {catalog.intro}
        </p>
      </motion.div>

      {/* Solid filter toolbar — matches skills catalog controls */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="sticky top-20 z-20 mt-8 flex w-full min-w-0 flex-col items-center gap-3 sm:mt-10"
      >
        <div
          className={cn(
            "flex w-full min-w-0 max-w-full items-center gap-0.5 overflow-x-auto rounded-2xl border border-border/70 bg-card/90 p-1.5 shadow-sm backdrop-blur-md",
            "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
          role="tablist"
          aria-label="Filter work by category"
        >
          {PROJECT_FILTERS.map((f) => {
            const meta = FILTER_META[f];
            const Icon = meta.icon;
            const selected = filter === f;
            const count = filterCount(f);

            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  selected ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {selected && (
                  <motion.div
                    layoutId="work-filter-active"
                    className="absolute inset-0 rounded-xl bg-primary/10 shadow-[inset_0_0_0_1px] shadow-primary/20"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden />
                <span className="relative z-10">{meta.label}</span>
                <span
                  className={cn(
                    "relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                    selected ? "bg-primary/15 text-primary" : "bg-muted/80 text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* <AnimatePresence mode="wait">
          <motion.p
            key={filter}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-medium text-muted-foreground"
            aria-live="polite"
          >
            Showing{" "}
            <span className="tabular-nums text-foreground">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "project" : "projects"}
            {filter !== "all" && (
              <>
                {" "}
                in <span className="text-foreground">{FILTER_META[filter].label}</span>
              </>
            )}
          </motion.p>
        </AnimatePresence> */}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 space-y-10 md:mt-14 md:space-y-16"
        >
          {filtered.map((project, i) => (
            <ZigzagRow key={project.slug} project={project} reverse={i % 2 === 1} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          Nothing in this category yet — try another filter.
        </p>
      )}

      {filtered.some((p) => p.nda) && (
        <p className="mt-14 text-center text-xs text-muted-foreground">
          Projects marked NDA were built professionally. Descriptions and tech stacks are shared
          with permission; code and demos cannot be disclosed.
        </p>
      )}
    </section>
  );
}

function ZigzagRow({
  project,
  reverse,
  index,
}: {
  project: Project;
  reverse: boolean;
  index: number;
}) {
  const hasDetailPage = !project.nda || isProjectPublished(project.slug);

  const copy = (
    <div className="flex min-w-0 flex-col justify-center">
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "min-w-0 text-xs font-semibold uppercase tracking-wider",
            project.nda ? "text-muted-foreground" : "text-primary",
          )}
        >
          {project.tagline}
        </p>
        <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {CATEGORY_LABEL[project.category]}
        </span>
      </div>

      <h3 className="font-heading mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
        {hasDetailPage ? (
          <Link
            href={projectHref(project)}
            className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {project.title}
          </Link>
        ) : (
          project.title
        )}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
        {project.desc}
      </p>

      {project.highlights && project.highlights.length > 0 && (
        <ul className="mt-5 space-y-2">
          {project.highlights.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {point}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <ProjectCardActions project={project} variant="work" />
      </div>
    </div>
  );

  const visual = !hasDetailPage ? (
    <div className="group relative">
      <ProjectVisual
        project={project}
        size="feature"
        className="transition-transform duration-500 group-hover:scale-[1.015]"
      />
    </div>
  ) : (
    <Link href={projectHref(project)} className="group relative block">
      <div className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-primary/0 opacity-0 blur-2xl transition-all duration-500 group-hover:bg-primary/10 group-hover:opacity-100" />
      <ProjectVisual
        project={project}
        size="feature"
        className="transition-transform duration-500 group-hover:scale-[1.015]"
      />
    </Link>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.16), ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "grid items-center gap-8 lg:gap-14",
        reverse ? "lg:grid-cols-[1.2fr_1fr]" : "lg:grid-cols-[1fr_1.2fr]",
      )}
      id={`project-${project.slug}`}
    >
      <div className={cn(reverse && "lg:order-2")}>{copy}</div>
      <div className={cn(reverse && "lg:order-1")}>{visual}</div>
    </motion.article>
  );
}
