"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, ArrowRight, Mail, Target } from "lucide-react";

const LS_KEY = "dotcollector_best";
const GAME_TIME = 30;
const SPAWN_BASE = 900;
const DOT_LIFE = 2200;

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
  born: number;
}

let nextId = 0;

export function DotCollector({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [dots, setDots] = useState<Dot[]>([]);
  const [combo, setCombo] = useState(0);
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; val: number }[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const spawnRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);

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
    clearInterval(timerRef.current);
    clearTimeout(spawnRef.current);
    setDots([]);
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

  const spawnDot = useCallback(() => {
    if (scoreRef.current === -1) return;
    const pad = 48;
    const dot: Dot = {
      id: nextId++,
      x: pad + Math.random() * (320 - pad * 2),
      y: pad + Math.random() * (280 - pad * 2),
      size: 18 + Math.random() * 20,
      hue: Math.floor(Math.random() * 360),
      born: Date.now(),
    };
    setDots((prev) => [...prev, dot]);
    // auto-remove after life
    setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== dot.id));
    }, DOT_LIFE);
    // schedule next spawn (gets faster with score)
    const nextDelay = Math.max(300, SPAWN_BASE - scoreRef.current * 12);
    spawnRef.current = setTimeout(spawnDot, nextDelay);
  }, []);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_TIME);
    setDots([]);
    setPopups([]);
    setNewRecord(false);
    setPhase("playing");

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    spawnRef.current = setTimeout(spawnDot, 400);
  }, [endGame, spawnDot]);

  const clickDot = useCallback((dot: Dot, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setDots((prev) => prev.filter((d) => d.id !== dot.id));
    comboRef.current += 1;
    const pts = 1 + Math.floor(comboRef.current / 3);
    scoreRef.current += pts;
    setScore(scoreRef.current);
    setCombo(comboRef.current);
    setPopups((prev) => [...prev, { id: nextId++, x: dot.x, y: dot.y, val: pts }]);
    setTimeout(() => setPopups((prev) => prev.slice(1)), 700);
  }, []);

  const pct = timeLeft / GAME_TIME;

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
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Dot Collector</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {phase === "playing" ? `${timeLeft}s left` : "30 second frenzy"}
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
            <div className="h-1 w-full bg-muted/30">
              <motion.div
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{
                  width: `${pct * 100}%`,
                  background: pct > 0.5 ? "var(--primary)" : pct > 0.25 ? "#f59e0b" : "#ef4444",
                }}
              />
            </div>
          )}

          {/* arena */}
          <div className="relative overflow-hidden bg-card/30" style={{ height: 300 }}>
            <AnimatePresence>
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6"
                >
                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-5xl"
                  >
                    🎯
                  </motion.div>
                  <p className="text-lg font-black text-foreground">Click every dot!</p>
                  <p className="text-sm text-muted-foreground">
                    Dots appear and shrink away. Click them before they vanish. Combos earn bonus
                    points. 30 seconds. Go!
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

              {phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center"
                >
                  <p className="text-5xl">{score >= 50 ? "🏆" : score >= 25 ? "⚡" : "🎯"}</p>
                  <div>
                    <p className="text-4xl font-black text-foreground">{score}</p>
                    <p className="text-sm text-muted-foreground">dots collected</p>
                  </div>
                  {newRecord && (
                    <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                      <Trophy className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary">New best: {score}!</span>
                    </div>
                  )}
                  <div className="flex w-full flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={startGame}
                      className="btn-shine flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Play Again
                    </motion.button>
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
                      className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/60 py-2.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-all"
                    >
                      <Mail className="h-3.5 w-3.5" /> Hire Jay <ArrowRight className="h-3 w-3" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* dots */}
            {phase === "playing" &&
              dots.map((dot) => {
                const age = (Date.now() - dot.born) / DOT_LIFE;
                const life = 1 - age;
                return (
                  <motion.button
                    key={dot.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => clickDot(dot, e)}
                    className="absolute rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:brightness-110 active:scale-90 transition-transform"
                    style={{
                      left: dot.x - dot.size / 2,
                      top: dot.y - dot.size / 2,
                      width: dot.size,
                      height: dot.size,
                      background: `hsl(${dot.hue},80%,60%)`,
                      boxShadow: `0 0 ${dot.size}px hsl(${dot.hue},80%,60%,0.5)`,
                      opacity: Math.max(0.2, life),
                    }}
                  />
                );
              })}

            {/* score popups */}
            {popups.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, y: 0, scale: 0.8 }}
                animate={{ opacity: 0, y: -30, scale: 1.2 }}
                transition={{ duration: 0.65 }}
                className="pointer-events-none absolute text-sm font-black text-primary drop-shadow"
                style={{ left: p.x, top: p.y }}
              >
                +{p.val}
              </motion.div>
            ))}
          </div>

          {/* combo indicator */}
          {phase === "playing" && combo >= 3 && (
            <div className="flex items-center justify-center border-t border-border/40 bg-card/60 py-2">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-[11px] font-bold text-primary"
              >
                🔥 {combo}x Combo!
              </motion.span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
