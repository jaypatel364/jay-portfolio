"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  type Day,
  type Week,
  DAY_LABELS,
  SHOW_DAY_INDICES,
  CELL_CLASS,
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

/** Resolve CSS color tokens for canvas fill (avoids ~350 cell DOM nodes). */
function resolveCellColors(el: HTMLElement): Record<0 | 1 | 2 | 3 | 4, string> {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  el.appendChild(probe);

  const levels = [0, 1, 2, 3, 4] as const;
  const colors = {} as Record<0 | 1 | 2 | 3 | 4, string>;
  for (const level of levels) {
    probe.className = CELL_CLASS[level];
    colors[level] = getComputedStyle(probe).backgroundColor || "transparent";
  }
  el.removeChild(probe);
  return colors;
}

// ── Shared grid renderer (canvas — keeps DOM width under SEO tool limits) ─────

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const colorsRef = useRef<Record<0 | 1 | 2 | 3 | 4, string> | null>(null);
  const hoverRef = useRef<{ wi: number; di: number } | null>(null);

  const gridWidth = weeks.length * STEP - GAP;
  const gridHeight = 7 * STEP - GAP;

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !weeks.length) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(gridWidth * dpr));
    canvas.height = Math.max(1, Math.floor(gridHeight * dpr));
    canvas.style.width = `${gridWidth}px`;
    canvas.style.height = `${gridHeight}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, gridWidth, gridHeight);

    if (!colorsRef.current) {
      colorsRef.current = resolveCellColors(wrap);
    }
    const colors = colorsRef.current;
    const radius = Math.max(2, cellSize * 0.22);
    const hover = hoverRef.current;

    weeks.forEach((week, wi) => {
      week.days.forEach((day, di) => {
        if (day === null) return;
        const x = wi * STEP;
        const y = di * STEP;
        const isHover = hover?.wi === wi && hover?.di === di;

        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, cellSize, cellSize, radius);
        } else {
          ctx.rect(x, y, cellSize, cellSize);
        }
        ctx.fillStyle = colors[day.level];
        ctx.globalAlpha = inView ? (isHover ? 1 : 0.92) : 0.35;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (isHover) {
          ctx.strokeStyle = colors[4];
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.55;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    });
  }, [weeks, cellSize, gridWidth, gridHeight, STEP, inView]);

  useEffect(() => {
    colorsRef.current = null;
    paint();
  }, [paint]);

  // Re-resolve colors when theme/accent class changes on <html>
  useEffect(() => {
    const root = document.documentElement;
    const obs = new MutationObserver(() => {
      colorsRef.current = null;
      paint();
    });
    obs.observe(root, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    return () => obs.disconnect();
  }, [paint]);

  const hitTest = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const wi = Math.floor(x / STEP);
    const di = Math.floor(y / STEP);
    if (wi < 0 || wi >= weeks.length || di < 0 || di >= 7) return null;
    const day = weeks[wi]?.days[di];
    if (!day) return null;
    return { wi, di, day };
  };

  return (
    <div key={cellSize} className="w-full" ref={wrapRef}>
      {/* Month labels row */}
      <div
        className="relative mb-2 h-4"
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

      {/* Day labels + canvas grid */}
      <div className={scrollable ? "flex w-full items-start pb-2" : "flex w-full items-start"}>
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

        <div
          className={scrollable ? "shrink-0 py-1" : "min-w-0 flex-1 overflow-x-auto py-1"}
          style={scrollable ? { width: gridWidth } : undefined}
        >
          <canvas
            ref={canvasRef}
            className="block cursor-default"
            role="img"
            aria-label="GitHub contribution activity over the past year"
            onMouseMove={(e) => {
              const hit = hitTest(e);
              if (!hit) {
                if (hoverRef.current) {
                  hoverRef.current = null;
                  paint();
                }
                onCellLeave();
                return;
              }
              const prev = hoverRef.current;
              if (!prev || prev.wi !== hit.wi || prev.di !== hit.di) {
                hoverRef.current = { wi: hit.wi, di: hit.di };
                paint();
              }
              onCellHover(e, hit.day);
            }}
            onMouseLeave={() => {
              hoverRef.current = null;
              paint();
              onCellLeave();
            }}
          />
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
