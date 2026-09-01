"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, projectHref } from "@/settings/projects";
import { HeroVisualFrame } from "./HeroVisualFrame";

const CARDS = PROJECTS.filter((p) => !p.nda).slice(0, 3);

/** Work hero — a cycling stack of shipped project cards. */
export function WorkHeroVisual() {
  const reducedMotion = useReducedMotion();
  const [front, setFront] = useState(0);

  useEffect(() => {
    if (reducedMotion || CARDS.length < 2) return;
    const id = window.setInterval(() => {
      setFront((i) => (i + 1) % CARDS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <HeroVisualFrame>
      <div className="flex min-h-[280px] flex-col justify-between p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          Recent work
        </p>

        <div className="relative mx-auto mt-4 h-[196px] w-full max-w-[280px]">
          {CARDS.map((project, i) => {
            const offset = (i - front + CARDS.length) % CARDS.length;

            return (
              <motion.div
                key={project.slug}
                className="absolute inset-x-0 top-0"
                initial={false}
                animate={{
                  y: offset * 14,
                  scale: 1 - offset * 0.06,
                  rotate: offset === 0 ? 0 : offset === 1 ? -4 : 5,
                  zIndex: CARDS.length - offset,
                  opacity: offset > 2 ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                <Link
                  href={projectHref(project)}
                  className="block rounded-xl border border-border/80 bg-background/90 p-4 shadow-premium backdrop-blur-sm transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-heading text-sm font-bold leading-tight">{project.title}</p>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{project.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {CARDS.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              aria-label={`Show ${project.title}`}
              onClick={() => setFront(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === front ? "w-5 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </HeroVisualFrame>
  );
}
