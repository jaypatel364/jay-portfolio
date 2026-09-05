"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/services/types";

export function ServiceFinalCta({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="contact-cta"
      aria-labelledby="service-cta-heading"
      className="scroll-mt-32 w-full border-t border-border/60"
    >
      <div className="w-full bg-gradient-to-b from-muted/20 to-background px-4 py-20 sm:px-6 md:py-28">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary/20 bg-card px-6 py-12 sm:px-10 sm:py-16"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Next step
            </p>
            <h2
              id="service-cta-heading"
              className="font-heading mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            >
              Have a product in mind?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Let&apos;s turn the difficult part of {service.title.toLowerCase()} into something you
              don&apos;t have to worry about — no pitch deck, just an honest conversation about what
              you&apos;re building.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={service.hero.primaryCta.href}
                className="group inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/work/"
                className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/35 hover:bg-primary/5"
              >
                Explore selected work
              </Link>
            </div>
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              Usually replies within 24 hours · Remote-friendly
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
