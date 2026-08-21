"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionPageCta } from "@/components/shared";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { innerPages } from "@/settings/pages";
import { HOME_PROJECT_COUNT, publicProjects, projectHref } from "@/settings/projects";
import { ProjectVisual } from "./ProjectVisual";

/** Skills page — compact preview of production work built with the listed stack. */
export function SkillsWorkStripSection() {
  const copy = siteConfig.skillsPage.workStrip;
  const preview = publicProjects().slice(0, HOME_PROJECT_COUNT);

  return (
    <section
      id="skills-work-strip"
      aria-labelledby="skills-work-strip-heading"
      className="relative border-t border-border/60 py-10 md:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {copy.label}
          </span>
          <h2
            id="skills-work-strip-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {copy.intro}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {preview.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.18) }}
              whileHover={{ y: -4 }}
              className={cn(
                "group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300",
                project.nda
                  ? "border-border/60 hover:border-border hover:shadow-md"
                  : "border-border hover:border-primary/30 hover:shadow-premium",
              )}
            >
              <ProjectVisual project={project} />

              <div className="flex flex-1 flex-col p-5">
                <p
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-wider",
                    project.nda ? "text-muted-foreground" : "text-primary",
                  )}
                >
                  {project.tagline}
                </p>
                <h3 className="font-heading mt-1 text-lg font-bold leading-snug">
                  <Link
                    href={projectHref(project)}
                    className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {project.desc}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={projectHref(project)}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  View project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <SectionPageCta href={`${innerPages.work.path}/`}>
            {innerPages.work.homeCta}
          </SectionPageCta>
        </div>
      </div>
    </section>
  );
}
