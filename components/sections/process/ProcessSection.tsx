"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { ProcessInteractive } from "./ProcessInteractive";

/** Skills page — interactive four-step delivery process. */
export function ProcessSection() {
  const { process } = siteConfig;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative border-t border-border/60 py-10 md:py-16"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {process.label}
          </span>
          <h2
            id="process-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            {process.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {process.intro}
          </p>
        </motion.div>

        <ProcessInteractive steps={process.steps} sectionId="process" fullWidth className="mt-12" />
      </div>
    </section>
  );
}
