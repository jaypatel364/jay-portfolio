"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink, LayoutList, GitBranch } from "lucide-react";
import { SectionHeading } from "@/components/shared";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { EXPERIENCES } from "@/lib/resume-data";

type ViewMode = "cards" | "timeline";

// ── Card view (original) ─────────────────────────────────────────────────────

function CardView() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/50 via-border to-border md:left-8 md:block" />

      <div className="space-y-8">
        {EXPERIENCES.map((exp, i) => (
          <motion.div
            key={exp.title + exp.company}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative"
          >
            {/* Dot */}
            <div className="absolute left-0 top-6 z-10 hidden -translate-x-1/2 md:left-8 md:block">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </motion.div>
            </div>

            {/* Card */}
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="group ml-0 md:ml-20"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow md:p-8">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="font-heading text-lg font-bold text-foreground">{exp.title}</h3>
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visit ${exp.company}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      {exp.company}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1">
                      <Calendar className="h-3 w-3" />
                      {exp.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>

                <ul className="mt-4 space-y-2">
                  {exp.highlights.map((highlight, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 + j * 0.05 + 0.3 }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {highlight}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Timeline view ────────────────────────────────────────────────────────────

function TimelineView() {
  return (
    <div className="relative">
      {/* Central vertical rail */}
      <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-primary/60 via-border to-transparent md:block" />
      {/* Mobile: left rail */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border to-transparent md:hidden" />

      <div className="space-y-10">
        {EXPERIENCES.map((exp, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={exp.title + exp.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex items-start md:items-center"
            >
              {/* Year marker on the rail — desktop only */}
              <div className="absolute left-1/2 z-10 hidden -translate-x-1/2 md:block">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: i * 0.12 + 0.15,
                  }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-card shadow-glow">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {exp.startYear}
                  </span>
                </motion.div>
              </div>

              {/* Mobile dot */}
              <div className="absolute left-4 top-5 z-10 -translate-x-1/2 md:hidden">
                <div className="h-3 w-3 rounded-full border-2 border-primary bg-background" />
              </div>

              {/* Card — alternates left/right on desktop */}
              <div
                className={cn(
                  "w-full pl-10 md:pl-0 md:w-[calc(50%-3rem)]",
                  isLeft ? "md:pr-8 md:text-right" : "md:ml-auto md:pl-8",
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-glow"
                >
                  {/* Period pill */}
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    <Calendar className="h-3 w-3" />
                    {exp.period}
                  </span>

                  <h3 className="font-heading mt-3 text-base font-bold text-foreground">
                    {exp.title}
                  </h3>

                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Visit ${exp.company}`}
                    className={cn(
                      "mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80",
                      isLeft ? "md:flex-row-reverse" : "",
                    )}
                  >
                    {exp.company}
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>

                  {/* Tags strip */}
                  <div
                    className={cn("mt-3 flex flex-wrap gap-1.5", isLeft ? "md:justify-end" : "")}
                  >
                    {exp.highlights.slice(0, 2).map((h) => (
                      <span
                        key={h}
                        className="rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {h.length > 40 ? h.slice(0, 40) + "…" : h}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}

        {/* "Career start" cap at the bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative flex justify-center md:justify-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary/40" />
            Career started · Aug 2022
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────

const VIEW_OPTIONS: { value: ViewMode; label: string; icon: typeof LayoutList }[] = [
  { value: "cards", label: "Cards", icon: LayoutList },
  { value: "timeline", label: "Timeline", icon: GitBranch },
];

export function ExperienceSection() {
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const [view, setView] = useState<ViewMode>("cards");

  return (
    <section id="experience" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Career" title="Work Experience" />

        {/* View toggle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Experience view mode"
        >
          {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              role="tab"
              aria-selected={view === value}
              onClick={() => setView(value)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                view === value ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {view === value && (
                <motion.div
                  layoutId="exp-view-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Animated view swap */}
        <div className="relative mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {view === "cards" ? <CardView /> : <TimelineView />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex items-center justify-center"
        >
          <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5">
            <Briefcase className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {expLabel} years of professional experience
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
