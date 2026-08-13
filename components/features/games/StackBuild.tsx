"use client";

/**
 * StackBuild — swinging block stacker
 * ─────────────────────────────────────
 * • A block swings left-right like a crane
 * • Tap/click/Space to drop it
 * • Overhanging part falls off, remaining part stays
 * • Block gets narrower each round — miss completely = game over
 * • Speed increases every 3 blocks
 * • High score in localStorage
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, ArrowRight, Mail, Layers } from "lucide-react";

const LS_KEY = "stackbuild_best";
const CANVAS_W = 300;
const CANVAS_H = 340;
const BLOCK_H = 22;
const INITIAL_W = 180;
const BASE_Y = CANVAS_H - 30;

const COLORS = [
  "#f59e0b",
  "#8b5cf6",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#ec4899",
  "#f97316",
  "#06b6d4",
  "#a3e635",
  "#e879f9",
];

interface Block {
  x: number;
  w: number;
  color: string;
}

export function StackBuild({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const gameRef = useRef({
    blocks: [] as Block[],
    swingX: 0,
    swingDir: 1,
    swingW: INITIAL_W,
    speed: 1.8,
    running: false,
    colorIdx: 0,
    score: 0,
  });

  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      if (v) setBest(parseInt(v, 10));
    } catch {
      /**/
    }
  }, []);

  // draw loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const g = gameRef.current;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // dot grid background
    ctx.fillStyle = "rgba(128,128,128,0.06)";
    for (let x = 10; x < CANVAS_W; x += 20)
      for (let y = 10; y < CANVAS_H; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

    // stacked blocks (bottom = index 0)
    g.blocks.forEach((b, i) => {
      const y = BASE_Y - i * BLOCK_H;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.roundRect(b.x, y, b.w, BLOCK_H - 2, 4);
      ctx.fill();
      // shine
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(b.x + 4, y + 2, b.w - 8, 4);
    });

    // base platform
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.roundRect(CANVAS_W / 2 - INITIAL_W / 2, BASE_Y, INITIAL_W, BLOCK_H - 2, 4);
    ctx.fill();

    // swinging block
    if (g.running) {
      const swingY = BASE_Y - g.blocks.length * BLOCK_H;
      ctx.fillStyle = COLORS[g.colorIdx % COLORS.length];
      ctx.beginPath();
      ctx.roundRect(g.swingX, swingY, g.swingW, BLOCK_H - 2, 4);
      ctx.fill();
      // shine
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(g.swingX + 4, swingY + 2, g.swingW - 8, 4);

      // swing
      g.swingX += g.swingDir * g.speed;
      if (g.swingX + g.swingW > CANVAS_W - 4) {
        g.swingX = CANVAS_W - 4 - g.swingW;
        g.swingDir = -1;
      }
      if (g.swingX < 4) {
        g.swingX = 4;
        g.swingDir = 1;
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const g = gameRef.current;
    g.blocks = [];
    g.swingX = CANVAS_W / 2 - INITIAL_W / 2;
    g.swingDir = 1;
    g.swingW = INITIAL_W;
    g.speed = 1.8;
    g.running = true;
    g.colorIdx = 0;
    g.score = 0;
    setScore(0);
    setNewRecord(false);
    setPhase("playing");
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  const drop = useCallback(() => {
    const g = gameRef.current;
    if (!g.running) return;

    const topBlock =
      g.blocks.length > 0
        ? g.blocks[g.blocks.length - 1]
        : { x: CANVAS_W / 2 - INITIAL_W / 2, w: INITIAL_W };
    const topX = topBlock.x,
      topW = topBlock.w;
    const swingX = g.swingX,
      swingW = g.swingW;

    // Calculate overlap
    const overlapLeft = Math.max(swingX, topX);
    const overlapRight = Math.min(swingX + swingW, topX + topW);
    const overlapW = overlapRight - overlapLeft;

    if (overlapW <= 2) {
      // Missed completely → game over
      g.running = false;
      cancelAnimationFrame(rafRef.current);
      const finalScore = g.score;
      setScore(finalScore);
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
      return;
    }

    // Land the block at the overlap position
    g.blocks.push({ x: overlapLeft, w: overlapW, color: COLORS[g.colorIdx % COLORS.length] });
    g.score += 1;
    setScore(g.score);
    g.colorIdx += 1;

    // New swing block is the overlap width
    g.swingW = overlapW;
    g.swingX = overlapLeft;
    // Speed up every 3 blocks
    if (g.score % 3 === 0) g.speed = Math.min(g.speed + 0.35, 6);
  }, []);

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.key === " " || e.key === "Enter") && phase === "playing") {
        e.preventDefault();
        drop();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, phase, drop]);

  // cleanup on unmount
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

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
                <Layers className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Stack & Build</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Drop blocks, build the tower
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

          {/* canvas area */}
          <div className="relative bg-card/20" style={{ height: CANVAS_H }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              onClick={phase === "playing" ? drop : undefined}
              className="block w-full cursor-pointer"
              style={{ touchAction: "none" }}
            />

            {/* idle overlay */}
            <AnimatePresence>
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm text-center px-6"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-5xl"
                  >
                    🏗️
                  </motion.div>
                  <p className="text-lg font-black text-foreground">Stack the blocks!</p>
                  <p className="text-sm text-muted-foreground">
                    Click or tap when the swinging block is aligned. Each miss trims the block. Miss
                    completely — game over.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={startGame}
                    className="btn-shine mt-1 flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
                  >
                    Start Building
                  </motion.button>
                </motion.div>
              )}

              {phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/88 backdrop-blur-sm px-8 text-center"
                >
                  <p className="text-5xl">{score >= 15 ? "🏆" : score >= 8 ? "🏗️" : "💥"}</p>
                  <div>
                    <p className="text-3xl font-black text-foreground">
                      {score} block{score !== 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">stacked</p>
                  </div>
                  {newRecord && (
                    <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                      <Trophy className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary">New best!</span>
                    </div>
                  )}
                  <div className="flex w-full flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={startGame}
                      className="btn-shine flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Try Again
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
          </div>

          {/* footer hint */}
          {phase === "playing" && (
            <div className="flex items-center justify-center border-t border-border/40 bg-card/60 py-2.5">
              <p className="text-[10px] text-muted-foreground/50">
                Click / Tap /{" "}
                <kbd className="rounded border border-border/50 px-1 py-px text-[9px]">Space</kbd>{" "}
                to drop
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
