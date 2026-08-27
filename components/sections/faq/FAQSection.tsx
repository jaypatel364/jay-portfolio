"use client";

/**
 * FAQSection — hiring FAQ accordion
 */

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircleQuestion, Sparkles, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "@/components/shared";
import { type Filter } from "./faq-meta";
import { FAQCard, Toolbar, AllDoneBanner, FloatingBlobs } from "./FAQParts";

// ─── Main export ──────────────────────────────────────────────────────────────

export function FAQSection() {
  const reduced = useReducedMotion() ?? false;
  const items = siteConfig.faqItems;

  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Accumulates every global index ever opened — never shrinks
  const [everOpened, setEverOpened] = useState<Set<number>>(new Set());

  const allDone = everOpened.size === items.length;

  const counts = (["all", "work", "tech", "personal", "process"] as Filter[]).reduce(
    (acc, f) => {
      acc[f] = f === "all" ? items.length : items.filter((i) => i.category === f).length;
      return acc;
    },
    {} as Record<Filter, number>,
  );

  const filtered =
    activeFilter === "all" ? items : items.filter((i) => i.category === activeFilter);

  const handleToggle = (idx: number) => {
    setOpenIndex((prev) => {
      const next = prev === idx ? null : idx;
      if (next !== null) setEverOpened((s) => new Set(s).add(next));
      return next;
    });
  };

  const handleFilterChange = (f: Filter) => {
    setActiveFilter(f);
    setOpenIndex(null);
  };

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <FloatingBlobs />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* ── Heading ───────────────────────────────────────────────────── */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          {/* <motion.div
            initial={reduced ? false : { opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground/50"
          >
            <span className="h-px w-12 bg-border" />
            <span>// ask_me_anything.ts</span>
            <span className="h-px w-12 bg-border" />
          </motion.div> */}

          <SectionHeading label="FAQ" title="Full Stack Developer FAQ" />

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            Honest answers about my experience, technology stack, development process, and how I
            work.
          </motion.p>
        </div>

        {/* ── Unified toolbar ───────────────────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mb-3"
        >
          <Toolbar
            activeFilter={activeFilter}
            counts={counts}
            onFilterChange={handleFilterChange}
            total={items.length}
            done={everOpened.size}
            allDone={allDone}
          />
        </motion.div>

        {/* ── "All done" celebration banner — slides in when allDone ────── */}
        <AnimatePresence>
          {allDone && (
            <div className="mb-6">
              <AllDoneBanner reduced={reduced} />
            </div>
          )}
        </AnimatePresence>

        {/* Spacer when banner not shown */}
        {!allDone && <div className="mb-6" />}

        {/* ── Accordion list ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-3"
          >
            {filtered.map((item, i) => {
              const globalIdx = items.indexOf(item);
              return (
                <FAQCard
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  category={item.category}
                  index={i}
                  isOpen={openIndex === globalIdx}
                  onToggle={() => handleToggle(globalIdx)}
                  reduced={reduced}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── "Still curious?" CTA ──────────────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="flex flex-col items-center gap-4 px-8 py-8 text-center sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <MessageCircleQuestion className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-heading text-base font-bold text-foreground">
                Still have a question?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                If you&apos;re unsure whether I&apos;m the right fit for your project, feel free to
                reach out. I&apos;ll get back to you within{" "}
                <strong className="font-semibold text-foreground">24 hours</strong>.
              </p>
            </div>
            <a
              href="/contact/"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Sparkles className="h-4 w-4" />
              Get in Touch
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--primary), var(--glow), transparent)",
              opacity: 0.3,
            }}
          />
        </motion.div>
      </div>

      <style>{`
        @keyframes faq-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-5%, 8%)  scale(1.08); }
          66%       { transform: translate(6%, -5%)  scale(0.96); }
        }
        @keyframes faq-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(7%, -6%)  scale(1.1); }
          70%       { transform: translate(-4%, 9%)  scale(0.92); }
        }
        @keyframes faq-blob-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    }
          50%       { transform: translate(-50%, -50%) scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="faq-blob"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
