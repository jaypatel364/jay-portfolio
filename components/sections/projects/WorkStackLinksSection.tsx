"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Boxes, Code2, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { SectionPageCta } from "@/components/shared";
import { SKILL_GROUPS, type Skill } from "@/components/sections/skills/skill-data";
import { useTheme } from "@/hooks/use-theme";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { innerPages } from "@/settings/pages";
import { getProjectStackUsage, projectHref } from "@/settings/projects";

type StackLayer = "all" | "Frontend" | "Backend" | "Tools & DevOps" | "Other";

type StackItem = {
  tag: string;
  count: number;
  projects: { slug: string; title: string }[];
  skill: Skill | null;
  layer: Exclude<StackLayer, "all">;
};

/** Map project tags → skill-catalog names when wording differs. */
const TAG_ALIASES: Record<string, string> = {
  "Tailwind CSS": "Tailwind",
  WebSockets: "Socket.io",
  "AWS Rekognition": "AWS",
};

const LAYERS: { value: StackLayer; label: string; icon: LucideIcon }[] = [
  { value: "all", label: "All", icon: Boxes },
  { value: "Frontend", label: "Frontend", icon: SKILL_GROUPS[0].icon },
  { value: "Backend", label: "Backend", icon: SKILL_GROUPS[1].icon },
  { value: "Tools & DevOps", label: "Tools", icon: SKILL_GROUPS[2].icon },
  { value: "Other", label: "Other", icon: Code2 },
];

function buildStackItems(): StackItem[] {
  const skillByName = new Map<
    string,
    { skill: Skill; layer: Exclude<StackLayer, "all" | "Other"> }
  >();
  for (const group of SKILL_GROUPS) {
    for (const skill of group.skills) {
      skillByName.set(skill.name.toLowerCase(), {
        skill,
        layer: group.category as Exclude<StackLayer, "all" | "Other">,
      });
    }
  }

  return getProjectStackUsage().map((entry) => {
    const lookup = TAG_ALIASES[entry.tag] ?? entry.tag;
    const match = skillByName.get(lookup.toLowerCase());
    return {
      ...entry,
      skill: match?.skill ?? null,
      layer: match?.layer ?? "Other",
    };
  });
}

const STACK_ITEMS = buildStackItems();

/** Work page — interactive stack panel linking back to the skills catalog. */
export function WorkStackLinksSection() {
  const copy = siteConfig.workPage.stackLinks;
  const skillsHref = `${innerPages.skills.path}/#stack-catalog`;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [layer, setLayer] = useState<StackLayer>("all");
  /** Click-only selection — never follows hover (avoids thrashy UX). */
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered =
    layer === "all" ? STACK_ITEMS : STACK_ITEMS.filter((item) => item.layer === layer);

  const visibleActive =
    activeTag && filtered.some((item) => item.tag === activeTag)
      ? (STACK_ITEMS.find((item) => item.tag === activeTag) ?? null)
      : null;

  function selectLayer(next: StackLayer) {
    setLayer(next);
    // Clear selection when leaving the visible set — user clicks again intentionally
    const nextItems =
      next === "all" ? STACK_ITEMS : STACK_ITEMS.filter((item) => item.layer === next);
    if (activeTag && !nextItems.some((item) => item.tag === activeTag)) {
      setActiveTag(null);
    }
  }

  return (
    <section
      id="work-stack"
      aria-labelledby="work-stack-heading"
      className="relative mt-16 border-t border-border/60 pt-10 md:mt-20 md:pt-16"
    >
      <div className="pointer-events-none absolute inset-x-0 top-32 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          {copy.label}
        </span>
        <h2
          id="work-stack-heading"
          className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {copy.intro}
        </p>
      </motion.div>

      {/* Layer filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-8 flex justify-center sm:mt-10"
      >
        <div
          className={cn(
            "flex max-w-full items-center gap-0.5 overflow-x-auto rounded-2xl border border-border/70 bg-card/90 p-1.5 shadow-sm backdrop-blur-md",
            "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
          role="tablist"
          aria-label="Filter stack by layer"
        >
          {LAYERS.map((tab) => {
            const Icon = tab.icon;
            const selected = layer === tab.value;
            const count =
              tab.value === "all"
                ? STACK_ITEMS.length
                : STACK_ITEMS.filter((item) => item.layer === tab.value).length;

            if (tab.value !== "all" && count === 0) return null;

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectLayer(tab.value)}
                className={cn(
                  "relative inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  selected ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {selected && (
                  <motion.div
                    layoutId="work-stack-layer"
                    className="absolute inset-0 rounded-xl bg-primary/10 shadow-[inset_0_0_0_1px] shadow-primary/20"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden />
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={cn(
                    "relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                    selected ? "bg-primary/15 text-primary" : "bg-muted/80 text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Solid interactive panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 overflow-hidden rounded-3xl border border-border/70 bg-card/60 shadow-premium backdrop-blur-sm"
      >
        <div className="grid lg:grid-cols-12">
          {/* Tech grid */}
          <div className="lg:col-span-7 lg:border-r lg:border-border/60">
            <div className="border-b border-border/60 px-5 py-4 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {layer === "all"
                  ? "All technologies"
                  : LAYERS.find((l) => l.value === layer)?.label}
                <span className="ml-2 tabular-nums text-foreground/70">{filtered.length}</span>
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.ul
                key={layer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="flex list-none flex-wrap gap-2.5 p-5 sm:gap-3 sm:p-6"
              >
                {filtered.map((item, i) => (
                  <StackChip
                    key={item.tag}
                    item={item}
                    isDark={isDark}
                    selected={visibleActive?.tag === item.tag}
                    delay={Math.min(i * 0.02, 0.2)}
                    onSelect={() => setActiveTag(item.tag)}
                  />
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          {/* Detail rail */}
          <aside className="relative flex flex-col lg:col-span-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />
            <div className="relative flex flex-1 flex-col border-t border-border/60 p-5 sm:p-6 lg:border-t-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {copy.hint}
              </p>

              <AnimatePresence mode="wait">
                {visibleActive ? (
                  <motion.div
                    key={visibleActive.tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 flex flex-1 flex-col"
                  >
                    <DetailHeader item={visibleActive} isDark={isDark} />

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {copy.usedIn}{" "}
                      <span className="tabular-nums text-foreground">{visibleActive.count}</span>{" "}
                      {visibleActive.count === 1 ? "project" : "projects"}
                    </p>

                    <ul className="mt-3 space-y-2">
                      {visibleActive.projects.map((project) => (
                        <li key={project.slug}>
                          <Link
                            href={projectHref(project)}
                            className={cn(
                              "group flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/50 px-3.5 py-2.5",
                              "text-sm font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                            )}
                          >
                            <span className="truncate">{project.title}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={skillsHref}
                      className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      View in skills catalog
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={filtered.length === 0 ? "empty-layer" : "idle"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 flex flex-1 flex-col justify-center"
                  >
                    <div className="rounded-2xl border border-dashed border-border/80 bg-background/40 px-5 py-8 text-center">
                      <Boxes className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden />
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {filtered.length === 0 ? "No technologies in this layer." : copy.idle}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </motion.div>

      <p className="sr-only">
        Technologies used in Jay Patel portfolio projects include{" "}
        {STACK_ITEMS.map((item) => item.tag).join(", ")}.
      </p>

      <div className="mt-10 flex justify-center">
        <SectionPageCta href={skillsHref}>{copy.cta}</SectionPageCta>
      </div>
    </section>
  );
}

function DetailHeader({ item, isDark }: { item: StackItem; isDark: boolean }) {
  const color = item.skill ? (isDark ? item.skill.darkColor : item.skill.lightColor) : undefined;
  const Icon = item.skill?.icon as IconType | undefined;

  return (
    <div className="flex items-start gap-3">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-background/70"
        style={
          color
            ? {
                borderColor: `${color}40`,
                backgroundColor: `${color}14`,
                boxShadow: `0 8px 24px ${color}18`,
              }
            : undefined
        }
      >
        {Icon ? (
          <Icon size={22} style={{ color }} aria-hidden />
        ) : (
          <Code2 className="h-5 w-5 text-primary" aria-hidden />
        )}
      </span>
      <div className="min-w-0">
        <h3 className="font-heading text-xl font-bold tracking-tight">{item.tag}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{item.layer}</p>
      </div>
    </div>
  );
}

function StackChip({
  item,
  isDark,
  selected,
  delay,
  onSelect,
}: {
  item: StackItem;
  isDark: boolean;
  selected: boolean;
  delay: number;
  onSelect: () => void;
}) {
  const color = item.skill ? (isDark ? item.skill.darkColor : item.skill.lightColor) : undefined;
  const Icon = item.skill?.icon as IconType | undefined;

  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          "group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          selected
            ? "border-primary/35 bg-primary/10 text-primary shadow-sm"
            : "border-border/80 bg-background/40 text-foreground hover:border-primary/25 hover:bg-primary/5",
        )}
        style={
          selected && color
            ? {
                borderColor: `${color}55`,
                backgroundColor: `${color}14`,
                color,
                boxShadow: `0 6px 18px ${color}18`,
              }
            : color && !selected
              ? { borderColor: `${color}28` }
              : undefined
        }
      >
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
            !color && "bg-primary/10",
          )}
          style={{ backgroundColor: color ? `${color}18` : undefined }}
        >
          {Icon ? (
            <Icon size={13} style={{ color: color ?? undefined }} aria-hidden />
          ) : (
            <Code2 className="h-3 w-3 text-primary" aria-hidden />
          )}
        </span>
        <span>{item.tag}</span>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
            selected ? "bg-background/70" : "bg-muted/70 text-muted-foreground",
          )}
        >
          {item.count}
        </span>
      </button>
    </motion.li>
  );
}
