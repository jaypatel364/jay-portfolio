"use client";

/**
 * ColorMatch Blitz — match the swatch under pressure
 * ───────────────────────────────────────────────────
 * • A target color swatch appears at the top
 * • 4 option swatches below — tap the matching one
 * • 3 seconds per round (shrinking timer bar)
 * • Colors get more similar as rounds progress (harder)
 * • Score = correct answers, high score in localStorage
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const LS_KEY = "colormatch_best";
const ROUND_TIME = 3000; // ms

interface ColorOption {
  h: number;
  s: number;
  l: number;
}

function hsl(h: number, s: number, l: number) {
  return `hsl(${h},${s}%,${l}%)`;
}

function generateRound(round: number): { target: ColorOption; options: ColorOption[] } {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30);
  const l = 45 + Math.floor(Math.random() * 20);
  const target: ColorOption = { h, s, l };

  // Difficulty: spread shrinks per round (min 10 hue degrees at round 10)
  const spread = Math.max(10, 60 - round * 4);

  const options: ColorOption[] = [target];
  while (options.length < 4) {
    const dh = (Math.random() < 0.5 ? 1 : -1) * (spread * 0.4 + Math.random() * spread);
    const dl = (Math.random() - 0.5) * 16;
    const candidate: ColorOption = {
      h: (h + dh + 360) % 360,
      s: Math.max(40, Math.min(95, s + (Math.random() - 0.5) * 10)),
      l: Math.max(30, Math.min(70, l + dl)),
    };
    // ensure it's visually distinct enough from target at current difficulty
    const dist = Math.abs(candidate.h - target.h) + Math.abs(candidate.l - target.l) * 0.5;
    if (dist > spread * 0.3) options.push(candidate);
  }
  return { target, options: options.sort(() => Math.random() - 0.5) };
}

type Phase = "idle" | "playing" | "wrong" | "done";

export function ColorMatch({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1); // 0–1 normalised
  const [current, setCurrent] = useState<ReturnType<typeof generateRound> | null>(null);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  const timerStart = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const roundRef = useRef(0);

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

  const endGame = useCallback((finalScore: number) => {
    cancelAnimationFrame(rafRef.current);
    setBest((prev) => {
      if (finalScore > prev) {
        setNewRecord(true);
        try {
          localStorage.setItem(LS_KEY, String(finalScore));
        } catch {
          /**/
        }
        return finalScore;
      }
      return prev;
    });
    setPhase("done");
  }, []);

  const startRound = useCallback(
    (r: number) => {
      roundRef.current = r;
      setCurrent(generateRound(r));
      timerStart.current = Date.now();
      setTimeLeft(1);
      setFlash(null);

      cancelAnimationFrame(rafRef.current);
      const tick = () => {
        const elapsed = Date.now() - timerStart.current;
        const ratio = 1 - elapsed / ROUND_TIME;
        if (ratio <= 0) {
          setTimeLeft(0);
          // time expired = wrong
          setFlash("wrong");
          setTimeout(() => endGame(roundRef.current - 1 < 0 ? 0 : roundRef.current - 1), 600);
          return;
        }
        setTimeLeft(ratio);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [endGame],
  );

  const startGame = useCallback(() => {
    setScore(0);
    setRound(1);
    setNewRecord(false);
    setPhase("playing");
    startRound(1);
  }, [startRound]);

  const handlePick = useCallback(
    (opt: ColorOption) => {
      if (!current || phase !== "playing") return;
      cancelAnimationFrame(rafRef.current);
      const isCorrect = opt.h === current.target.h && opt.l === current.target.l;

      if (isCorrect) {
        const newScore = score + 1;
        setScore(newScore);
        setFlash("correct");
        const nextRound = round + 1;
        setRound(nextRound);
        setTimeout(() => startRound(nextRound), 400);
      } else {
        setFlash("wrong");
        setTimeout(() => endGame(score), 600);
      }
    },
    [current, phase, score, round, startRound, endGame],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999999] overflow-y-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
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
          className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-background shadow-premium"
        >
          <div className="h-[3px] w-full gradient-primary" />

          {/* header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-card/80 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <Palette className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Color Match Blitz</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Round {round}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground/60">Score</p>
                <p className="text-sm font-black tabular-nums gradient-text">{score}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground/60">Best</p>
                <p className="text-sm font-black tabular-nums text-foreground">{best}</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-6 text-center"
                >
                  <div className="flex gap-2">
                    {["#f59e0b", "#8b5cf6", "#10b981", "#ef4444"].map((c, i) => (
                      <motion.div
                        key={c}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
                        className="h-10 w-10 rounded-xl shadow-lg"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <p className="text-lg font-black text-foreground">Match the color</p>
                  <p className="text-sm text-muted-foreground max-w-[240px]">
                    A target swatch appears — tap the matching one from 4 options before time runs
                    out.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={startGame}
                    className="btn-shine mt-2 flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
                  >
                    Start
                  </motion.button>
                </motion.div>
              )}

              {(phase === "playing" || phase === "wrong") && current && (
                <motion.div
                  key="game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5"
                >
                  {/* timer bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <motion.div
                      className={cn(
                        "h-full rounded-full transition-colors",
                        timeLeft > 0.5
                          ? "bg-emerald-500"
                          : timeLeft > 0.25
                            ? "bg-amber-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${timeLeft * 100}%` }}
                    />
                  </div>

                  {/* target */}
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Match this color
                    </p>
                    <motion.div
                      key={round}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={
                        flash === "correct"
                          ? { scale: [1, 1.12, 1], borderColor: "#10b981" }
                          : flash === "wrong"
                            ? { scale: [1, 0.9, 1], borderColor: "#ef4444" }
                            : { scale: 1 }
                      }
                      className="h-24 w-24 rounded-2xl border-4 border-transparent shadow-xl"
                      style={{
                        background: hsl(current.target.h, current.target.s, current.target.l),
                      }}
                    />
                  </div>

                  {/* options */}
                  <div className="grid grid-cols-2 gap-3">
                    {current.options.map((opt, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handlePick(opt)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-16 w-full rounded-xl border-2 border-border/40 shadow-md transition-all hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        style={{ background: hsl(opt.h, opt.s, opt.l) }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-4 text-center"
                >
                  <p className="text-4xl">{score >= 10 ? "🏆" : score >= 5 ? "🎯" : "🌈"}</p>
                  <div>
                    <p className="text-3xl font-black text-foreground">{score}</p>
                    <p className="text-sm text-muted-foreground">colors matched correctly</p>
                  </div>
                  {newRecord && (
                    <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                      <Trophy className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary">New best: {score}!</span>
                    </div>
                  )}
                  <div className="flex w-full flex-col gap-2 mt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={startGame}
                      className="btn-shine flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Try Again
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
