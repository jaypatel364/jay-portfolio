"use client";

import { useEffect, useState, useRef } from "react";
import { animate } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface Week {
  days: (Day | null)[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHOW_DAY_INDICES = [1, 3, 5]; // Mon, Wed, Fri
const MOBILE_BREAKPOINT = 640; // px — matches Tailwind's `sm`
const MOBILE_WEEKS = 16; // ~4 months shown by default on small screens

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchContributions(username: string): Promise<Day[]> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=2025&y=2026`,
  );
  if (!res.ok) throw new Error("fetch failed");
  const json = await res.json();
  return (json.contributions ?? []).map((d: { date: string; count: number; level: number }) => ({
    date: d.date,
    count: d.count,
    level: Math.min(4, d.level) as 0 | 1 | 2 | 3 | 4,
  }));
}

// ── Date helpers ──────────────────────────────────────────────────────────────

/** Format a local date as "YYYY-MM-DD" without any UTC conversion */
function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getRollingWindow(): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);
  // Align start to the Sunday of that week (local time)
  start.setDate(start.getDate() - start.getDay());
  return { start, end };
}

function buildWeeksGrid(days: Day[]): { weeks: Week[]; windowDays: Day[] } {
  const { start, end } = getRollingWindow();
  const byDate = new Map(days.map((d) => [d.date, d]));

  const weeks: Week[] = [];
  // Clone start so we don't mutate the original
  const cursor = new Date(start);

  while (cursor <= end) {
    const week: (Day | null)[] = [];
    for (let di = 0; di < 7; di++) {
      if (cursor > end) {
        // Pad remainder of the last week with nulls
        week.push(null);
      } else {
        // Always use local date string — never toISOString() which shifts to UTC
        const dateStr = localDateStr(cursor);
        week.push(byDate.get(dateStr) ?? { date: dateStr, count: 0, level: 0 });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push({ days: week });
  }

  // windowDays = real days in range for stats
  const windowDays: Day[] = [];
  for (const w of weeks) {
    for (const d of w.days) {
      if (d !== null) windowDays.push(d);
    }
  }

  return { weeks, windowDays };
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
  if (!days.length) return null;
  return days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);
}

function currentStreak(days: Day[]) {
  let cur = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) cur++;
    else break;
  }
  return cur;
}

// ── Month label positions ──────────────────────────────────────────────────────

/** Parse a "YYYY-MM-DD" string into parts without any UTC conversion */
function parseDateLocal(dateStr: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { year: y, month: m - 1, day: d }; // month is 0-indexed to match Date
}

/**
 * Build month labels aligned to week column indices.
 *
 * Rules:
 * 1. The very first column always gets the starting month label (wi=0).
 * 2. Every subsequent month label is placed at the week column that contains
 *    the 1st of that month — no sub-week fractional math (the grid is flex,
 *    not fixed-px, so fractional offsets don't map to real positions).
 * 3. Skip a label if it would be too close to the previous one (< 3 weeks gap)
 *    to avoid overlap on narrow screens.
 */
function getMonthLabels(weeks: Week[]): { label: string; wi: number }[] {
  if (!weeks.length) return [];

  const labels: { label: string; wi: number }[] = [];

  // Always label the first visible week with whatever month it starts in
  const firstDay = weeks[0].days.find((d) => d !== null);
  if (firstDay) {
    const { month } = parseDateLocal(firstDay.date);
    labels.push({ label: MONTHS[month], wi: 0 });
  }

  // Walk every week, look for the week that contains the 1st of a new month
  weeks.forEach((w, wi) => {
    if (wi === 0) return; // already handled above
    w.days.forEach((d) => {
      if (!d) return;
      const { month, day } = parseDateLocal(d.date);
      if (day !== 1) return;
      // Only add if this is a different month from the last label
      const last = labels[labels.length - 1];
      if (last && last.label === MONTHS[month]) return;
      // Skip if too close to previous label (prevents overlap)
      if (last && wi - last.wi < 3) return;
      labels.push({ label: MONTHS[month], wi });
    });
  });

  return labels;
}

// ── Animated counter ──────────────────────────────────────────────────────────

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevRef.current = value;
    return () => controls.stop();
  }, [value]);

  return <span className={className}>{display.toLocaleString()}</span>;
}

// ── Responsive helper ────────────────────────────────────────────────────────

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

// ── Cell colour ───────────────────────────────────────────────────────────────

// Uses Tailwind opacity variants on --primary so it respects the accent colour.
const CELL_CLASS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-muted/50 dark:bg-white/5",
  1: "bg-primary/15",
  2: "bg-primary/35",
  3: "bg-primary/65",
  4: "bg-primary shadow-[0_0_6px_var(--primary-glow,oklch(from_var(--primary)_l_c_h/0.6))]",
};

const CELL_HOVER: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "hover:bg-muted/80 dark:hover:bg-white/10",
  1: "hover:bg-primary/30",
  2: "hover:bg-primary/55",
  3: "hover:bg-primary/80",
  4: "hover:bg-primary/90",
};

export type { Day, Week };
export {
  MONTHS,
  DAY_LABELS,
  SHOW_DAY_INDICES,
  MOBILE_BREAKPOINT,
  MOBILE_WEEKS,
  fetchContributions,
  localDateStr,
  getRollingWindow,
  buildWeeksGrid,
  longestStreak,
  busiestDay,
  currentStreak,
  parseDateLocal,
  getMonthLabels,
  AnimatedNumber,
  useIsMobile,
  CELL_CLASS,
  CELL_HOVER,
};
