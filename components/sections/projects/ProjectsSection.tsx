"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Code2, Lock, Hammer, ChevronDown } from "lucide-react";
import { SectionHeading, SectionPageCta } from "@/components/shared";
import { innerPages } from "@/settings/pages";
import { cn } from "@/lib/utils";
import { PROJECTS, HOME_PROJECT_COUNT } from "@/settings/projects";
import { features } from "@/settings/features";
import { ProjectVisual } from "./ProjectVisual";

function ExpandableDesc({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [clampedH, setClampedH] = useState<number | null>(null);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const innerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const clamped = el.clientHeight;
    el.style.display = "block";
    el.style.webkitLineClamp = "unset";
    el.style.overflow = "visible";
    el.style.webkitBoxOrient = "unset";
    const full = el.scrollHeight;
    el.style.display = "";
    el.style.webkitLineClamp = "";
    el.style.overflow = "";
    el.style.webkitBoxOrient = "";

    setClampedH(clamped);
    setFullHeight(full);
    setOverflows(full > clamped + 2);
  }, [text]);

  const currentHeight = expanded ? (fullHeight ?? "auto") : (clampedH ?? "auto");

  return (
    <div className="flex flex-1 flex-col">
      <motion.div
        animate={{ height: currentHeight }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="overflow-hidden"
      >
        <p
          ref={innerRef}
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            !expanded && "line-clamp-3",
          )}
        >
          {text}
        </p>
      </motion.div>

      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 flex items-center gap-1 self-start text-xs font-semibold text-primary/70 transition-colors hover:text-primary focus-visible:outline-none"
          aria-expanded={expanded}
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="inline-flex"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

/** Homepage summary — first 3 projects, no filters. Full catalog lives on /work. */
export function ProjectsSection() {
  const preview = PROJECTS.slice(0, HOME_PROJECT_COUNT);

  return (
    <section id="work" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Work" title="Selected work" />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {preview.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className={cn(
                "group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300",
                project.nda
                  ? "border-border/60 hover:border-border hover:shadow-md"
                  : project.wip
                    ? "border-primary/20 hover:border-primary/40 hover:shadow-premium"
                    : "border-border hover:border-primary/30 hover:shadow-premium",
              )}
            >
              <ProjectVisual project={project} />

              <div className="flex flex-1 flex-col p-6">
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    project.nda ? "text-muted-foreground" : "text-primary",
                  )}
                >
                  {project.tagline}
                </p>
                <h3 className="font-heading mt-1 text-lg font-bold leading-snug">
                  {project.title}
                </h3>
                <div className="mt-2.5 flex flex-1 flex-col">
                  <ExpandableDesc text={project.desc} />
                </div>

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

                <div className="mt-5 flex items-center gap-4 border-t border-border pt-4">
                  {project.nda ? (
                    <p className="flex select-none items-center gap-1.5 text-xs text-muted-foreground/70">
                      <Lock className="h-3 w-3 shrink-0" />
                      Code &amp; demo unavailable under NDA
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-4">
                      {project.codeUrl && (
                        <a
                          href={project.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                          aria-label={`View source code for ${project.title}`}
                          title={`View source code for ${project.title}`}
                        >
                          <Code2 className="h-4 w-4" aria-hidden />
                          Code
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                          aria-label={`View live demo for ${project.title}`}
                          title={`Live demo: ${project.title}`}
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden />
                          Demo
                        </a>
                      )}
                      {features.showCaseStudies && project.caseStudy && (
                        <Link
                          href={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                          Case study
                        </Link>
                      )}
                      {project.wip && (
                        <span className="inline-flex items-center gap-1 text-xs text-primary/70">
                          <Hammer className="h-3 w-3" />
                          Building
                        </span>
                      )}
                    </div>
                  )}

                  <span className="ml-auto rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {project.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <SectionPageCta href={`${innerPages.work.path}/`}>
            {innerPages.work.homeCta}
          </SectionPageCta>
        </div>
      </div>
    </section>
  );
}
