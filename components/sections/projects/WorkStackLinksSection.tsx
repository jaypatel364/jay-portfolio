"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionPageCta } from "@/components/shared";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { innerPages } from "@/settings/pages";
import { getProjectStackTags } from "@/settings/projects";

/** Work page — tag cloud linking back to the skills catalog. */
export function WorkStackLinksSection() {
  const copy = siteConfig.workPage.stackLinks;
  const tags = getProjectStackTags();
  const skillsHref = `${innerPages.skills.path}/#stack-catalog`;

  return (
    <section
      id="work-stack"
      aria-labelledby="work-stack-heading"
      className="relative mt-16 border-t border-border/60 pt-10 md:mt-20 md:pt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          {copy.label}
        </span>
        <h2
          id="work-stack-heading"
          className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {copy.intro}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="mt-8 flex flex-wrap justify-center gap-2"
      >
        {tags.map((tag, i) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.24) }}
          >
            <Link
              href={skillsHref}
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3.5 py-2",
                "text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-200",
                "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
              )}
            >
              {tag}
              <ArrowUpRight
                className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                aria-hidden
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <p className="sr-only">
        Technologies used in Jay Patel portfolio projects include {tags.join(", ")}.
      </p>

      <div className="mt-10 flex justify-center">
        <SectionPageCta href={skillsHref}>{copy.cta}</SectionPageCta>
      </div>
    </section>
  );
}
