"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";

/** Large typographic statement — no cards. */
export function ServiceBigStatement({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const intro = service.editorialIntro;
  if (!intro) return null;

  const words = intro.statement.split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section id="statement" className="scroll-mt-32 w-full py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-4xl"
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Perspective
          </p>
          <h2 className="font-heading mt-6 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-balance">
            <span className="block">{line1}</span>
            <span className="mt-1 block text-muted-foreground">{line2}</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {intro.supporting}
          </p>
          {intro.pullQuote ? (
            <p className="mt-6 font-mono text-sm text-primary/90">
              {"// "}
              {intro.pullQuote}
            </p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
