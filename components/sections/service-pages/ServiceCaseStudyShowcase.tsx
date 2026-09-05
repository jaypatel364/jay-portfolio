"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/settings/projects";
import type { Service } from "@/lib/services/types";
import { ProjectVisual } from "@/components/sections/projects/ProjectVisual";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceCaseStudyShowcase({
  service,
  projects,
}: {
  service: Service;
  projects: Project[];
}) {
  const reduced = useReducedMotion() ?? false;
  if (!projects.length) return null;

  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <SectionFrame
      id="case-studies"
      label="Selected work"
      title="Projects connected to this service"
      description={`Examples from the portfolio that reflect ${service.title.toLowerCase()} work.`}
      fullBleed
      theme="accent"
    >
      <Link
        href={`/work/${featured.slug}/`}
        className="group relative block overflow-hidden rounded-2xl border border-border/70 bg-card transition-colors hover:border-primary/35"
      >
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
              Featured project
            </p>
            <h3 className="font-heading mt-3 text-2xl font-bold text-foreground group-hover:text-primary sm:text-3xl">
              {featured.title}
            </h3>
            <p className="mt-3 text-base text-muted-foreground">{featured.tagline}</p>
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {featured.desc}
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              View case study
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
          <div className="relative min-h-[220px] border-t border-border/60 bg-muted/20 lg:min-h-[280px] lg:border-l lg:border-t-0">
            <ProjectVisual
              project={featured}
              size="feature"
              className="h-full min-h-[220px] rounded-none border-0 shadow-none lg:min-h-full"
            />
          </div>
        </div>
      </Link>

      {rest.length ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {rest.map((project, i) => (
            <motion.li
              key={project.slug}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/work/${project.slug}/`}
                className="group flex items-center justify-between rounded-xl border border-border/70 bg-card/50 px-5 py-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
              >
                <div>
                  <h4 className="font-heading font-semibold text-foreground group-hover:text-primary">
                    {project.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">{project.tagline}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              </Link>
            </motion.li>
          ))}
        </ul>
      ) : null}
    </SectionFrame>
  );
}
