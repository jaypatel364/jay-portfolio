"use client";

/**
 * PixelDrawRace — recreate pixel art against the clock
 * ──────────────────────────────────────────────────────
 * • A target 8×8 pixel art silhouette appears
 * • You have 20 seconds to recreate it by clicking cells
 * • At the end: match % calculated, star rating shown
 * • 6 targets: rocket, heart, smiley, star, lightning, skull
 * • Best match % in localStorage
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, ArrowRight, Mail, Brush } from "lucide-react";
import { cn } from "@/lib/utils";

const LS_KEY = "pixeldraw_best";
const GRID = 8;
const DRAW_TIME = 20;

// ── Pixel targets (8×8, 1 = filled, 0 = empty) ───────────────────────────────

const TARGETS: Array<{ name: string; emoji: string; grid: number[] }> = [
  {
    name: "Rocket",
    emoji: "🚀",
    grid: [
      0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
      0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ],
  },
  {
    name: "Heart",
    emoji: "❤️",
    grid: [
      0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ],
  },
  {
    name: "Smiley",
    emoji: "😊",
    grid: [
      0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1,
      0, 0,
    ],
  },
  {
    name: "Star",
    emoji: "⭐",
    grid: [
      0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
      0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
      0, 0,
    ],
  },
  {
    name: "Lightning",
    emoji: "⚡",
    grid: [
      0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0,
      0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ],
  },
  {
    name: "Diamond",
    emoji: "💎",
    grid: [
      0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcMatch(drawn: boolean[], target: number[]): number {
  let correct = 0;
  for (let i = 0; i < GRID * GRID; i++) {
    if ((drawn[i] ? 1 : 0) === target[i]) correct++;
  }
  return Math.round((correct / (GRID * GRID)) * 100);
}

function starRating(pct: number) {
  if (pct >= 90) return 3;
  if (pct >= 70) return 2;
  if (pct >= 50) return 1;
  return 0;
}

type Phase = "idle" | "playing" | "done";

// ── Component ─────────────────────────────────────────────────────────────────

export function PixelDrawRace({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetIdx, setTargetIdx] = useState(0);
  const [drawn, setDrawn] = useState<boolean[]>(Array(GRID * GRID).fill(false));
  const [timeLeft, setTimeLeft] = useState(DRAW_TIME);
  const [matchPct, setMatchPct] = useState(0);
  const [best, setBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [isPainting, setIsPainting] = useState(false);
  const [paintMode, setPaintMode] = useState<"fill" | "erase">("fill");

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const target = TARGETS[targetIdx];

  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      if (v) setBest(parseInt(v, 10));
    } catch {
      /**/
    }
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const endGame = useCallback(
    (currentDrawn: boolean[]) => {
      clearInterval(timerRef.current);
      const pct = calcMatch(currentDrawn, target.grid);
      setMatchPct(pct);
      setBest((prev) => {
        if (pct > prev) {
          setNewRecord(true);
          try {
            localStorage.setItem(LS_KEY, String(pct));
          } catch {
            /**/
          }
          return pct;
        }
        return prev;
      });
      setPhase("done");
    },
    [target.grid],
  );

  const startGame = useCallback(
    (idx?: number) => {
      clearInterval(timerRef.current);
      const i = idx ?? targetIdx;
      setTargetIdx(i);
      const blank = Array(GRID * GRID).fill(false);
      setDrawn(blank);
      setTimeLeft(DRAW_TIME);
      setMatchPct(0);
      setNewRecord(false);
      setPhase("playing");

      let remaining = DRAW_TIME;
      timerRef.current = setInterval(() => {
        remaining--;
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setDrawn((d) => {
            endGame(d);
            return d;
          });
        }
      }, 1000);
    },
    [targetIdx, endGame],
  );

  const paintCell = useCallback(
    (idx: number, forceMode?: "fill" | "erase") => {
      if (phase !== "playing") return;
      const mode = forceMode ?? paintMode;
      setDrawn((prev) => {
        const next = [...prev];
        next[idx] = mode === "fill";
        return next;
      });
    },
    [phase, paintMode],
  );

  const handleCellDown = (i: number) => {
    if (phase !== "playing") return;
    const mode: "fill" | "erase" = drawn[i] ? "erase" : "fill";
    setPaintMode(mode);
    setIsPainting(true);
    paintCell(i, mode);
  };

  useEffect(() => {
    const up = () => setIsPainting(false);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const stars = starRating(matchPct);
  const pct = timeLeft / DRAW_TIME;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999999] isolate overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-background/85 backdrop-blur-lg"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div className="relative flex h-full items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-background shadow-premium"
        >
          <div className="h-[3px] w-full gradient-primary" />

          {/* header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-card/80 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <Brush className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Pixel Draw Race</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {phase === "playing"
                    ? `Draw: ${target.name} · ${timeLeft}s`
                    : "Recreate the pixel art"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {best > 0 && (
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground/60">Best</p>
                  <p className="text-sm font-black tabular-nums gradient-text">{best}%</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* timer bar */}
          {phase === "playing" && (
            <div className="h-1.5 w-full bg-muted/30">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${pct * 100}%`,
                  background: pct > 0.5 ? "var(--primary)" : pct > 0.25 ? "#f59e0b" : "#ef4444",
                }}
              />
            </div>
          )}

          <div className="p-4 sm:p-5">
            <AnimatePresence mode="wait">
              {/* idle */}
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-4 text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl"
                  >
                    🎨
                  </motion.div>
                  <p className="text-lg font-black text-foreground">Pixel Draw Race</p>
                  <p className="text-sm text-muted-foreground max-w-[260px]">
                    A pixel art silhouette appears on the left. Recreate it on the right before the
                    timer runs out. Match % scores you.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {TARGETS.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setTargetIdx(i)}
                        className={cn(
                          "rounded-xl border px-3 py-1.5 text-[13px] transition-all",
                          i === targetIdx
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-border/30 bg-card/50 text-muted-foreground hover:border-primary/30",
                        )}
                      >
                        {t.emoji} {t.name}
                      </button>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startGame(targetIdx)}
                    className="btn-shine mt-1 flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
                  >
                    Start Drawing
                  </motion.button>
                </motion.div>
              )}

              {/* playing */}
              {phase === "playing" && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-start justify-center gap-4">
                    {/* target */}
                    <div className="flex flex-col items-center gap-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        Target
                      </p>
                      <div
                        className="grid grid-cols-8 gap-0.5 rounded-xl border border-border/40 bg-muted/20 p-2"
                        style={{ userSelect: "none" }}
                      >
                        {target.grid.map((cell, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-6 w-6 rounded-sm transition-colors",
                              cell === 1 ? "bg-primary" : "bg-muted/20",
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* canvas */}
                    <div className="flex flex-col items-center gap-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        Your Drawing
                      </p>
                      <div
                        className="grid grid-cols-8 gap-0.5 rounded-xl border border-border/40 bg-muted/20 p-2 cursor-crosshair"
                        style={{ userSelect: "none", touchAction: "none" }}
                        onMouseLeave={() => setIsPainting(false)}
                      >
                        {drawn.map((cell, i) => (
                          <div
                            key={i}
                            onMouseDown={() => handleCellDown(i)}
                            onMouseEnter={() => isPainting && paintCell(i)}
                            onTouchStart={(e) => {
                              e.preventDefault();
                              handleCellDown(i);
                            }}
                            className={cn(
                              "h-6 w-6 rounded-sm transition-colors duration-75 cursor-crosshair hover:opacity-80",
                              cell ? "bg-primary shadow-sm" : "bg-muted/20 hover:bg-primary/25",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* clear btn */}
                  <button
                    onClick={() => setDrawn(Array(GRID * GRID).fill(false))}
                    className="mx-auto flex items-center gap-1.5 rounded-lg border border-border/30 bg-muted/20 px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear canvas
                  </button>
                </motion.div>
              )}

              {/* done */}
              {phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-2 text-center"
                >
                  {/* grids side by side */}
                  <div className="flex items-start justify-center gap-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        Target
                      </p>
                      <div className="grid grid-cols-8 gap-0.5 rounded-xl border border-border/40 bg-muted/20 p-2">
                        {target.grid.map((cell, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-5 w-5 rounded-sm",
                              cell === 1 ? "bg-primary" : "bg-muted/20",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        Yours
                      </p>
                      <div className="grid grid-cols-8 gap-0.5 rounded-xl border border-border/40 bg-muted/20 p-2">
                        {drawn.map((cell, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-5 w-5 rounded-sm",
                              cell && target.grid[i] === 1
                                ? "bg-emerald-500"
                                : cell && target.grid[i] === 0
                                  ? "bg-red-400/70"
                                  : !cell && target.grid[i] === 1
                                    ? "bg-primary/20"
                                    : "bg-muted/20",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* score */}
                  <div>
                    <p className="text-3xl font-black gradient-text">{matchPct}%</p>
                    <p className="text-sm text-muted-foreground">match accuracy</p>
                    <div className="mt-1.5 flex justify-center gap-1">
                      {[0, 1, 2].map((s) => (
                        <span
                          key={s}
                          className={cn("text-xl", s < stars ? "opacity-100" : "opacity-20")}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  {newRecord && (
                    <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                      <Trophy className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary">
                        New best: {matchPct}%!
                      </span>
                    </div>
                  )}

                  <div className="flex w-full flex-col gap-2 mt-1">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => startGame(targetIdx)}
                        className="btn-shine flex flex-1 items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Retry
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setPhase("idle");
                        }}
                        className="flex flex-1 items-center justify-center rounded-xl border border-border/50 bg-card/60 py-3 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-all"
                      >
                        New target
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        setTimeout(
                          () =>
                            document
                              .getElementById("contact")
                              ?.scrollIntoView({ behavior: "smooth" }),
                          300,
                        );
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/60 py-2.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-all"
                    >
                      <Mail className="h-3.5 w-3.5" /> Hire Jay <ArrowRight className="h-3 w-3" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
