"use client";

/**
 * CodeBreakerGame — Simon Says reflex game
 * ─────────────────────────────────────────
 * • 3×3 grid of glowing accent-coloured tiles
 * • Sequences light up; mirror them back by clicking
 * • Speed + length increases each round
 * • Wrong tap → tiles shake red, game over
 * • High score persisted in localStorage
 * • Personal best → confetti burst
 * • Escape = close | any click outside modal = close
 * • Fully responsive, keyboard accessible
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Trophy, RotateCcw, Play, ArrowRight, Mail, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Tile colours (accent palette) ────────────────────────────────────────────

const TILE_COLORS = [
  { bg: "oklch(0.65 0.18 45)", glow: "oklch(0.75 0.15 45 / 0.6)", label: "amber" },
  { bg: "oklch(0.60 0.20 260)", glow: "oklch(0.70 0.17 260 / 0.6)", label: "violet" },
  { bg: "oklch(0.60 0.19 160)", glow: "oklch(0.70 0.16 160 / 0.6)", label: "emerald" },
  { bg: "oklch(0.65 0.22 330)", glow: "oklch(0.75 0.19 330 / 0.6)", label: "pink" },
  { bg: "oklch(0.60 0.20 220)", glow: "oklch(0.70 0.17 220 / 0.6)", label: "cyan" },
  { bg: "oklch(0.65 0.22 25)", glow: "oklch(0.75 0.19 25 / 0.6)", label: "red" },
  { bg: "oklch(0.60 0.18 140)", glow: "oklch(0.70 0.15 140 / 0.6)", label: "green" },
  { bg: "oklch(0.65 0.20 290)", glow: "oklch(0.75 0.17 290 / 0.6)", label: "purple" },
  { bg: "oklch(0.60 0.19 195)", glow: "oklch(0.70 0.16 195 / 0.6)", label: "teal" },
];

const GRID_SIZE = 9; // 3×3
const LS_KEY = "codebreaker_highscore";

// ── Game phases ───────────────────────────────────────────────────────────────

type Phase =
  | "idle" // pre-game splash
  | "showing" // CPU is lighting sequence
  | "input" // player's turn
  | "success" // correct — brief green flash before next round
  | "fail" // wrong — red shake
  | "gameover"; // final score screen

// ── Confetti helper (imperative, no extra component needed) ───────────────────

function burstConfetti(originX: number, originY: number) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;z-index:99999;pointer-events:none;";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  const colors = ["#f59e0b", "#8b5cf6", "#10b981", "#ec4899", "#06b6d4", "#ef4444", "#a3e635"];
  const pieces = Array.from({ length: 90 }, () => ({
    x: originX,
    y: originY,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -14 - 4,
    size: 5 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.3,
    opacity: 1,
    shape: Math.random() > 0.5 ? "rect" : ("circle" as "rect" | "circle"),
  }));

  let raf: number;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of pieces) {
      if (p.opacity <= 0) continue;
      alive = true;
      p.vy += 0.3;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      p.opacity -= 0.013;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (alive) {
      raf = requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  };
  raf = requestAnimationFrame(draw);
  setTimeout(() => {
    cancelAnimationFrame(raf);
    canvas.remove();
  }, 3500);
}

// ── Tile component ────────────────────────────────────────────────────────────

interface TileProps {
  index: number;
  lit: boolean;
  wrong: boolean;
  correct: boolean;
  disabled: boolean;
  onClick: (i: number) => void;
}

function Tile({ index, lit, wrong, correct, disabled, onClick }: TileProps) {
  const color = TILE_COLORS[index];

  return (
    <motion.button
      onClick={() => !disabled && onClick(index)}
      disabled={disabled}
      aria-label={`Tile ${index + 1}`}
      animate={
        wrong
          ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
          : correct
            ? { scale: [1, 1.08, 1] }
            : lit
              ? { scale: [1, 1.06, 1] }
              : { scale: 1 }
      }
      transition={
        wrong
          ? { duration: 0.45, ease: "easeInOut" }
          : correct
            ? { duration: 0.25 }
            : { duration: 0.18 }
      }
      className={cn(
        "relative aspect-square w-full rounded-2xl border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        disabled ? "cursor-default" : "cursor-pointer",
      )}
      style={{
        background:
          lit || correct
            ? color.bg
            : wrong
              ? "oklch(0.55 0.22 25)"
              : "color-mix(in oklch, var(--card) 85%, transparent)",
        borderColor: lit || correct ? color.bg : wrong ? "oklch(0.65 0.22 25)" : "var(--border)",
        boxShadow:
          lit || correct
            ? `0 0 28px 4px ${color.glow}, 0 0 8px 1px ${color.glow}`
            : wrong
              ? "0 0 28px 4px oklch(0.65 0.22 25 / 0.5)"
              : undefined,
      }}
    >
      {/* inner glow dot when lit */}
      {(lit || correct) && (
        <motion.span
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-[14px]"
          style={{ background: color.bg, filter: "blur(10px)" }}
        />
      )}
      {/* dim number label */}
      <span
        className="absolute bottom-1.5 right-2 text-[10px] font-bold tabular-nums opacity-20 select-none"
        style={{ color: lit || correct || wrong ? "#fff" : "var(--muted-foreground)" }}
      >
        {index + 1}
      </span>
    </motion.button>
  );
}

// ── Game modal ────────────────────────────────────────────────────────────────

export function CodeBreakerGame({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [litTile, setLitTile] = useState<number | null>(null);
  const [wrongTiles, setWrongTiles] = useState<Set<number>>(new Set());
  const [correctTile, setCorrectTile] = useState<number | null>(null);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [newRecord, setNewRecord] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Load high score
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setHighScore(parseInt(stored, 10));
    } catch {
      /* ignore */
    }
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // ── Play a sequence ───────────────────────────────────────────────────────

  const playSequence = useCallback((seq: number[], round: number) => {
    setPhase("showing");
    setLitTile(null);

    // interval gets shorter as rounds progress (min 350ms)
    const interval = Math.max(350, 820 - round * 40);
    let i = 0;

    const next = () => {
      if (i >= seq.length) {
        setTimeout(() => {
          setLitTile(null);
          setPhase("input");
          setPlayerIdx(0);
        }, interval * 0.6);
        return;
      }
      setLitTile(seq[i]);
      i++;
      setTimeout(() => {
        setLitTile(null);
        setTimeout(next, interval * 0.35);
      }, interval * 0.65);
    };

    // small pause before sequence starts
    setTimeout(next, 600);
  }, []);

  // ── Start / next round ────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const first = Math.floor(Math.random() * GRID_SIZE);
    const seq = [first];
    setSequence(seq);
    setScore(0);
    setNewRecord(false);
    setWrongTiles(new Set());
    setCorrectTile(null);
    playSequence(seq, 0);
  }, [playSequence]);

  const nextRound = useCallback(
    (prevSeq: number[]) => {
      const next = [...prevSeq, Math.floor(Math.random() * GRID_SIZE)];
      setSequence(next);
      setWrongTiles(new Set());
      setCorrectTile(null);
      playSequence(next, next.length);
    },
    [playSequence],
  );

  // ── Player tap ────────────────────────────────────────────────────────────

  const handleTile = useCallback(
    (tileIdx: number) => {
      if (phase !== "input") return;

      const expected = sequence[playerIdx];

      if (tileIdx !== expected) {
        // Wrong
        setWrongTiles(new Set([tileIdx]));
        setPhase("fail");

        const finalScore = score;
        let isRecord = false;

        setHighScore((prev) => {
          if (finalScore > prev) {
            isRecord = true;
            try {
              localStorage.setItem(LS_KEY, String(finalScore));
            } catch {
              /* ignore */
            }
            return finalScore;
          }
          return prev;
        });

        if (isRecord && finalScore > 0) setNewRecord(true);

        setTimeout(() => {
          setWrongTiles(new Set());
          setPhase("gameover");
        }, 700);
        return;
      }

      // Correct tap
      setCorrectTile(tileIdx);
      setTimeout(() => setCorrectTile(null), 220);

      const nextIdx = playerIdx + 1;

      if (nextIdx === sequence.length) {
        // Completed the round
        const newScore = score + sequence.length;
        setScore(newScore);
        setPhase("success");

        setTimeout(() => {
          nextRound(sequence);
        }, 500);
      } else {
        setPlayerIdx(nextIdx);
      }
    },
    [phase, sequence, playerIdx, score, nextRound],
  );

  // ── Confetti on new record (gameover) ─────────────────────────────────────

  useEffect(() => {
    if (phase === "gameover" && newRecord && score > 0) {
      const rect = modalRef.current?.getBoundingClientRect();
      const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      burstConfetti(cx, cy);
      toast("🏆 New high score!", {
        description: `You scored ${score} points. Nice reflexes.`,
        duration: 3500,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Derived ───────────────────────────────────────────────────────────────

  const round = sequence.length;
  const speed = round <= 3 ? "Easy" : round <= 6 ? "Medium" : round <= 10 ? "Hard" : "Insane";
  const speedColor =
    round <= 3
      ? "text-emerald-500"
      : round <= 6
        ? "text-amber-500"
        : round <= 10
          ? "text-orange-500"
          : "text-red-500";

  const isDisabled =
    phase === "showing" || phase === "success" || phase === "fail" || phase === "idle";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999999] overflow-y-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
      role="dialog"
      aria-label="Code Breaker game"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-background/75 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-premium"
        >
          {/* accent bar */}
          <div className="h-[3px] w-full gradient-primary" />

          {/* ── Header ── */}
          <div className="flex items-center justify-between border-b border-border/50 bg-card/80 px-4 py-3 backdrop-blur-sm sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Code Breaker</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Mirror the sequence</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Scores */}
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-[10px] text-muted-foreground/60 leading-none">Best</p>
                  <p className="text-sm font-black tabular-nums gradient-text">{highScore}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/60 leading-none">Score</p>
                  <p className="text-sm font-black tabular-nums text-foreground">{score}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-col items-center gap-5 px-5 py-6 sm:px-8 sm:py-8">
            {/* Status bar */}
            <div className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-card/60 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Round</span>
                <span className="text-sm font-black text-foreground tabular-nums">{round}</span>
              </div>
              <div className={cn("text-[11px] font-semibold", speedColor)}>{speed}</div>
              <div className="flex items-center gap-1.5">
                {/* sequence length pips */}
                {Array.from({ length: Math.min(round, 10) }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                  />
                ))}
                {round > 10 && (
                  <span className="text-[10px] font-bold text-primary">+{round - 10}</span>
                )}
              </div>
            </div>

            {/* ── 3×3 Tile grid ── */}
            <div className="grid w-full max-w-[320px] grid-cols-3 gap-3">
              {Array.from({ length: GRID_SIZE }, (_, i) => (
                <Tile
                  key={i}
                  index={i}
                  lit={litTile === i}
                  wrong={wrongTiles.has(i)}
                  correct={correctTile === i}
                  disabled={isDisabled}
                  onClick={handleTile}
                />
              ))}
            </div>

            {/* ── Phase overlays / CTAs ── */}
            <AnimatePresence mode="wait">
              {/* Idle splash */}
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex w-full flex-col items-center gap-3"
                >
                  <p className="text-center text-[13px] text-muted-foreground leading-relaxed max-w-[260px]">
                    Watch the tiles light up, then tap the same sequence back. Each round adds one
                    more step.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={startGame}
                    className="btn-shine flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Start Game
                  </motion.button>
                </motion.div>
              )}

              {/* Showing sequence hint */}
              {phase === "showing" && (
                <motion.div
                  key="showing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-4 py-2.5"
                >
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-primary"
                  />
                  <span className="text-[12px] text-muted-foreground">Watch carefully…</span>
                </motion.div>
              )}

              {/* Input hint */}
              {phase === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/6 px-4 py-2.5"
                >
                  <motion.span
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-primary"
                  />
                  <span className="text-[12px] font-semibold text-primary">
                    Your turn — {sequence.length - playerIdx} tap
                    {sequence.length - playerIdx !== 1 ? "s" : ""} left
                  </span>
                </motion.div>
              )}

              {/* Success flash */}
              {phase === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/8 px-4 py-2.5"
                >
                  <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  <span className="text-[12px] font-semibold text-emerald-500">
                    +{sequence.length} — nice!
                  </span>
                </motion.div>
              )}

              {/* Fail flash */}
              {phase === "fail" && (
                <motion.div
                  key="fail"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/8 px-4 py-2.5"
                >
                  <span className="text-[12px] font-semibold text-red-500">Wrong tile!</span>
                </motion.div>
              )}

              {/* Game over */}
              {phase === "gameover" && (
                <motion.div
                  key="gameover"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex w-full flex-col items-center gap-4"
                >
                  {/* Score card */}
                  <div className="w-full overflow-hidden rounded-2xl border border-border/60 bg-card/90">
                    <div className="h-[3px] gradient-primary" />
                    <div className="flex items-center justify-around px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Score
                        </span>
                        <span className="text-2xl font-black tabular-nums text-foreground">
                          {score}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-border/50" />
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Round
                        </span>
                        <span className="text-2xl font-black tabular-nums text-foreground">
                          {round}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-border/50" />
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Best
                        </span>
                        <span
                          className={cn(
                            "text-2xl font-black tabular-nums",
                            newRecord ? "gradient-text" : "text-foreground",
                          )}
                        >
                          {highScore}
                        </span>
                      </div>
                    </div>
                    {newRecord && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-1.5 border-t border-border/40 bg-primary/6 py-2"
                      >
                        <Trophy className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[11px] font-bold text-primary">
                          New personal best!
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex w-full flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={startGame}
                      className="btn-shine flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Play Again
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }, 300);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/60 py-2.5 text-[12px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Impressed? Let's build something together
                      <ArrowRight className="h-3 w-3" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer hint */}
          {(phase === "showing" || phase === "input") && (
            <div className="flex items-center justify-center border-t border-border/40 bg-card/60 px-4 py-2">
              <p className="text-[10px] text-muted-foreground/50">
                Press{" "}
                <kbd className="mx-0.5 rounded border border-border/60 px-1 py-px text-[9px]">
                  Esc
                </kbd>{" "}
                to close
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Floating trigger button ───────────────────────────────────────────────────

export function CodeBreakerTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group flex items-center gap-2.5 rounded-2xl border border-primary/25 bg-primary/6 px-5 py-3 text-sm font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/10 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        title="Play Code Breaker"
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap className="h-4 w-4 transition-transform" />
        </motion.span>
        Code Breaker
      </motion.button>

      <AnimatePresence>
        {open && <CodeBreakerGame key="codebreaker" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
