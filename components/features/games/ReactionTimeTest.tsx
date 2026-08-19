"use client";

/**
 * ReactionTimeTest — click the flash as fast as you can
 * ─────────────────────────────────────────────────────
 * • Screen goes dark → wait a random 1-4s delay → FLASH green
 * • Click/tap as fast as possible → shows reaction time in ms
 * • 5 rounds, running average shown throughout
 * • Rankings: Ninja (<150ms), Pro (<200ms), Human (<300ms),
 *             Casual (<400ms), Sloth (400ms+)
 * • Best average persisted in localStorage
 * • Early clicks (before flash) = penalty round
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Trophy, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const LS_KEY = "reaction_best_avg";
const ROUNDS = 5;
const MIN_DELAY = 1200;
const MAX_DELAY = 4000;

type Phase = "idle" | "waiting" | "ready" | "result" | "done" | "tooearly";

interface RankInfo {
  label: string;
  color: string;
  emoji: string;
}
function getRank(ms: number): RankInfo {
  if (ms < 150) return { label: "Ninja", color: "text-violet-500", emoji: "🥷" };
  if (ms < 200) return { label: "Pro", color: "text-emerald-500", emoji: "⚡" };
  if (ms < 300) return { label: "Human", color: "text-sky-500", emoji: "😎" };
  if (ms < 400) return { label: "Casual", color: "text-amber-500", emoji: "🙂" };
  return { label: "Sloth", color: "text-orange-500", emoji: "🦥" };
}

export function ReactionTimeTest({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [bestAvg, setBestAvg] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);

  const flashStart = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      if (v) setBestAvg(parseFloat(v));
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

  const startRound = useCallback(() => {
    setPhase("waiting");
    setLastTime(null);
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    timerRef.current = setTimeout(() => {
      flashStart.current = Date.now();
      setPhase("ready");
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === "idle" || phase === "done") return;

    if (phase === "waiting") {
      clearTimeout(timerRef.current);
      setPhase("tooearly");
      return;
    }

    if (phase === "tooearly") {
      startRound();
      return;
    }

    if (phase === "ready") {
      const ms = Date.now() - flashStart.current;
      const newTimes = [...times, ms];
      setLastTime(ms);
      setTimes(newTimes);

      if (newTimes.length >= ROUNDS) {
        const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
        setBestAvg((prev) => {
          if (prev === null || avg < prev) {
            setNewRecord(true);
            try {
              localStorage.setItem(LS_KEY, String(avg));
            } catch {
              /**/
            }
            return avg;
          }
          return prev;
        });
        setPhase("done");
      } else {
        setRound((r) => r + 1);
        setPhase("result");
      }
    }

    if (phase === "result") {
      startRound();
    }
  }, [phase, times, startRound]);

  const reset = useCallback(() => {
    clearTimeout(timerRef.current);
    setPhase("idle");
    setRound(0);
    setTimes([]);
    setLastTime(null);
    setNewRecord(false);
  }, []);

  const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
  const rank = avg ? getRank(avg) : null;

  // bg colour per phase
  const bgColor =
    phase === "waiting"
      ? "bg-card"
      : phase === "ready"
        ? "bg-emerald-500"
        : phase === "tooearly"
          ? "bg-red-500"
          : "bg-card";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999999] overflow-y-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-background shadow-premium"
        >
          <div className="h-[3px] w-full gradient-primary" />

          {/* header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-card/80 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <Timer className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Reaction Time Test</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Round {Math.min(round + 1, ROUNDS)} of {ROUNDS}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {avg !== null && (
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground/60">Avg</p>
                  <p className="text-sm font-black tabular-nums gradient-text">{avg}ms</p>
                </div>
              )}
              {bestAvg !== null && (
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground/60">Best</p>
                  <p className="text-sm font-black tabular-nums text-foreground">
                    {Math.round(bestAvg)}ms
                  </p>
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

          {/* arena */}
          <div
            onClick={handleClick}
            className={cn(
              "relative flex h-72 w-full cursor-pointer flex-col items-center justify-center gap-4 transition-colors duration-150 select-none",
              bgColor,
            )}
          >
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 text-center px-6"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow"
                  >
                    <Zap className="h-8 w-8 text-primary-foreground" />
                  </motion.div>
                  <p className="text-lg font-black text-foreground">Test your reflexes</p>
                  <p className="text-sm text-muted-foreground">
                    Wait for the green flash, then click as fast as you can. 5 rounds.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRound(0);
                      setTimes([]);
                      startRound();
                    }}
                    className="btn-shine mt-2 flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
                  >
                    Start Test
                  </motion.button>
                </motion.div>
              )}

              {phase === "waiting" && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-4 w-4 rounded-full bg-muted-foreground/40"
                  />
                  <p className="text-xl font-black text-muted-foreground">Wait for it…</p>
                  <p className="text-sm text-muted-foreground/60">Don't click too early!</p>
                </motion.div>
              )}

              {phase === "ready" && (
                <motion.div
                  key="ready"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.08 }}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <motion.p
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                    className="text-5xl font-black text-white drop-shadow-lg"
                  >
                    CLICK!
                  </motion.p>
                  <p className="text-base font-semibold text-white/80">NOW!</p>
                </motion.div>
              )}

              {phase === "tooearly" && (
                <motion.div
                  key="tooearly"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center gap-3 text-center px-6"
                >
                  <p className="text-4xl">😅</p>
                  <p className="text-xl font-black text-white">Too early!</p>
                  <p className="text-sm text-white/80">Click again to retry this round</p>
                </motion.div>
              )}

              {phase === "result" && lastTime !== null && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <p className="text-5xl font-black tabular-nums gradient-text">
                    {lastTime}
                    <span className="text-2xl">ms</span>
                  </p>
                  <p className={cn("text-base font-bold", getRank(lastTime).color)}>
                    {getRank(lastTime).emoji} {getRank(lastTime).label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Click to continue</p>
                </motion.div>
              )}

              {phase === "done" && avg !== null && rank && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3 text-center px-6"
                >
                  <p className="text-5xl">{rank.emoji}</p>
                  <p className="text-2xl font-black text-foreground">
                    {Math.round(avg)}
                    <span className="text-lg">ms avg</span>
                  </p>
                  <p className={cn("text-base font-bold", rank.color)}>Rank: {rank.label}</p>
                  {newRecord && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1"
                    >
                      <Trophy className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary">New personal best!</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* round pips */}
          {phase !== "idle" && (
            <div className="flex items-center justify-center gap-2 border-t border-border/40 bg-card/60 py-3">
              {Array.from({ length: ROUNDS }).map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    i < times.length
                      ? "bg-emerald-500 scale-110"
                      : i === times.length
                        ? "bg-primary animate-pulse"
                        : "bg-muted",
                  )}
                />
              ))}
            </div>
          )}

          {/* done actions */}
          {phase === "done" && (
            <div className="flex flex-col gap-2 px-5 pb-5 pt-2">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="btn-shine flex flex-1 items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Play Again
                </motion.button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground/40">
                Share your score: {Math.round(avg ?? 0)}ms avg · Rank: {rank?.label}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
