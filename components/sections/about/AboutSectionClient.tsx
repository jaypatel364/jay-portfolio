"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Zap,
  Hammer,
  ArrowUpRight,
  BookOpen,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { SectionHeading, SectionPageCta } from "@/components/shared";
import { innerPages } from "@/settings/pages";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { TechMarquee } from "./TechMarquee";
import { GitHubGraph } from "./GitHubGraph";
import type { ContributionDay } from "@/lib/github-contributions";
import type { BuildingItem } from "@/settings/types";
import React from "react";

// ── Highlight cards ───────────────────────────────────────────────────────────

const HIGHLIGHTS = [
  { icon: Code2, title: "Frontend", desc: "React · Next.js · TypeScript" },
  { icon: Server, title: "Backend", desc: "Node.js · Express · GraphQL" },
  { icon: Database, title: "Database", desc: "MongoDB · PostgreSQL · Redis" },
  { icon: Zap, title: "DevOps", desc: "Docker · AWS · CI/CD" },
];

// ── Traits ────────────────────────────────────────────────────────────────────

const TRAITS = ["Based in India", "3.5+ years", "100+ forms shipped", "Mentored juniors"];

// ── Stat card ─────────────────────────────────────────────────────────────────

// function StatCard({
//   target,
//   suffix,
//   label,
//   delay,
// }: {
//   target: number;
//   suffix: string;
//   label: string;
//   delay: number;
// }) {
//   const { count, ref } = useCountUp({ target, duration: 1600, delay });
//   return (
//     <div className="rounded-2xl border border-border bg-card p-5 text-center">
//       <span
//         ref={ref as React.RefObject<HTMLSpanElement>}
//         className="text-3xl font-bold gradient-text tabular-nums"
//       >
//         {count}
//         {suffix}
//       </span>
//       <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
//     </div>
//   );
// }

// ── Currently-building sub-component ─────────────────────────────────────────

function CurrentlyBuildingContent({ building }: { building: BuildingItem }) {
  return (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Hammer className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          Currently building
        </p>
        <p className="text-sm font-semibold text-foreground">{building.name}</p>
        <p className="text-xs text-muted-foreground">{building.description}</p>
      </div>
      {building.url && (
        <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary" />
      )}
    </>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function AboutSectionClient({
  initialContributions,
  showPageCta = true,
  heading = { label: "About", title: "Full stack developer in India" },
  variant = "home",
}: {
  initialContributions: ContributionDay[];
  showPageCta?: boolean;
  heading?: { label: string; title: string };
  variant?: "home" | "page";
}) {
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const building = siteConfig.currentlyBuilding;
  const learning = siteConfig.currentlyLearning;

  return (
    <section id="about" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label={heading.label} title={heading.title} />

        <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* ── Left column — story + signals ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {/* Location + availability chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                {siteConfig.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Open to freelance / collabs
              </span>
            </div>

            {/* Bio — unique per variant to avoid duplicate content */}
            <div className="space-y-4">
              {variant === "home" ? (
                <p className="text-lg leading-relaxed text-muted-foreground">
                  I build scalable web applications using{" "}
                  <span className="font-semibold text-foreground">React, Next.js, Node.js</span> and
                  modern databases — helping startups and businesses ship faster from{" "}
                  <span className="font-semibold text-foreground">{siteConfig.location}</span> with{" "}
                  <span className="font-semibold text-foreground">{expLabel} years</span> of
                  hands-on experience.
                </p>
              ) : (
                <>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    I&apos;m a full-stack developer in{" "}
                    <span className="font-semibold text-foreground">{siteConfig.location}</span>{" "}
                    with <span className="font-semibold text-foreground">{expLabel} years</span> on
                    the <span className="font-semibold text-foreground">MERN stack</span> — React,
                    Next.js, Node.js, MongoDB, and PostgreSQL.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    I&apos;ve shipped real-time chat, a form system that runs 100+ configurable
                    forms, HR and KYC platforms, and mentored junior developers. I own the work from
                    architecture to deploy.
                  </p>
                </>
              )}
            </div>

            {/* Trait chips */}
            <div className="flex flex-wrap gap-2">
              {TRAITS.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {t}
                </span>
              ))}
            </div>

            {/* Currently building badge */}
            {building && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {building.url ? (
                  <a
                    href={building.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 transition-all hover:border-primary/40 hover:bg-primary/10"
                  >
                    <CurrentlyBuildingContent building={building} />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                    <CurrentlyBuildingContent building={building} />
                  </div>
                )}
              </motion.div>
            )}

            {/* Currently learning */}
            {learning.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="inline-flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Currently learning
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {learning.map((item) => (
                      <span
                        key={item?.name}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── Right column — proof + specialties ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-5"
          >
            {/* Specialty cards */}
            <div className="grid grid-cols-2 gap-3">
              {HIGHLIGHTS.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-glow"
                >
                  <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-heading text-sm font-bold">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {showPageCta && (
          <div className="mt-12 flex justify-start">
            <SectionPageCta href={`${innerPages.about.path}/`}>
              {innerPages.about.homeCta}
            </SectionPageCta>
          </div>
        )}

        {/* ── Tech marquee ── */}
        <TechMarquee />

        {/* ── GitHub activity graph ── */}
        <GitHubGraph initialDays={initialContributions} />
      </div>
    </section>
  );
}
