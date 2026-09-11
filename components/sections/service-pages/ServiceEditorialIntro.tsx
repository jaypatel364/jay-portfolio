"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceEditorialIntro({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const intro = service.editorialIntro;
  if (!intro) return null;

  const overviewParagraphs = service.overview.split("\n\n").filter(Boolean);

  return (
    <SectionFrame id="editorial-intro" label="Perspective" title="What this service actually means">
      <motion.blockquote
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        className="border-l-[3px] border-primary/50 pl-6"
      >
        <p className="font-heading text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl">
          {intro.statement}
        </p>
      </motion.blockquote>

      <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {intro.supporting}
      </p>

      {intro.pullQuote ? (
        <p className="mt-8 font-mono text-sm font-medium text-primary/90">
          {"// "}
          {intro.pullQuote}
        </p>
      ) : null}

      {overviewParagraphs[0] ? (
        <div id="overview" className="mt-12 border-t border-border/60 pt-12">
          <h3 className="font-heading text-xl font-semibold text-foreground">In practice</h3>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            {overviewParagraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
      ) : null}
    </SectionFrame>
  );
}
