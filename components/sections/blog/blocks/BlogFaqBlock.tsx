"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { ExpandPanel } from "@/components/sections/faq/FAQParts";
import { CATEGORY_META } from "@/components/sections/faq/faq-meta";
import { cn } from "@/lib/utils";

type FaqItem = { question?: string; answer?: string };

function BlogFaqCard({
  item,
  index,
  isOpen,
  onToggle,
  reduced,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reduced: boolean;
}) {
  const meta = CATEGORY_META.tech;
  const num = String(index + 1).padStart(2, "0");
  const id = (item.question ?? `faq-${index}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        isOpen
          ? "border-[--faq-color]/40 bg-card shadow-[0_0_0_1px_var(--faq-color,var(--primary))_/_0.12,_0_8px_32px_var(--faq-color,var(--primary))_/_0.10]"
          : "border-border bg-card hover:border-[--faq-color]/25 hover:shadow-[0_4px_24px_var(--faq-color,var(--primary))_/_0.08]",
      )}
      style={{ "--faq-color": meta.color } as React.CSSProperties}
    >
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

      {isOpen ? (
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl"
          style={{ background: meta.glow }}
          aria-hidden
        />
      ) : null}

      <div className="relative z-10 flex items-start gap-4 px-5 sm:px-6">
        <span
          className="mt-[1.375rem] shrink-0 font-mono text-xs font-semibold tabular-nums leading-5 transition-colors duration-300"
          style={{ color: isOpen ? meta.color : "var(--muted-foreground)" }}
          aria-hidden
        >
          {num}
        </span>

        <h4 className="relative m-0 min-w-0 flex-1 text-base font-semibold">
          <button
            id={`blog-faq-btn-${id}`}
            type="button"
            aria-expanded={isOpen}
            aria-controls={`blog-faq-panel-${id}`}
            onClick={onToggle}
            className="relative w-full py-5 text-left font-heading text-base font-semibold leading-snug text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-[17px] after:absolute after:inset-y-0 after:-left-14 after:-right-20 after:content-['']"
          >
            {item.question}
          </button>
        </h4>

        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 28 }}
          className="mt-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200"
          style={{
            background: isOpen ? `${meta.color}18` : "var(--muted)",
            color: isOpen ? meta.color : "var(--muted-foreground)",
          }}
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.span>
      </div>

      <div id={`blog-faq-panel-${id}`} role="region" aria-labelledby={`blog-faq-btn-${id}`}>
        <ExpandPanel open={isOpen} reduced={reduced}>
          <div className="relative z-10 px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
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
            <p className="text-sm leading-[1.85] text-muted-foreground sm:text-[15px]">
              {item.answer}
            </p>
          </div>
        </ExpandPanel>
      </div>
    </motion.div>
  );
}

function ProgressDots({ total, done }: { total: number; done: number }) {
  return (
    <div
      className="flex items-center gap-[4px]"
      aria-label={`${done} of ${total} questions explored`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="block rounded-[2px] transition-all duration-200"
          style={{
            width: 7,
            height: 7,
            opacity: i < done ? 1 : 0.2,
            background: i < done ? "var(--primary)" : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}

export function BlogFaqBlock({ title, items }: { title?: string; items: FaqItem[] }) {
  const reduced = useReducedMotion() ?? false;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [everOpened, setEverOpened] = useState<Set<number>>(new Set());

  if (!items.length) return null;

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => {
      const next = prev === index ? null : index;
      if (next !== null) setEverOpened((s) => new Set(s).add(next));
      return next;
    });
  };

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
            <HelpCircle className="h-4 w-4 text-primary" aria-hidden />
          </div>
          {title ? (
            <h3 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {title}
            </h3>
          ) : (
            <h3 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Common questions
            </h3>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5">
          <ProgressDots total={items.length} done={everOpened.size} />
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
            {everOpened.size}/{items.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <BlogFaqCard
            key={item.question ?? index}
            item={item}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            reduced={reduced}
          />
        ))}
      </div>
    </section>
  );
}
