"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/settings/projects";
import { projectHref } from "@/settings/projects";
import type { Service } from "@/lib/services/types";
import { serviceCardClass } from "@/components/sections/services/service-card-styles";
import { cn } from "@/lib/utils";

/**
 * Case studies without screenshots — text-led cards matching Work/Skills language.
 * Swap in ProjectVisual later when real assets exist.
 */
export function ServiceCaseStudiesSection({
  service,
  projects,
}: {
  service: Service;
  projects: Project[];
}) {
  const reduced = useReducedMotion() ?? false;
  if (!projects.length) return null;

  const showcase = projects.slice(0, 2);

  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="scroll-mt-28 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Work</span>
          <h2
            id="case-studies-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Case studies & examples
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Real projects connected to {service.title.toLowerCase()}.
          </p>
        </header>

        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2 lg:gap-5">
          {showcase.map((project, i) => (
            <motion.li
              key={project.slug}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: Math.min(i * 0.05, 0.24),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <article className={cn(serviceCardClass, "min-h-[220px]")}>
                <Link
                  href={projectHref(project)}
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="sr-only">View {project.title}</span>
                </Link>

                <div className="relative flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="relative mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
                  {project.tagline}
                </p>
                <h3 className="font-heading relative mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {project.title}
                </h3>
                <p className="relative mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.desc}
                </p>

                {project.highlights && project.highlights.length > 0 ? (
                  <ul className="relative mt-4 space-y-1.5">
                    {project.highlights.slice(0, 2).map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-foreground/90">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="line-clamp-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <p className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  View project
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </p>
              </article>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            href="/work/"
            className="group inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/35 hover:bg-primary/5 hover:text-primary"
          >
            Explore more work
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
