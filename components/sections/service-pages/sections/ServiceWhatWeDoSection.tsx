"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/lib/services/types";
import { innerPages } from "@/settings/pages";
import { ServiceWhatWeDoVisual } from "./ServiceWhatWeDoVisual";

function stackItems(service: Service): string[] {
  const fromHero = service.hero.technologies ?? [];
  const fromLabels = service.categoryLabels;
  return [...fromLabels, ...fromHero.filter((t) => !fromLabels.includes(t))].slice(0, 4);
}

function highlightPoints(service: Service): string[] {
  const fromBuild = (service.whatWeBuild ?? []).slice(0, 3);
  if (fromBuild.length >= 3) return fromBuild;
  const fromCaps = service.capabilities.slice(0, 3).map((c) => c.title);
  return [...fromBuild, ...fromCaps.filter((t) => !fromBuild.includes(t))].slice(0, 3);
}

export function ServiceWhatWeDoSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const intro = service.editorialIntro;
  const highlights = highlightPoints(service);
  const paragraphs = service.whatWeDo.paragraphs.slice(0, 2);
  const aboutHref = `${innerPages.about.path}/`;

  return (
    <section
      id="what-we-do"
      aria-labelledby="what-we-do-heading"
      className="scroll-mt-28 py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] lg:gap-12 xl:gap-14">
        {/* Left — About me outline CTA + visual */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0"
        >
          <Link
            href={aboutHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/35 hover:bg-primary/5"
          >
            About me
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>

          <ServiceWhatWeDoVisual
            serviceTitle={service.title}
            stackItems={stackItems(service)}
            className="mt-6"
          />
        </motion.div>

        {/* Right — label + H2 + content */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 lg:pt-1"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            What I do
          </span>
          <h2
            id="what-we-do-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl"
          >
            {service.whatWeDo.heading}
          </h2>

          {intro?.statement ? (
            <p className="font-heading mt-5 text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
              {intro.statement}
            </p>
          ) : null}

          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
            {intro?.supporting ? <p>{intro.supporting}</p> : null}
            {paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>

          {highlights.length > 0 ? (
            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground sm:text-[15px]">
                What sets this {service.title.toLowerCase()} engagement apart?
              </p>
              <ul className="mt-4 space-y-3">
                {highlights.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground sm:text-[15px]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
