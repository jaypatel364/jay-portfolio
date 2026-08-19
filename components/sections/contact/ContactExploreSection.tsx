"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase, Layers, User, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { innerPages, type InnerPageKey } from "@/settings/pages";

const PAGE_ICONS: Record<"work" | "skills" | "about", LucideIcon> = {
  work: Briefcase,
  skills: Layers,
  about: User,
};

/** Contact page — cross-links to work, skills, and about before hiring. */
export function ContactExploreSection() {
  const copy = siteConfig.contactPage.explore;

  return (
    <section
      aria-labelledby="contact-explore-heading"
      className="border-t border-border/60 px-6 pb-24 pt-10 md:pb-28 md:pt-14"
    >
      <div className="mx-auto max-w-6xl">
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
            id="contact-explore-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {copy.intro}
          </p>
        </motion.div>

        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {copy.items.map((item, i) => {
            const page = innerPages[item.page as Exclude<InnerPageKey, "contact">];
            const Icon = PAGE_ICONS[item.page];
            const href = `${page.path}/`;

            return (
              <motion.li
                key={item.page}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(i * 0.06, 0.18),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={href}
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm",
                    "transition-all duration-300 hover:border-primary/25 hover:shadow-glow",
                  )}
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" strokeWidth={2.1} aria-hidden />
                  </span>

                  <h3 className="font-heading mt-5 text-lg font-bold tracking-tight">
                    {page.label}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {page.homeCta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
