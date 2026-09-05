"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Database,
  FileCode2,
  GitBranch,
  Layers,
  Monitor,
  Rocket,
  Server,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/lib/services/types";
import { cn } from "@/lib/utils";

const DELIVERABLE_ICONS: LucideIcon[] = [
  Layers,
  Monitor,
  Server,
  Database,
  Shield,
  GitBranch,
  BookOpen,
  Rocket,
  FileCode2,
  CheckCircle2,
];

function iconForDeliverable(title: string, index: number): LucideIcon {
  const t = title.toLowerCase();
  if (t.includes("architect")) return Layers;
  if (t.includes("frontend") || t.includes("application") || t.includes("ui")) return Monitor;
  if (t.includes("api") || t.includes("backend")) return Server;
  if (t.includes("database") || t.includes("schema") || t.includes("data")) return Database;
  if (t.includes("test") || t.includes("security") || t.includes("auth")) return Shield;
  if (t.includes("ci") || t.includes("deploy") || t.includes("pipeline") || t.includes("devops"))
    return GitBranch;
  if (t.includes("doc")) return BookOpen;
  if (t.includes("monitor") || t.includes("observ")) return CheckCircle2;
  if (t.includes("production") || t.includes("launch") || t.includes("mvp")) return Rocket;
  return DELIVERABLE_ICONS[index % DELIVERABLE_ICONS.length];
}

function DeliverablesVisual({ count }: { count: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/25 bg-card shadow-premium">
      <div className="absolute inset-0 bg-grid opacity-35" aria-hidden />
      <div
        className="aurora-blob absolute -left-8 top-0 h-36 w-36 bg-primary opacity-40"
        style={{ animation: "aurora-1 12s ease-in-out infinite" }}
        aria-hidden
      />
      <div
        className="aurora-blob absolute -bottom-10 right-0 h-32 w-32 bg-glow opacity-35"
        style={{ animation: "aurora-2 14s ease-in-out infinite" }}
        aria-hidden
      />

      <div className="relative space-y-5 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
              Included
            </p>
            <p className="font-heading mt-1 text-lg font-bold tracking-tight">Delivery blueprint</p>
          </div>
          <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[11px] font-bold text-primary">
            {count} items
          </span>
        </div>

        <ul className="space-y-2">
          {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2 dark:bg-background/30"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="h-2 flex-1 rounded-full bg-muted-foreground/15" />
              <span
                className="h-2 rounded-full bg-primary/25"
                style={{ width: `${28 + ((i * 17) % 40)}%` }}
              />
            </li>
          ))}
        </ul>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Concrete outputs — architecture, code, tests, and handoff notes your team can extend.
        </p>
      </div>
    </div>
  );
}

/** Deliverables — reuses About / Why Choose icon-row language. */
export function ServiceDeliverablesSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  const items = service.deliverables;

  return (
    <section
      id="deliverables"
      aria-labelledby="deliverables-heading"
      className="scroll-mt-28 border-y border-border/60 bg-muted/25 py-16 dark:bg-muted/10 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Deliverables
              </span>
              <h2
                id="deliverables-heading"
                className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl"
              >
                What you receive
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Concrete outputs from this engagement — not vague promises.
              </p>
            </motion.div>

            <ul className="mt-8 space-y-2 sm:mt-10">
              {items.map((item, i) => {
                const Icon = iconForDeliverable(item.title, i);
                return (
                  <motion.li
                    key={item.title}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(i * 0.03, 0.24),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div
                      className={cn(
                        "group flex items-start gap-3.5 rounded-2xl border border-transparent px-3 py-3 transition-colors duration-300",
                        "hover:border-primary/20 hover:bg-primary/[0.04]",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                          "bg-primary/10 text-primary transition-all duration-300",
                          "group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow",
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} aria-hidden />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <DeliverablesVisual count={items.length} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
