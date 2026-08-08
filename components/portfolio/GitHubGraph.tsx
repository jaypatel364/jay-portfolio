"use client";

/**
 * GitHubGraph — stunning 12-month contribution heatmap
 * ─────────────────────────────────────────────────────
 * • Shows exactly 52 weeks (Aug 2025 → Aug 2026) on desktop — no horizontal scroll ever
 * • On mobile, shows a compact recent window (last ~16 weeks) — still no horizontal scroll
 * • Mobile users can tap "View full year" to open the complete grid in a scrollable modal
 * • Cells auto-size to fill 100% of the container width
 * • Gradient cells that use the site accent colour
 * • Stats bar with animated counters
 * • Column-by-column reveal on scroll
 * • Portal tooltip that never gets clipped
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, animate, AnimatePresence } from "framer-motion";
import {
  GitCommitHorizontal,
  Flame,
  TrendingUp,
  Loader2,
  CalendarDays,
  Zap,
  X,
  Maximize2,
} from "lucide-react";
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

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipState {
  text: string;
  x: number;
  y: number;
}

function Tooltip({ t }: { t: TooltipState }) {
  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full"
      style={{ left: t.x, top: t.y - 8 }}
    >
      <div className="relative rounded-lg border border-border/60 bg-popover/95 px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-sm">
        {t.text}
        {/* caret */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-border/60" />
        <div className="absolute left-1/2 top-full -translate-x-1/2 mt-px border-[4px] border-transparent border-t-popover/95" />
      </div>
    </div>,
    document.body,
  );
}

// ── Shared grid renderer (used by both inline view and full-year modal) ───────

function ContributionGrid({
  weeks,
  cellSize,
  inView,
  onCellHover,
  onCellLeave,
  scrollable = false,
}: {
  weeks: Week[];
  cellSize: number;
  inView: boolean;
  onCellHover: (e: React.MouseEvent, day: Day) => void;
  onCellLeave: () => void;
  scrollable?: boolean;
}) {
  const GAP = 3;
  const STEP = cellSize + GAP;
  const monthLabels = getMonthLabels(weeks);

  return (
    <div key={cellSize} className="w-full">
      {/* Month labels row */}
      <div
        className={scrollable ? "relative mb-2 h-4" : "relative mb-2 h-4"}
        style={{
          marginLeft: 36,
          width: scrollable ? weeks.length * STEP : undefined,
        }}
      >
        {monthLabels.map(({ label, wi }) => (
          <span
            key={`${label}-${wi}`}
            className="absolute select-none text-[10px] font-semibold tracking-wide text-muted-foreground/70"
            style={{
              left: scrollable ? wi * STEP : `${(wi / weeks.length) * 100}%`,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Day labels + cells */}
      <div className={scrollable ? "flex w-full items-start pb-2" : "flex w-full items-start"}>
        {/* Day-of-week labels */}
        <div className="mr-2 shrink-0 left-0 bg-card" style={{ width: 28 }}>
          {DAY_LABELS.map((d, i) => (
            <div
              key={i}
              className="flex items-center text-[9px] font-medium text-muted-foreground/50"
              style={{ height: STEP }}
            >
              {SHOW_DAY_INDICES.includes(i) ? d : ""}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          className={
            scrollable
              ? "flex gap-[3px] py-1 shrink-0"
              : "flex flex-1 gap-[3px] overflow-visible py-1"
          }
          style={scrollable ? { width: weeks.length * STEP - GAP } : undefined}
        >
          {weeks.map((week, wi) => (
            <div
              key={wi}
              className={scrollable ? "flex flex-col gap-[3px]" : "flex flex-1 flex-col gap-[3px]"}
              style={scrollable ? { width: cellSize } : undefined}
            >
              {week.days.map((day, di) => {
                if (day === null) {
                  return (
                    <div
                      key={di}
                      style={{ height: cellSize, borderRadius: Math.max(2, cellSize * 0.22) }}
                    />
                  );
                }

                return (
                  <motion.div
                    key={di}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.22,
                      delay: inView ? wi * 0.009 + di * 0.003 : 0,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    style={{
                      height: cellSize,
                      borderRadius: Math.max(2, cellSize * 0.22),
                    }}
                    className={[
                      "w-full cursor-default transition-all duration-150",
                      CELL_CLASS[day.level],
                      CELL_HOVER[day.level],
                      "hover:scale-[1.4] hover:z-10 hover:ring-2 hover:ring-primary/50",
                    ].join(" ")}
                    onMouseEnter={(e) => onCellHover(e, day)}
                    onMouseLeave={onCellLeave}
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
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="select-none text-[10px] font-medium text-muted-foreground/60">Less</span>
        <div className="flex items-center gap-1.5">
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <div key={level} className={`h-[10px] w-[10px] rounded-[2px] ${CELL_CLASS[level]}`} />
          ))}
        </div>
        <span className="select-none text-[10px] font-medium text-muted-foreground/60">More</span>
      </div>
    </div>
  );
}

// ── Full-year modal (mobile only) ──────────────────────────────────────────────

function FullYearModal({
  weeks,
  onClose,
  onCellHover,
  onCellLeave,
}: {
  weeks: Week[];
  onClose: () => void;
  onCellHover: (e: React.MouseEvent, day: Day) => void;
  onCellLeave: () => void;
}) {
  // Fixed cell size in the modal since it scrolls — no need to shrink to fit
  const MODAL_CELL_SIZE = 11;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-end bg-black/60 backdrop-blur-sm sm:items-center sm:justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-h-[85vh] w-full overflow-hidden rounded-t-2xl border border-border/60 bg-card shadow-2xl sm:max-w-lg sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
            <p className="text-sm font-bold text-foreground">Full year activity</p>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto px-5 py-5">
            <ContributionGrid
              weeks={weeks}
              cellSize={MODAL_CELL_SIZE}
              inView={true}
              onCellHover={onCellHover}
              onCellLeave={onCellLeave}
              scrollable
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function GitHubGraph() {
  const username = siteConfig.githubUsername;
  const isMobile = useIsMobile();

  const [weeks, setWeeks] = useState<Week[]>([]);
  const [windowDays, setWindowDays] = useState<Day[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [inView, setInView] = useState(false);
  const [cellSize, setCellSize] = useState(13); // px — recalculated on mount/resize
  const [showFullYear, setShowFullYear] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const graphAreaRef = useRef<HTMLDivElement>(null);

  // ── Intersection observer ─────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // The grid actually rendered inline — sliced to a recent window on mobile
  const visibleWeeks = isMobile ? weeks.slice(-MOBILE_WEEKS) : weeks;

  // ── Responsive cell size ─────────────────────────────────────────────────
  const recalcSize = useCallback(() => {
    if (!graphAreaRef.current || !visibleWeeks.length) return;
    const available = graphAreaRef.current.clientWidth - 36; // minus day-label col
    const numWeeks = visibleWeeks.length;
    // cell + gap = step; gap = 3px always; fit as many as possible without overflow
    // available = numWeeks * (cell + 3) - 3
    const size = Math.floor((available + 3) / numWeeks) - 3;
    setCellSize(Math.max(9, Math.min(16, size)));
  }, [visibleWeeks.length]);

  useEffect(() => {
    recalcSize();
    const obs = new ResizeObserver(recalcSize);
    if (graphAreaRef.current) obs.observe(graphAreaRef.current);
    return () => obs.disconnect();
  }, [recalcSize]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!username) {
      setStatus("error");
      return;
    }
    fetchContributions(username)
      .then((days) => {
        const { weeks: w, windowDays: wd } = buildWeeksGrid(days);
        setWeeks(w);
        setWindowDays(wd); // stats always computed over the FULL year, not the mobile slice
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [username]);

  if (!username || status === "error") return null;

  // ── Stats (always full-year, regardless of what's visible inline) ─────────
  const total = windowDays.reduce((s, d) => s + d.count, 0);
  const streak = longestStreak(windowDays);
  const curStreak = currentStreak(windowDays);
  const busiest = busiestDay(windowDays);

  // ── Rolling window label ─────────────────────────────────────────────────
  const { start, end } = getRollingWindow();
  const windowLabel = `${start.toLocaleDateString("en-US", { month: "short", year: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;

  const handleCellHover = (e: React.MouseEvent, day: Day) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const { year, month, day: dayNum } = parseDateLocal(day.date);
    const localDate = new Date(year, month, dayNum);
    setTooltip({
      text: `${day.count} contribution${day.count !== 1 ? "s" : ""} · ${localDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}`,
      x: r.left + r.width / 2,
      y: r.top,
    });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-14 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg"
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 px-6 py-4">
        {/* Left: icon + title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <GitCommitHorizontal className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-foreground">GitHub Activity</p>
            <div className="flex items-center gap-1.5">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                @{username}
              </a>
              <span className="text-[10px] text-muted-foreground/40">·</span>
              <span className="text-[10px] text-muted-foreground/60">
                {isMobile ? `Last ${MOBILE_WEEKS} weeks` : windowLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Right: stats pills */}
        {status === "ok" && (
          <div className="flex flex-wrap items-center gap-2">
            <StatPill
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              value={total}
              label="contributions"
              colorClass="text-primary border-primary/25 bg-primary/8"
            />
            <StatPill
              icon={<Flame className="h-3.5 w-3.5" />}
              value={streak}
              label="day best streak"
              colorClass="text-orange-500 border-orange-500/25 bg-orange-500/8"
            />
            {curStreak > 0 && (
              <StatPill
                icon={<Zap className="h-3.5 w-3.5" />}
                value={curStreak}
                label="day current streak"
                colorClass="text-yellow-500 border-yellow-500/25 bg-yellow-500/8"
              />
            )}
            {busiest && busiest.count > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-3 py-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-500">
                  Peak {busiest.count} ·{" "}
                  {(() => {
                    const { year, month, day: d } = parseDateLocal(busiest.date);
                    return new Date(year, month, d).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  })()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Graph body ── */}
      {/* pb-8 gives breathing room so the last row's hover:scale-[1.4] isn't clipped */}
      <div className="px-5 pb-8 pt-5" ref={graphAreaRef}>
        {status === "loading" && (
          <div className="flex h-40 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <Loader2 className="relative h-6 w-6 animate-spin text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Loading activity…</p>
            </div>
          </div>
        )}

        {status === "ok" && visibleWeeks.length > 0 && (
          <>
            <ContributionGrid
              weeks={visibleWeeks}
              cellSize={cellSize}
              inView={inView}
              onCellHover={handleCellHover}
              onCellLeave={() => setTooltip(null)}
            />

            {/* Mobile-only: link to open the full year in a modal */}
            {isMobile && (
              <button
                onClick={() => setShowFullYear(true)}
                className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary transition-opacity hover:opacity-80"
              >
                <Maximize2 className="h-3 w-3" />
                View full year
              </button>
            )}
          </>
        )}
      </div>

      {/* Portal tooltip */}
      {tooltip && typeof document !== "undefined" && <Tooltip t={tooltip} />}

      {/* Full-year modal (mobile only) */}
      {showFullYear && (
        <FullYearModal
          weeks={weeks}
          onClose={() => setShowFullYear(false)}
          onCellHover={handleCellHover}
          onCellLeave={() => setTooltip(null)}
        />
      )}
    </motion.div>
  );
}

// ── Stat pill sub-component ───────────────────────────────────────────────────

function StatPill({
  icon,
  value,
  label,
  colorClass,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  colorClass: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${colorClass}`}>
      {icon}
      <span className="text-xs font-semibold">
        <AnimatedNumber value={value} /> {label}
      </span>
    </div>
  );
}
