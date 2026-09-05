"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/settings/projects";
import type { Service } from "@/lib/services/types";
import { ProjectVisual } from "@/components/sections/projects/ProjectVisual";

/** Full-width featured case study — proof early in the narrative. */
export function ServiceWorkShowcase({
  service,
  projects,
}: {
  service: Service;
  projects: Project[];
}) {
  const reduced = useReducedMotion() ?? false;
  if (!projects.length) return null;

  const featured = projects[0];

  return (
    <section id="work" className="scroll-mt-32 relative w-full">
      <div className="relative w-full overflow-hidden border-y border-border/60">
        <div className="relative aspect-[16/9] w-full min-h-[280px] max-h-[72vh] sm:min-h-[360px]">
          <ProjectVisual
            project={featured}
            size="feature"
            className="absolute inset-0 h-full w-full rounded-none border-0 shadow-none"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
            aria-hidden
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pb-14">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Selected work
            </p>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">{featured.tagline}</p>
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground/90">
              {featured.desc}
            </p>
            <Link
              href={`/work/${featured.slug}/`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {projects.length > 1 ? (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            More related to {service.title.toLowerCase()}
          </p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {projects.slice(1).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}/`}
                  className="rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/35 hover:text-primary"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
