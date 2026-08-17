"use client";

/**
 * GitHubGraph — stunning 12-month contribution heatmap
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  GitCommitHorizontal,
  Flame,
  TrendingUp,
  Loader2,
  CalendarDays,
  Zap,
  Maximize2,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { ContributionDay } from "@/lib/github-contributions";
import {
  type Day,
  type Week,
  MOBILE_WEEKS,
  fetchContributions,
  buildWeeksGrid,
  getRollingWindow,
  parseDateLocal,
  longestStreak,
  busiestDay,
  currentStreak,
  useIsMobile,
} from "./github-utils";
import {
  Tooltip,
  ContributionGrid,
  FullYearModal,
  StatPill,
  type TooltipState,
} from "./GitHubGraphParts";

interface GitHubGraphProps {
  /** Prefetched on the server (ISR) — skips client fetch when provided. */
  initialDays?: ContributionDay[];
}

// ── Main component ────────────────────────────────────────────────────────────

export function GitHubGraph({ initialDays = [] }: GitHubGraphProps) {
  const username = siteConfig.githubUsername;
  const isMobile = useIsMobile();
  const hasInitial = initialDays.length > 0;

  const [weeks, setWeeks] = useState<Week[]>(() => {
    if (!hasInitial) return [];
    return buildWeeksGrid(initialDays).weeks;
  });
  const [windowDays, setWindowDays] = useState<Day[]>(() => {
    if (!hasInitial) return [];
    return buildWeeksGrid(initialDays).windowDays;
  });
  const [status, setStatus] = useState<"loading" | "ok" | "error">(hasInitial ? "ok" : "loading");
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

  // ── Fetch (client fallback when server prefetch empty) ─────────────────────
  useEffect(() => {
    if (hasInitial || !username) {
      if (!username) setStatus("error");
      return;
    }
    fetchContributions(username)
      .then((days) => {
        const { weeks: w, windowDays: wd } = buildWeeksGrid(days);
        setWeeks(w);
        setWindowDays(wd);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [username, hasInitial]);

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
