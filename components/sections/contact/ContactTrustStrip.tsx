"use client";

import { motion } from "framer-motion";
import { EXPERIENCES } from "@/lib/resume-data";
import { siteConfig } from "@/lib/site-config";

/** Contact page — social proof from production employers. */
export function ContactTrustStrip() {
  const copy = siteConfig.contactPage.trust;

  return (
    <section
      aria-labelledby="contact-trust-heading"
      className="border-t border-border/60 px-6 py-10 md:py-14"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {copy.label}
          </span>
          <h2
            id="contact-trust-heading"
            className="font-heading mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {copy.intro}
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-8 flex list-none flex-wrap items-center justify-center gap-3"
        >
          {EXPERIENCES.map((exp) => (
            <li key={exp.company + exp.period}>
              <a
                href={exp.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                {exp.company}
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
