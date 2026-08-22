"use client";

import { motion } from "framer-motion";
import { Code2, Server, Database, Zap, Hammer, ArrowUpRight, BookOpen, MapPin } from "lucide-react";
import { SectionHeading, SectionPageCta } from "@/components/shared";
import { innerPages } from "@/settings/pages";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel, cn } from "@/lib/utils";
import { TechMarquee } from "./TechMarquee";
import { GitHubGraph } from "./GitHubGraph";
import type { ContributionDay } from "@/lib/github-contributions";
import type { BuildingItem } from "@/settings/types";

// ── Focus areas ───────────────────────────────────────────────────────────────

const FOCUS_AREAS = [
  { icon: Code2, title: "Frontend", desc: "React · Next.js · TypeScript" },
  { icon: Server, title: "Backend", desc: "Node.js · Express · GraphQL" },
  { icon: Database, title: "Database", desc: "MongoDB · PostgreSQL · Redis" },
  { icon: Zap, title: "DevOps", desc: "Docker · AWS · CI/CD" },
];

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
}: {
  initialContributions: ContributionDay[];
  showPageCta?: boolean;
}) {
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const building = siteConfig.currentlyBuilding;
  const learning = siteConfig.currentlyLearning;
  const aboutHref = `${innerPages.about.path}/`;

  return (
    <section id="about" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="About" title="About Jay Patel" />

        {/* ── Story + focus — one aligned composition ── */}
        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12 lg:items-stretch">
          {/* Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:col-span-7"
          >
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed">
                I build scalable web applications using{" "}
                <span className="font-semibold text-foreground">React, Next.js, Node.js</span> and
                modern databases — helping startups and businesses ship faster from{" "}
                <span className="font-semibold text-foreground">{siteConfig.location}</span> with{" "}
                <span className="font-semibold text-foreground">{expLabel} years</span> of hands-on
                experience.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
                From real-time chat to configurable form systems and production MERN apps, I own the
                work end to end — architecture, UI, APIs, and deploy — so teams get something that
                holds up under real users, not just a demo that looks good once.
              </p>
            </div>

            {/* Meta strip — solid, not pill soup */}
            <div
              className={cn(
                "mt-8 flex flex-wrap items-center gap-x-5 gap-y-2",
                "border-y border-border/80 py-4 text-sm text-muted-foreground",
              )}
            >
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
                {siteConfig.location}
              </span>
              <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
              <span>
                <span className="font-semibold text-foreground">{expLabel}</span> years shipping
              </span>
              <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Open to freelance / collabs
              </span>
            </div>

            {/* Optional now signals */}
            {(building || learning.length > 0) && (
              <div className="mt-6 space-y-3">
                {building &&
                  (building.url ? (
                    <a
                      href={building.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/10"
                    >
                      <CurrentlyBuildingContent building={building} />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                      <CurrentlyBuildingContent building={building} />
                    </div>
                  ))}

                {learning.length > 0 && (
                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 px-4 py-3">
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
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground"
                          >
                            <span aria-hidden="true">{item.icon}</span>
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA sits with the story — not orphaned under the grid */}
            {showPageCta && (
              <div className="mt-auto pt-8">
                <SectionPageCta href={aboutHref}>{innerPages.about.homeCta}</SectionPageCta>
              </div>
            )}
          </motion.div>

          {/* Focus panel — one unit, aligned edges */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/50">
              <div className="border-b border-border/80 px-5 py-4 sm:px-6">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Where I spend my time
                </p>
                <p className="mt-1 font-heading text-lg font-bold tracking-tight">Focus areas</p>
              </div>

              <ul className="flex flex-1 flex-col divide-y divide-border/70">
                {FOCUS_AREAS.map(({ icon: Icon, title, desc }, i) => (
                  <motion.li
                    key={title}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-primary/[0.03] sm:px-6"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        "bg-primary/10 text-primary transition-colors",
                        "group-hover:bg-primary group-hover:text-primary-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-sm font-bold">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <TechMarquee />
        <GitHubGraph initialDays={initialContributions} />
      </div>
    </section>
  );
}
