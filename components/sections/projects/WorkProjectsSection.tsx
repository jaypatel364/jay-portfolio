"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, ExternalLink, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { features } from "@/settings/features";
import { PROJECTS, PROJECT_FILTERS, type Project } from "@/settings/projects";
import { ProjectVisual } from "./ProjectVisual";

type Filter = (typeof PROJECT_FILTERS)[number];

export function WorkProjectsSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="work-catalog" className="mt-8 md:mt-10" aria-labelledby="work-catalog-heading">
      <h2 id="work-catalog-heading" className="sr-only">
        All selected projects
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-1 md:gap-2"
        role="tablist"
        aria-label="Filter work by category"
      >
        {PROJECT_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "relative rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              filter === f ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {filter === f && (
              <motion.div
                layoutId="work-filter-active"
                className="absolute inset-0 rounded-lg bg-primary/10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{f}</span>
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 space-y-16 md:space-y-24"
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
        <p className="mt-14 text-center text-xs text-muted-foreground/75">
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
  const copy = (
    <div className="flex min-w-0 flex-col justify-center">
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      <p
        className={cn(
          "mt-4 text-xs font-semibold uppercase tracking-wider",
          project.nda ? "text-muted-foreground" : "text-primary",
        )}
      >
        {project.tagline}
      </p>
      <h3 className="font-heading mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
        {project.title}
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

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {project.nda ? (
          <p className="flex select-none items-center gap-1.5 text-xs text-muted-foreground/70">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            Code &amp; demo unavailable under NDA
          </p>
        ) : (
          <>
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                <Code2 className="h-4 w-4" />
                Code
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
                Live demo
              </a>
            )}
            {features.showCaseStudies && project.caseStudy && (
              <Link
                href={`/projects/${project.slug}/`}
                className="inline-flex items-center gap-1.5 rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Case study
              </Link>
            )}
          </>
        )}
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {project.category}
        </span>
      </div>
    </div>
  );

  const visual = (
    <div className="group">
      <ProjectVisual
        project={project}
        size="feature"
        className="transition-transform duration-500 group-hover:scale-[1.015]"
      />
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.16), ease: [0.22, 1, 0.36, 1] }}
      className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
    >
      <div className={cn(reverse && "lg:order-2")}>{copy}</div>
      <div className={cn(reverse && "lg:order-1")}>{visual}</div>
    </motion.article>
  );
}
