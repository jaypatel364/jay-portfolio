"use client";

/**
 * GitHubGraph — premium contribution heatmap
 * -------------------------------------------
 * • Bigger rounded cells with smooth CSS-variable-aware accent colours
 * • Cells animate in column-by-column on scroll
 * • Stats bar: total, longest streak, busiest day
 * • Tooltip via Portal so it never gets clipped
 * • Fetches from public proxy — no GitHub token required
 */

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { GitCommitHorizontal, Flame, TrendingUp, Loader2, CalendarDays } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// ── Types ────────────────────────────────────────────────────────────────────

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface Week {
  days: Day[];
}

// ── Fetch ────────────────────────────────────────────────────────────────────

async function fetchContributions(username: string): Promise<Day[]> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
  if (!res.ok) throw new Error("fetch failed");
  const json = await res.json();
  return (json.contributions ?? []).map((d: { date: string; count: number; level: number }) => ({
    date: d.date,
    count: d.count,
    level: Math.min(4, d.level) as 0 | 1 | 2 | 3 | 4,
  }));
}

function groupIntoWeeks(days: Day[]): Week[] {
  const weeks: Week[] = [];
  let week: Day[] = [];
  days.forEach((day, i) => {
    week.push(day);
    const dow = new Date(day.date).getDay();
    if (dow === 6 || i === days.length - 1) {
      weeks.push({ days: [...week] });
      week = [];
    }
  });
  return weeks;
}

// ── Stats helpers ─────────────────────────────────────────────────────────────

function longestStreak(days: Day[]) {
  let best = 0,
    cur = 0;
  for (const d of days) {
    if (d.count > 0) {
      cur++;
      best = Math.max(best, cur);
    } else cur = 0;
  }
  return best;
}

function busiestDay(days: Day[]) {
  return days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);
}

// ── Colour levels (CSS-var-aware) ─────────────────────────────────────────────

const LEVEL_STYLE: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-muted/60",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/65",
  4: "bg-primary",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipState {
  text: string;
  x: number;
  y: number;
}

function Tooltip({ t }: { t: TooltipState }) {
  return createPortal(
    <div
      className="pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-lg"
      style={{ left: t.x, top: t.y - 6 }}
    >
      {t.text}
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-border"
        style={{ marginTop: -1 }}
      />
      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-popover" />
    </div>,
    document.body,
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function GitHubGraph() {
  const username = siteConfig.githubUsername;
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [allDays, setAllDays] = useState<Day[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [inView, setInView] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Intersection observer — trigger cell animation when scrolled into view
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!username) {
      setStatus("error");
      return;
    }
    fetchContributions(username)
      .then((days) => {
        setAllDays(days);
        setWeeks(groupIntoWeeks(days));
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [username]);

  if (!username || status === "error") return null;

  const total = allDays.reduce((s, d) => s + d.count, 0);
  const streak = status === "ok" ? longestStreak(allDays) : 0;
  const busiest = status === "ok" && allDays.length ? busiestDay(allDays) : null;

  // Month labels
  const monthLabels: { label: string; wi: number }[] = [];
  weeks.forEach((w, wi) => {
    if (!w.days[0]) return;
    const d = new Date(w.days[0].date);
    if (d.getDate() <= 7) {
      const lbl = MONTHS[d.getMonth()];
      if (!monthLabels.length || monthLabels[monthLabels.length - 1].label !== lbl)
        monthLabels.push({ label: lbl, wi });
    }
  });

  const CELL = 14,
    GAP = 3,
    STEP = CELL + GAP;

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="mt-14 overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <GitCommitHorizontal className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">GitHub Activity</p>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              @{username}
            </a>
          </div>
        </div>

        {status === "ok" && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Total */}
            <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {total.toLocaleString()} contributions
              </span>
            </div>
            {/* Streak */}
            <div className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 px-3 py-1.5">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-xs font-semibold text-orange-500">{streak} day streak</span>
            </div>
            {/* Busiest */}
            {busiest && busiest.count > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-500">
                  Peak: {busiest.count} on{" "}
                  {new Date(busiest.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Graph body ── */}
      <div className="px-6 py-5">
        {status === "loading" && (
          <div className="flex h-36 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Loading activity…</p>
            </div>
          </div>
        )}

        {status === "ok" && weeks.length > 0 && (
          <div className="overflow-x-auto">
            <div style={{ minWidth: weeks.length * STEP + 32 }}>
              {/* Month labels */}
              <div className="relative mb-2 h-4" style={{ marginLeft: 32 }}>
                {monthLabels.map(({ label, wi }) => (
                  <span
                    key={`${label}-${wi}`}
                    className="absolute text-[10px] font-medium text-muted-foreground"
                    style={{ left: wi * STEP }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex gap-0">
                {/* Day labels */}
                <div className="mr-2 flex flex-col" style={{ width: 28 }}>
                  {DAYS.map((d, i) => (
                    <div
                      key={i}
                      className="text-[9px] font-medium text-muted-foreground/50"
                      style={{ height: STEP, lineHeight: `${CELL}px`, marginBottom: i < 6 ? 0 : 0 }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Cells */}
                <div className="flex gap-[3px]">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {Array.from({ length: 7 }).map((_, di) => {
                        const day = week.days.find((d) => new Date(d.date).getDay() === di);
                        if (!day) return <div key={di} style={{ width: CELL, height: CELL }} />;

                        return (
                          <motion.div
                            key={di}
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{
                              duration: 0.25,
                              delay: inView ? wi * 0.012 + di * 0.004 : 0,
                              ease: "backOut",
                            }}
                            style={{ width: CELL, height: CELL }}
                            className={`rounded-[3px] ${LEVEL_STYLE[day.level]} cursor-default ring-0 transition-all duration-150 hover:scale-[1.35] hover:ring-2 hover:ring-primary/40 hover:brightness-110`}
                            onMouseEnter={(e) => {
                              const r = (e.target as HTMLElement).getBoundingClientRect();
                              setTooltip({
                                text: `${day.count} contribution${day.count !== 1 ? "s" : ""} · ${new Date(day.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}`,
                                x: r.left + r.width / 2,
                                y: r.top,
                              });
                            }}
                            onMouseLeave={() => setTooltip(null)}
                            role="img"
                            aria-label={`${day.count} contributions on ${day.date}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-end gap-1.5">
                <span className="text-[10px] text-muted-foreground">Less</span>
                {([0, 1, 2, 3, 4] as const).map((level) => (
                  <div
                    key={level}
                    className={`h-[10px] w-[10px] rounded-[2px] ${LEVEL_STYLE[level]}`}
                  />
                ))}
                <span className="text-[10px] text-muted-foreground">More</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Portal tooltip */}
      {tooltip && typeof document !== "undefined" && <Tooltip t={tooltip} />}
    </motion.div>
  );
}
