"use client";

/**
 * FAQSection — "Ask Me Anything" accordion
 *
 * Design: developer-notebook meets OS terminal.
 *
 * Toolbar  — one unified bar:  filter pills on the left  |  segment dots on the right.
 *            The segment dots (■ ■ ■ □ □ □) live inside the same bordered card as the
 *            filter pills, separated by a vertical rule — visually one cohesive control.
 *
 * Progress — a Set<number> tracks every question the user has ever opened.
 *            The dots fill up as they explore; when all are filled a compact celebration
 *            banner slides in just below the toolbar (no modal, no full-screen takeover).
 *
 * Cards    — IDE line-number gutter, per-category colour accent, animated left border,
 *            radial ink-blob glow, ResizeObserver height animation.
 *
 * A11y     — aria-expanded / aria-controls, keyboard Enter/Space, focus rings, reduced-motion.
 */

import { useState, useId, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageCircleQuestion,
  ChevronRight,
  Sparkles,
  ArrowRight,
  PartyPopper,
} from "lucide-react";
import { siteConfig, type FAQCategory } from "@/lib/site-config";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

// ─── Category meta ────────────────────────────────────────────────────────────

const CATEGORY_META: Record<FAQCategory | "all", { label: string; color: string; glow: string }> = {
  all: {
    label: "All",
    color: "var(--primary)",
    glow: "color-mix(in oklch, var(--primary) 18%, transparent)",
  },
  work: {
    label: "Work",
    color: "oklch(0.68 0.18 160)",
    glow: "oklch(0.68 0.18 160 / 0.18)",
  },
  tech: {
    label: "Tech",
    color: "oklch(0.65 0.19 250)",
    glow: "oklch(0.65 0.19 250 / 0.18)",
  },
  personal: {
    label: "Personal",
    color: "oklch(0.70 0.18 330)",
    glow: "oklch(0.70 0.18 330 / 0.18)",
  },
  process: {
    label: "Process",
    color: "oklch(0.72 0.17 45)",
    glow: "oklch(0.72 0.17 45 / 0.18)",
  },
};

type Filter = FAQCategory | "all";

// ─── Animated height wrapper ──────────────────────────────────────────────────

function ExpandPanel({
  open,
  children,
  reduced,
}: {
  open: boolean;
  children: React.ReactNode;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.scrollHeight));
    ro.observe(el);
    setHeight(el.scrollHeight);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              height: { type: "spring", stiffness: 340, damping: 36 },
              opacity: { duration: 0.22 },
            }
      }
      style={{ overflow: "hidden" }}
      aria-hidden={!open}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}

// ─── Single FAQ card ──────────────────────────────────────────────────────────

function FAQCard({
  question,
  answer,
  category,
  index,
  isOpen,
  onToggle,
  reduced,
}: {
  question: string;
  answer: string;
  category: FAQCategory;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reduced: boolean;
}) {
  const id = useId();
  const meta = CATEGORY_META[category];
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.48, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        isOpen
          ? "border-[--faq-color]/40 bg-card shadow-[0_0_0_1px_var(--faq-color,var(--primary))_/_0.12,_0_8px_32px_var(--faq-color,var(--primary))_/_0.10]"
          : "border-border bg-card hover:border-[--faq-color]/25 hover:shadow-[0_4px_24px_var(--faq-color,var(--primary))_/_0.08]",
      )}
      style={{ "--faq-color": meta.color } as React.CSSProperties}
    >
      {/* Left accent border */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-[3px] rounded-l-2xl transition-all duration-500",
          isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-40",
        )}
        style={{
          background: `linear-gradient(180deg, ${meta.color}, ${meta.color}55, ${meta.color})`,
          boxShadow: isOpen ? `0 0 12px 2px ${meta.color}60` : "none",
        }}
      />

      {/* Radial ink blob */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl"
            style={{ background: meta.glow }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Question toggle button */}
      <button
        id={`faq-btn-${id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
        onClick={onToggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onToggle())}
        className="relative z-10 flex w-full items-start gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* IDE line number */}
        <span
          className="mt-0.5 shrink-0 font-mono text-xs font-semibold tabular-nums leading-5 transition-colors duration-300"
          style={{ color: isOpen ? meta.color : "var(--muted-foreground)" }}
          aria-hidden
        >
          {num}
        </span>

        {/* Question */}
        <span className="flex-1 font-heading text-base font-semibold leading-snug text-foreground sm:text-[17px]">
          {question}
        </span>

        {/* Category badge + chevron */}
        <span className="mt-1 flex shrink-0 items-center gap-2.5">
          <span
            className="hidden rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest sm:inline-flex"
            style={{
              color: meta.color,
              borderColor: `${meta.color}35`,
              background: `${meta.color}0e`,
            }}
          >
            {meta.label}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 28 }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200"
            style={{
              background: isOpen ? `${meta.color}18` : "var(--muted)",
              color: isOpen ? meta.color : "var(--muted-foreground)",
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.span>
        </span>
      </button>

      {/* Answer panel */}
      <div id={`faq-panel-${id}`} role="region" aria-labelledby={`faq-btn-${id}`}>
        <ExpandPanel open={isOpen} reduced={reduced}>
          <div className="relative z-10 px-6 pb-6 pt-0">
            <div
              className="mb-4 h-px w-full"
              style={{ background: `linear-gradient(90deg, ${meta.color}40, transparent)` }}
            />
            <p
              className="mb-2 font-mono text-[11px] font-medium uppercase tracking-widest"
              style={{ color: `${meta.color}bb` }}
              aria-hidden
            >
              &#x25B7;&nbsp;answer
            </p>
            <p className="text-sm leading-[1.85] text-muted-foreground sm:text-[15px]">{answer}</p>
          </div>
        </ExpandPanel>
      </div>
    </motion.div>
  );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({
  filter,
  active,
  count,
  onClick,
}: {
  filter: Filter;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  const meta = CATEGORY_META[filter];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active && (
        <motion.span
          layoutId="faq-filter-active"
          className="absolute inset-0 rounded-full border"
          style={{ background: `${meta.color}14`, borderColor: `${meta.color}35` }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      )}
      {filter !== "all" && (
        <span
          className="relative z-10 h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: meta.color }}
        />
      )}
      <span className="relative z-10">{meta.label}</span>
      <span
        className="relative z-10 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 font-mono text-[10px] tabular-nums"
        style={{
          background: active ? `${meta.color}20` : "var(--muted)",
          color: active ? meta.color : "var(--muted-foreground)",
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Segment dots ─────────────────────────────────────────────────────────────
// Terminal-style progress: ■ ■ ■ □ □ □ — each square = one FAQ question.
// Filled = ever opened. Pulses with a glow burst when allDone.

function SegmentDots({ total, done, allDone }: { total: number; done: number; allDone: boolean }) {
  return (
    <div
      className="flex items-center gap-[4px]"
      aria-label={`${done} of ${total} questions explored`}
      title={`${done}/${total} explored`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          className="block rounded-[2px]"
          style={{ width: 7, height: 7 }}
          animate={
            i < done
              ? {
                  opacity: 1,
                  scale: allDone ? [1, 1.5, 1] : 1,
                  background: "var(--primary)",
                  boxShadow: allDone && i < done ? "0 0 5px 1px var(--glow)" : "none",
                }
              : { opacity: 0.2, scale: 1, background: "var(--border)", boxShadow: "none" }
          }
          transition={
            allDone && i < done
              ? { delay: i * 0.055, duration: 0.4, ease: "backOut" }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

// ─── Unified toolbar ──────────────────────────────────────────────────────────
// One bordered card: [ filter pills ] | [ segment dots  N/T ]

function Toolbar({
  activeFilter,
  counts,
  onFilterChange,
  total,
  done,
  allDone,
}: {
  activeFilter: Filter;
  counts: Record<Filter, number>;
  onFilterChange: (f: Filter) => void;
  total: number;
  done: number;
  allDone: boolean;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card/70 p-1.5 backdrop-blur-sm"
      role="group"
      aria-label="Filter FAQ by category"
    >
      {/* Filter pills */}
      {(["all", "work", "tech", "personal", "process"] as Filter[]).map((f) =>
        counts[f] > 0 || f === "all" ? (
          <FilterPill
            key={f}
            filter={f}
            active={activeFilter === f}
            count={counts[f]}
            onClick={() => onFilterChange(f)}
          />
        ) : null,
      )}

      {/* Vertical divider */}
      <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden />

      {/* Segment dots + fraction */}
      <div className="flex items-center gap-2 px-2 py-1">
        <SegmentDots total={total} done={done} allDone={allDone} />
        <span
          className="font-mono text-[10px] tabular-nums"
          style={{ color: allDone ? "var(--primary)" : "var(--muted-foreground)" }}
        >
          {done}/{total}
        </span>
      </div>
    </div>
  );
}

// ─── "All done" celebration banner ───────────────────────────────────────────
// Slides in below the toolbar once every question has been opened.
// Compact, inline — not a modal, not a toast. Fits all screen sizes.

function AllDoneBanner({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="relative overflow-hidden rounded-xl border border-primary/25 bg-card px-4 py-3"
    >
      {/* Shimmer sweep */}
      <motion.div
        className="pointer-events-none absolute inset-0 -skew-x-12"
        initial={{ x: "-110%" }}
        animate={{ x: "110%" }}
        transition={{ duration: 0.9, ease: "easeInOut", delay: 0.1 }}
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 12%, transparent), transparent)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-wrap items-center gap-2.5">
        {/* Trophy icon with bounce */}
        <motion.span
          animate={reduced ? {} : { rotate: [0, -12, 12, -8, 8, 0] }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeInOut" }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg gradient-primary shadow-glow"
        >
          <PartyPopper className="h-4 w-4 text-primary-foreground" />
        </motion.span>

        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="font-heading text-sm font-bold text-foreground">
            You&apos;ve read everything.
          </span>
          <span className="text-xs text-muted-foreground">
            Still curious? Drop me a message — I&apos;d love to chat.
          </span>
        </div>

        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="ml-auto shrink-0 rounded-lg border border-primary/30 bg-primary/8 px-3 py-1.5 font-mono text-[11px] font-semibold text-primary transition-all hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          say hi →
        </button>
      </div>
    </motion.div>
  );
}

// ─── Floating decorative blobs ────────────────────────────────────────────────

function FloatingBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -right-32 -top-24 h-80 w-80 rounded-full opacity-[0.045] blur-3xl"
        style={{ background: "var(--primary)", animation: "faq-blob-1 18s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-20 -left-24 h-64 w-64 rounded-full opacity-[0.04] blur-3xl"
        style={{
          background: "oklch(0.68 0.18 160)",
          animation: "faq-blob-2 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-1/4 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full opacity-[0.035] blur-3xl"
        style={{
          background: "oklch(0.70 0.18 330)",
          animation: "faq-blob-3 15s ease-in-out infinite",
        }}
      />
    </div>
  );
}

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

          <SectionHeading label="FAQ" title="Ask Me Anything" />

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            Honest answers to the questions I get asked most often — about my work, my stack, and
            how I think.
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
                If something isn&apos;t covered above, just ask directly — I reply to every message.
              </p>
            </div>
            <button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Sparkles className="h-4 w-4" />
              Let&apos;s Talk
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
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
