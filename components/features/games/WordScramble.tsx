"use client";

/**
 * WordScramble — unscramble the word against the clock
 * ─────────────────────────────────────────────────────
 * • A tech-world word is scrambled; type the correct word
 * • 10 seconds per round
 * • Score = words unscrambled; streak bonus for combos
 * • Skip button for tough ones (no score for skipped)
 * • Best score in localStorage
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

const LS_KEY = "wordscramble_best";
const ROUND_TIME = 10000;

const WORD_BANK = [
  "react",
  "array",
  "debug",
  "query",
  "state",
  "props",
  "async",
  "fetch",
  "build",
  "cache",
  "token",
  "route",
  "class",
  "style",
  "input",
  "event",
  "modal",
  "timer",
  "store",
  "stack",
  "queue",
  "logic",
  "proxy",
  "clone",
  "merge",
  "parse",
  "chunk",
  "scope",
  "block",
  "hooks",
  "types",
  "cloud",
  "patch",
  "draft",
  "error",
  "media",
  "frame",
  "pixel",
  "layer",
  "index",
  "model",
  "agent",
  "shape",
  "tuple",
  "union",
  "enum",
  "interface",
  "component",
  "function",
  "server",
  "client",
  "deploy",
  "branch",
  "commit",
  "module",
  "import",
  "export",
];

function scramble(word: string): string {
  const arr = word.split("");
  // ensure scrambled !== original
  for (let tries = 0; tries < 20; tries++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.join("") !== word) break;
  }
  return arr.join("");
}

function pickWord(used: Set<string>): string {
  const pool = WORD_BANK.filter((w) => !used.has(w));
  if (pool.length === 0) return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

type Phase = "idle" | "playing" | "correct" | "wrong" | "done";

export function WordScramble({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [word, setWord] = useState("");
  const [jumbled, setJumbled] = useState("");
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(1);
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState(false);

  const rafRef = useRef<number>(0);
  const timerStart = useRef<number>(0);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const usedRef = useRef<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

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

  const endGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const final = scoreRef.current;
    setBest((prev) => {
      if (final > prev) {
        setNewRecord(true);
        try {
          localStorage.setItem(LS_KEY, String(final));
        } catch {
          /**/
        }
        return final;
      }
      return prev;
    });
    setPhase("done");
  }, []);

  const nextWord = useCallback(() => {
    const w = pickWord(usedRef.current);
    usedRef.current.add(w);
    const j = scramble(w);
    setWord(w);
    setJumbled(j);
    setTyped("");
    setHint(false);
    timerStart.current = Date.now();
    setTimeLeft(1);
    cancelAnimationFrame(rafRef.current);

    const tick = () => {
      const ratio = 1 - (Date.now() - timerStart.current) / ROUND_TIME;
      if (ratio <= 0) {
        streakRef.current = 0;
        setStreak(0);
        endGame();
        return;
      }
      setTimeLeft(ratio);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [endGame]);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    streakRef.current = 0;
    usedRef.current = new Set();
    setScore(0);
    setStreak(0);
    setNewRecord(false);
    setPhase("playing");
    nextWord();
  }, [nextWord]);

  const handleInput = useCallback(
    (val: string) => {
      setTyped(val);
      if (val.toLowerCase() === word.toLowerCase()) {
        cancelAnimationFrame(rafRef.current);
        streakRef.current += 1;
        const bonus = Math.floor(streakRef.current / 3);
        scoreRef.current += 1 + bonus;
        setScore(scoreRef.current);
        setStreak(streakRef.current);
        setPhase("correct");
        setTimeout(() => {
          setPhase("playing");
          nextWord();
        }, 400);
      }
    },
    [word, nextWord],
  );

  const skip = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streakRef.current = 0;
    setStreak(0);
    setPhase("playing");
    nextWord();
  }, [nextWord]);

  const pct = timeLeft;

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
                <Shuffle className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Word Scramble</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Unscramble it fast</p>
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

          {/* timer bar */}
          {phase === "playing" && (
            <div className="h-1.5 w-full bg-muted/30">
              <div
                className="h-full rounded-full transition-none"
                style={{
                  width: `${pct * 100}%`,
                  background: pct > 0.5 ? "var(--primary)" : pct > 0.25 ? "#f59e0b" : "#ef4444",
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-5 p-5">
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
                    animate={{ rotate: [0, 180, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-5xl"
                  >
                    🔀
                  </motion.div>
                  <p className="text-lg font-black text-foreground">Word Scramble</p>
                  <p className="text-sm text-muted-foreground max-w-[260px]">
                    A tech word gets scrambled. Type the correct word before 10 seconds run out.
                    Streak combos earn bonus points!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={startGame}
                    className="btn-shine mt-1 flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
                  >
                    Start
                  </motion.button>
                </motion.div>
              )}

              {/* playing */}
              {(phase === "playing" || phase === "correct") && (
                <motion.div
                  key="game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* streak */}
                  {streak >= 3 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex justify-center"
                    >
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[11px] font-bold text-amber-500">
                        🔥 {streak}x streak!
                      </span>
                    </motion.div>
                  )}

                  {/* scrambled word display */}
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Unscramble this
                    </p>
                    <motion.div
                      key={jumbled}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={
                        phase === "correct"
                          ? { scale: [1, 1.08, 1], opacity: 1 }
                          : { scale: 1, opacity: 1 }
                      }
                      className={cn(
                        "flex gap-2 rounded-2xl border px-6 py-4",
                        phase === "correct"
                          ? "border-emerald-500/30 bg-emerald-500/8"
                          : "border-border/50 bg-card/60",
                      )}
                    >
                      {jumbled
                        .toUpperCase()
                        .split("")
                        .map((ch, i) => (
                          <motion.span
                            key={i}
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.04 }}
                            className={cn(
                              "text-2xl font-black tabular-nums",
                              phase === "correct" ? "text-emerald-500" : "text-foreground",
                            )}
                          >
                            {ch}
                          </motion.span>
                        ))}
                    </motion.div>

                    {/* hint — first letter */}
                    {hint && (
                      <p className="text-[11px] text-muted-foreground">
                        Starts with{" "}
                        <span className="font-bold text-primary">{word[0].toUpperCase()}</span>
                        {" · "}
                        {word.length} letters
                      </p>
                    )}
                  </div>

                  {/* input */}
                  <input
                    ref={inputRef}
                    value={typed}
                    onChange={(e) => handleInput(e.target.value)}
                    disabled={phase !== "playing"}
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="Type your answer…"
                    className={cn(
                      "w-full rounded-xl border bg-card/60 px-4 py-3 text-center text-base font-bold tracking-widest text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                      phase === "correct"
                        ? "border-emerald-500/40 bg-emerald-500/8"
                        : "border-border/50",
                    )}
                  />

                  {/* actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHint(true)}
                      disabled={hint}
                      className="flex-1 rounded-xl border border-border/40 bg-muted/20 py-2 text-[11px] font-semibold text-muted-foreground hover:bg-muted/40 transition-all disabled:opacity-30"
                    >
                      💡 Hint
                    </button>
                    <button
                      onClick={skip}
                      className="flex-1 rounded-xl border border-border/40 bg-muted/20 py-2 text-[11px] font-semibold text-muted-foreground hover:bg-muted/40 transition-all"
                    >
                      Skip →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* done */}
              {phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-2 text-center"
                >
                  <p className="text-5xl">{score >= 12 ? "🏆" : score >= 6 ? "🔀" : "💬"}</p>
                  <div>
                    <p className="text-3xl font-black text-foreground">{score}</p>
                    <p className="text-sm text-muted-foreground">words unscrambled</p>
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
                      <RotateCcw className="h-3.5 w-3.5" /> Play Again
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
