"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, ExternalLink, Lock, Sparkles } from "lucide-react";
import { ProjectVisual } from "./ProjectVisual";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { projectPath, type Project } from "@/settings/projects";

/** `/work/[slug]` placeholder until the full project write-up ships. */
export function ProjectComingSoon({ project }: { project: Project }) {
  const copy = siteConfig.workPage.comingSoon;
  const steps = copy.statusSteps;
  const activeStep = Math.min(Math.max(copy.activeStep, 0), steps.length - 1);

  return (
    <main id="main" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-72 w-[min(100%,40rem)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-glow/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
        {/* <Link
          href="/work/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          {copy.back}
        </Link> */}

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                {copy.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                {copy.badge}
              </span>
              {project.nda && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Lock className="h-2.5 w-2.5" />
                  NDA
                </span>
              )}
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {project.tagline}
            </p>
            <h1 className="font-heading mt-2 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {project.desc}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Coming soon panel */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-premium backdrop-blur-sm">
              <div className="border-b border-border/60 bg-muted/30 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-bold tracking-tight">{copy.headline}</p>
                    <p className="text-xs text-muted-foreground">
                      Page URL locked at {projectPath(project.slug)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{copy.body}</p>

                <ol className="space-y-3">
                  {steps.map((step, i) => {
                    const done = i < activeStep;
                    const current = i === activeStep;
                    return (
                      <li key={step} className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tabular-nums",
                            done && "border-primary bg-primary text-primary-foreground",
                            current && "border-primary/50 bg-primary/10 text-primary shadow-glow",
                            !done && !current && "border-border text-muted-foreground",
                          )}
                        >
                          {done ? "✓" : String(i + 1)}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            current ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {step}
                        </span>
                        {current && (
                          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-primary">
                            Now
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>

                {/* Progress bar */}
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full gradient-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((activeStep + 0.35) / steps.length) * 100}%`,
                    }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.nda ? (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  Code &amp; demo unavailable under NDA
                </p>
              ) : (
                <>
                  {project.codeUrl && (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
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
                      className="inline-flex items-center gap-1.5 rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live demo
                    </a>
                  )}
                </>
              )}
              <Link
                href="/work/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold transition-all hover:border-primary/30 hover:text-primary"
              >
                {copy.back}
              </Link>
            </div>
          </motion.div>

          {/* Visual column */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl" />
            <ProjectVisual project={project} size="feature" className="relative shadow-premium" />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-border/80 bg-background/90 p-4 shadow-premium backdrop-blur-md sm:left-6 sm:right-auto sm:max-w-xs"
            >
              <p className="font-mono text-[11px] text-muted-foreground">$ status --project</p>
              <p className="mt-1 font-mono text-sm font-semibold text-primary">
                writing_up… <span className="animate-pulse">▊</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
