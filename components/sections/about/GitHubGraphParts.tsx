"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  type Day,
  type Week,
  DAY_LABELS,
  SHOW_DAY_INDICES,
  CELL_CLASS,
  CELL_HOVER,
  getMonthLabels,
  AnimatedNumber,
} from "./github-utils";

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
        <span className="select-none text-[10px] font-medium text-muted-foreground/75">Less</span>
        <div className="flex items-center gap-1.5">
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <div key={level} className={`h-[10px] w-[10px] rounded-[2px] ${CELL_CLASS[level]}`} />
          ))}
        </div>
        <span className="select-none text-[10px] font-medium text-muted-foreground/75">More</span>
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

export type { TooltipState };
export { Tooltip, ContributionGrid, FullYearModal, StatPill };
