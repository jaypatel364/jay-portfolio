"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircleQuestion, Sparkles, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/services/types";
import { FAQCard, FloatingBlobs } from "@/components/sections/faq/FAQParts";
import { SectionHeading } from "@/components/shared";

/** Service FAQ — accordion UI without homepage category tags / explore tracker. */
export function ServiceFaqAccordion({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const items = service.faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative scroll-mt-28 py-16 md:py-24">
      <FloatingBlobs />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <SectionHeading label="FAQ" title={`${service.title} — questions answered`} />
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground"
          >
            Practical answers about scope, timeline, technology, and how I work on{" "}
            {service.seo.focusKeyword} engagements.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {items.map((item, i) => (
              <FAQCard
                key={item.question}
                question={item.question}
                answer={item.answer}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
                reduced={reduced}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="flex flex-col items-center gap-4 px-8 py-8 text-center sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <MessageCircleQuestion className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-heading text-base font-bold text-foreground">
                Still evaluating fit?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Share your product context — I&apos;ll reply with honest feedback on scope and
                timeline.
              </p>
            </div>
            <a
              href={service.hero.primaryCta.href}
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              {service.hero.primaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
