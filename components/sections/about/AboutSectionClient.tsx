"use client";

import { motion } from "framer-motion";
import { Hammer, ArrowUpRight, BookOpen, MapPin } from "lucide-react";
import { SectionHeading, SectionPageCta } from "@/components/shared";
import { TerminalPanel } from "@/components/features/terminal";
import { innerPages } from "@/settings/pages";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel, cn } from "@/lib/utils";
import { TechMarquee } from "./TechMarquee";
import { GitHubGraph } from "./GitHubGraph";
import type { ContributionDay } from "@/lib/github-contributions";
import type { BuildingItem } from "@/settings/types";

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
  const withTerminal = siteConfig.showTerminal;

  return (
    <section id="about" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="About" title="About Jay Patel" />

        {/* ── Story + terminal — one aligned composition ── */}
        <div
          className={cn(
            "mt-14 grid gap-10 lg:mt-16 lg:items-start lg:gap-12",
            withTerminal && "lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]",
          )}
        >
          {/* Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
              I&apos;m a Full Stack Developer with {expLabel} years of experience building modern
              web applications and scalable software solutions. I specialize in{" "}
              <strong className="font-semibold text-foreground">
                React, Next.js, Node.js, TypeScript and the MERN stack
              </strong>
              , with experience across frontend development, backend systems, APIs and{" "}
              <strong className="font-semibold text-foreground">real-time applications</strong>.
            </p>

            {/* Meta strip — solid, not pill soup */}
            <div
              className={cn(
                "mt-7 flex flex-wrap items-center gap-x-5 gap-y-2",
                "border-y border-border/80 py-3.5 text-sm text-muted-foreground",
              )}
            >
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
                {siteConfig.location}
              </span>
              <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
              <span>
                <span className="font-semibold text-foreground">{expLabel}</span> years of
                experience
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
              <div className="mt-0 pt-7">
                <SectionPageCta href={aboutHref}>{innerPages.about.homeCta}</SectionPageCta>
              </div>
            )}
          </motion.div>

          {/* Interactive terminal — desktop only; the hidden input misbehaves on mobile keyboards */}
          {withTerminal && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <TerminalPanel />
            </motion.div>
          )}
        </div>

        <TechMarquee />
        <GitHubGraph initialDays={initialContributions} />
      </div>
    </section>
  );
}
