"use client";

/**
 * NumberNinja — math blitz
 * ─────────────────────────
 * • A simple math equation appears (add / subtract / multiply)
 * • 4 answer options, pick the right one before time runs out
 * • 3 seconds per round, gets harder as score grows
 * • Wrong answer or timeout = game over
 * • High score in localStorage
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, ArrowRight, Mail, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

const LS_KEY     = "numberninja_best";
const ROUND_TIME = 3000;

type Op = "+" | "−" | "×";

interface Question { a: number; b: number; op: Op; answer: number }

function makeQuestion(score: number): Question {
  const level = Math.floor(score / 3);
  // ops unlock progressively
  const ops: Op[] = level < 2 ? ["+", "−"] : ["+", "−", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a: number, b: number, answer: number;
  if (op === "+") {
    a = 1 + Math.floor(Math.random() * (10 + level * 8));
    b = 1 + Math.floor(Math.random() * (10 + level * 8));
    answer = a + b;
  } else if (op === "−") {
    a = 5 + Math.floor(Math.random() * (15 + level * 6));
    b = 1 + Math.floor(Math.random() * (a - 1));
    answer = a - b;
  } else {
    a = 2 + Math.floor(Math.random() * (4 + level * 2));
    b = 2 + Math.floor(Math.random() * (4 + level * 2));
    answer = a * b;
  }
  return { a, b, op, answer };
}

function makeOptions(answer: number, score: number): number[] {
  const level   = Math.floor(score / 3);
  const spread  = Math.max(2, 8 - level); // options get closer as level rises
  const opts    = new Set<number>([answer]);
  let attempts  = 0;
  while (opts.size < 4 && attempts < 200) {
    attempts++;
    const delta = Math.floor(Math.random() * spread * 2) - spread;
    if (delta !== 0) opts.add(answer + delta);
  }
  return [...opts].sort(() => Math.random() - 0.5);
}

type Phase = "idle" | "playing" | "correct" | "wrong" | "done";

export function NumberNinja({ onClose }: { onClose: () => void }) {
  const [phase,     setPhase]     = useState<Phase>("idle");
  const [score,     setScore]     = useState(0);
  const [best,      setBest]      = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [question,  setQuestion]  = useState<Question | null>(null);
  const [options,   setOptions]   = useState<number[]>([]);
  const [timeLeft,  setTimeLeft]  = useState(1);
  const [streak,    setStreak]    = useState(0);

  const rafRef      = useRef<number>(0);
  const timerStart  = useRef<number>(0);
  const scoreRef    = useRef(0);
  const streakRef   = useRef(0);

  useEffect(() => {
    try { const v = localStorage.getItem(LS_KEY); if (v) setBest(parseInt(v, 10)); } catch { /**/ }
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const endGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const final = scoreRef.current;
    setBest((prev) => {
      if (final > prev) {
        setNewRecord(true);
        try { localStorage.setItem(LS_KEY, String(final)); } catch { /**/ }
        return final;
      }
      return prev;
    });
    setPhase("done");
  }, []);

  const nextQuestion = useCallback((currentScore: number) => {
    const q = makeQuestion(currentScore);
    const o = makeOptions(q.answer, currentScore);
    setQuestion(q);
    setOptions(o);
    timerStart.current = Date.now();
    setTimeLeft(1);
    cancelAnimationFrame(rafRef.current);

    const tick = () => {
      const ratio = 1 - (Date.now() - timerStart.current) / ROUND_TIME;
      if (ratio <= 0) {
        setTimeLeft(0);
        streakRef.current = 0;
        setStreak(0);
        endGame();
        return;
      }
      setTimeLeft(ratio);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [endGame]);

  const startGame = useCallback(() => {
    scoreRef.current  = 0;
    streakRef.current = 0;
    setScore(0);
    setStreak(0);
    setNewRecord(false);
    setPhase("playing");
    nextQuestion(0);
  }, [nextQuestion]);

  const handlePick = useCallback((opt: number) => {
    if (!question || phase !== "playing") return;
    cancelAnimationFrame(rafRef.current);

    if (opt === question.answer) {
      streakRef.current += 1;
      const bonus      = Math.floor(streakRef.current / 3); // combo bonus
      const newScore   = scoreRef.current + 1 + bonus;
      scoreRef.current = newScore;
      setScore(newScore);
      setStreak(streakRef.current);
      setPhase("correct");
      setTimeout(() => {
        setPhase("playing");
        nextQuestion(newScore);
      }, 300);
    } else {
      streakRef.current = 0;
      setStreak(0);
      setPhase("wrong");
      setTimeout(() => endGame(), 650);
    }
  }, [question, phase, nextQuestion, endGame]);

  const pct   = timeLeft;
  const level = question ? Math.floor(scoreRef.current / 3) + 1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999999] isolate overflow-hidden"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-lg"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} />

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
                <Hash className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Number Ninja</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {phase === "playing" ? `Level ${level}` : "Math blitz"}
                </p>
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
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* timer bar */}
          {phase === "playing" && (
            <div className="h-1.5 w-full bg-muted/30">
              <motion.div className="h-full rounded-full transition-none"
                style={{ width: `${pct * 100}%`,
                  background: pct > 0.5 ? "var(--primary)" : pct > 0.25 ? "#f59e0b" : "#ef4444" }} />
            </div>
          )}

          <div className="flex flex-col gap-5 p-5">
            <AnimatePresence mode="wait">

              {/* idle */}
              {phase === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-4 text-center">
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
                    className="text-5xl">🥷</motion.div>
                  <p className="text-lg font-black text-foreground">Number Ninja</p>
                  <p className="text-sm text-muted-foreground max-w-[260px]">
                    Solve the equation and pick the right answer before 3 seconds run out.
                    Gets harder as you score. Combos earn bonus points!
                  </p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={startGame}
                    className="btn-shine mt-1 flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow">
                    Let's go
                  </motion.button>
                </motion.div>
              )}

              {/* playing */}
              {(phase === "playing" || phase === "correct" || phase === "wrong") && question && (
                <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col gap-5">

                  {/* streak badge */}
                  {streak >= 3 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="flex justify-center">
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[11px] font-bold text-amber-500">
                        🔥 {streak}x streak — +{Math.floor(streak / 3)} bonus!
                      </span>
                    </motion.div>
                  )}

                  {/* equation */}
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Solve it
                    </p>
                    <motion.div
                      key={`${question.a}${question.op}${question.b}`}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={
                        phase === "correct" ? { scale: [1, 1.08, 1], opacity: 1 } :
                        phase === "wrong"   ? { x: [0, -8, 8, -6, 6, 0], opacity: 1 } :
                        { scale: 1, opacity: 1 }
                      }
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-8 py-5 text-4xl font-black tabular-nums",
                        phase === "correct" ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-500" :
                        phase === "wrong"   ? "border-red-500/30 bg-red-500/8 text-red-500" :
                                              "border-border/50 bg-card/60 text-foreground",
                      )}
                    >
                      {question.a} {question.op} {question.b} = ?
                    </motion.div>
                  </div>

                  {/* options */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {options.map((opt) => (
                      <motion.button
                        key={opt}
                        onClick={() => handlePick(opt)}
                        disabled={phase !== "playing"}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
                        className={cn(
                          "rounded-xl border py-4 text-xl font-black tabular-nums transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          phase === "playing"
                            ? "border-border/40 bg-card/60 text-foreground hover:border-primary/40 hover:bg-primary/6"
                            : opt === question.answer
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                              : "border-border/20 bg-card/30 text-muted-foreground/40",
                        )}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* done */}
              {phase === "done" && (
                <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-2 text-center">
                  <p className="text-5xl">{score >= 15 ? "🏆" : score >= 8 ? "🥷" : "💥"}</p>
                  <div>
                    <p className="text-3xl font-black text-foreground">{score}</p>
                    <p className="text-sm text-muted-foreground">equations solved</p>
                  </div>
                  {newRecord && (
                    <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                      <Trophy className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary">New best: {score}!</span>
                    </div>
                  )}
                  <div className="flex w-full flex-col gap-2 mt-1">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={startGame}
                      className="btn-shine flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow">
                      <RotateCcw className="h-3.5 w-3.5" /> Play Again
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { onClose(); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 300); }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/60 py-2.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-all">
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
