"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Clock,
  Globe,
  GraduationCap,
  Layers,
  Rocket,
  Shield,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel, cn } from "@/lib/utils";
import { innerPages } from "@/settings/pages";
import { WhyChooseVisual } from "./WhyChooseVisual";

const ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  rocket: Rocket,
  zap: Zap,
  shield: Shield,
  layers: Layers,
  users: Users,
  globe: Globe,
  graduation: GraduationCap,
  clock: Clock,
};

function interpolateExperience(text: string, expLabel: string) {
  return text.replace("Years of production", `${expLabel} years of production`);
}

export function WhyChooseSection({ showBottomCta = true }: { showBottomCta?: boolean }) {
  const { whyChoose } = siteConfig;
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const contactHref = `${innerPages.contact.path}/`;

  return (
    <section id="why-choose" className="relative px-4 py-14 sm:px-6 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto w-full min-w-0 max-w-6xl">
        {/*
          Page scroll + sticky right (no nested overflow).
          Left grows naturally; right stays pinned while you scroll past.
        */}
        <div className="grid min-w-0 items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                {whyChoose.label}
              </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                {whyChoose.title}
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {whyChoose.intro}
              </p>
            </motion.div>

            <ul className="mt-8 space-y-2.5 sm:mt-10">
              {whyChoose.points.map((point, i) => {
                const Icon = ICON_MAP[point.icon] ?? Briefcase;
                const label = interpolateExperience(point.text, expLabel);

                return (
                  <motion.li
                    key={point.text}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(i * 0.03, 0.24),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div
                      className={cn(
                        "group flex items-center gap-3.5 rounded-2xl border border-transparent px-3 py-3 transition-colors duration-300",
                        "hover:border-primary/20 hover:bg-primary/[0.04]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                          "bg-primary/10 text-primary transition-all duration-300",
                          "group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow",
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
                      </span>
                      <span className="text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
                        {label}
                      </span>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <WhyChooseVisual />

              <p className="text-center text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {whyChoose.visualCaption}
              </p>

              {showBottomCta ? (
                <div className="rounded-2xl border border-border bg-card/80 p-6 text-center backdrop-blur-sm sm:p-8">
                  <h3 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                    {whyChoose.cta.title}{" "}
                    <span className="gradient-text">{whyChoose.cta.titleHighlight}</span>{" "}
                    {whyChoose.cta.titleSuffix}
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {whyChoose.cta.description}
                  </p>
                  <Link
                    href={contactHref}
                    className="btn-shine group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:min-w-[220px]"
                  >
                    {whyChoose.cta.button}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
