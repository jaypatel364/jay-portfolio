"use client";

/**
 * GravityOrbs — physics orbs that react to your cursor
 * ──────────────────────────────────────────────────────
 * • Coloured orbs float with gentle gravity and bounce off walls
 * • Move cursor near an orb → it's attracted toward you
 * • Click an orb → it bursts into 2 smaller child orbs (+1 point)
 * • Child orbs can also be burst (but don't split further)
 * • 30-second timer — score = total orbs burst
 * • High score in localStorage
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, ArrowRight, Mail } from "lucide-react";

const LS_KEY     = "gravity_orbs_best";
const GAME_TIME  = 30;
const ATTRACT_R  = 130;   // px — cursor attraction radius
const ATTRACT_F  = 0.018; // attraction force
const DAMPING    = 0.92;
const GRAVITY    = 0.04;
const ARENA_W    = 340;
const ARENA_H    = 300;

const ORB_COLORS = [
  { h: 260, s: 85, l: 65 },
  { h: 160, s: 80, l: 55 },
  { h: 330, s: 85, l: 62 },
  { h: 45,  s: 90, l: 58 },
  { h: 200, s: 85, l: 60 },
  { h: 25,  s: 90, l: 60 },
];

interface Orb {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  colorIdx: number;
  isChild: boolean;
}

let _id = 0;
function uid() { return ++_id; }

function makeOrb(isChild = false, px?: number, py?: number): Orb {
  const r = isChild ? 10 + Math.random() * 8 : 18 + Math.random() * 14;
  return {
    id: uid(),
    x:  px ?? r + Math.random() * (ARENA_W - r * 2),
    y:  py ?? r + Math.random() * (ARENA_H * 0.6),
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    r,
    colorIdx: Math.floor(Math.random() * ORB_COLORS.length),
    isChild,
  };
}

function orbColor(orb: Orb, alpha = 1) {
  const c = ORB_COLORS[orb.colorIdx];
  return `hsla(${c.h},${c.s}%,${c.l}%,${alpha})`;
}

export function GravityOrbs({ onClose }: { onClose: () => void }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef<{
    orbs: Orb[];
    mx: number; my: number;
    score: number;
    running: boolean;
    raf: number;
  }>({ orbs: [], mx: ARENA_W / 2, my: ARENA_H / 2, score: 0, running: false, raf: 0 });

  const [phase,     setPhase]     = useState<"idle" | "playing" | "done">("idle");
  const [score,     setScore]     = useState(0);
  const [best,      setBest]      = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [timeLeft,  setTimeLeft]  = useState(GAME_TIME);

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    try { const v = localStorage.getItem(LS_KEY); if (v) setBest(parseInt(v, 10)); } catch { /**/ }
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // ── Draw loop ─────────────────────────────────────────────────────────────

  const drawLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s   = stateRef.current;

    ctx.clearRect(0, 0, ARENA_W, ARENA_H);

    // subtle dot grid
    ctx.fillStyle = "rgba(128,128,128,0.05)";
    for (let x = 16; x < ARENA_W; x += 22)
      for (let y = 16; y < ARENA_H; y += 22) {
        ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
      }

    // update + draw each orb
    s.orbs = s.orbs.map((orb) => {
      let { x, y, vx, vy } = orb;

      // gravity
      vy += GRAVITY;

      // cursor attraction
      const dx = s.mx - x;
      const dy = s.my - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < ATTRACT_R && dist > 1) {
        const f = ATTRACT_F * (1 - dist / ATTRACT_R);
        vx += (dx / dist) * f * orb.r;
        vy += (dy / dist) * f * orb.r;
      }

      vx *= DAMPING; vy *= DAMPING;
      x += vx; y += vy;

      // wall bounce
      if (x - orb.r < 0)         { x = orb.r;          vx = Math.abs(vx) * 0.7; }
      if (x + orb.r > ARENA_W)   { x = ARENA_W - orb.r; vx = -Math.abs(vx) * 0.7; }
      if (y - orb.r < 0)         { y = orb.r;           vy = Math.abs(vy) * 0.7; }
      if (y + orb.r > ARENA_H)   { y = ARENA_H - orb.r; vy = -Math.abs(vy) * 0.6; }

      // draw glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, orb.r * 2);
      glow.addColorStop(0, orbColor(orb, 0.25));
      glow.addColorStop(1, orbColor(orb, 0));
      ctx.beginPath(); ctx.arc(x, y, orb.r * 2, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();

      // draw orb body
      const grad = ctx.createRadialGradient(x - orb.r * 0.3, y - orb.r * 0.3, orb.r * 0.1, x, y, orb.r);
      grad.addColorStop(0, orbColor(orb, 1));
      grad.addColorStop(0.6, orbColor(orb, 0.85));
      grad.addColorStop(1, orbColor(orb, 0.5));
      ctx.beginPath(); ctx.arc(x, y, orb.r, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();

      // shine dot
      ctx.beginPath(); ctx.arc(x - orb.r * 0.3, y - orb.r * 0.3, orb.r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.fill();

      // cursor proximity ring pulse
      if (dist < ATTRACT_R) {
        const alpha = (1 - dist / ATTRACT_R) * 0.5;
        ctx.beginPath(); ctx.arc(x, y, orb.r + 5 + (1 - dist / ATTRACT_R) * 8, 0, Math.PI * 2);
        ctx.strokeStyle = orbColor(orb, alpha);
        ctx.lineWidth   = 1.5; ctx.stroke();
      }

      return { ...orb, x, y, vx, vy };
    });

    if (s.running) s.raf = requestAnimationFrame(drawLoop);
  }, []);

  // ── Start ─────────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.orbs    = Array.from({ length: 6 }, () => makeOrb());
    s.score   = 0;
    s.running = true;
    setScore(0); setTimeLeft(GAME_TIME); setNewRecord(false);
    setPhase("playing");

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          s.running = false;
          cancelAnimationFrame(s.raf);
          const final = s.score;
          setBest((prev) => {
            if (final > prev) {
              setNewRecord(true);
              try { localStorage.setItem(LS_KEY, String(final)); } catch { /**/ }
              return final;
            }
            return prev;
          });
          setPhase("done");
          return 0;
        }
        // spawn a new orb every 5 seconds to keep it fresh
        if (t % 5 === 0 && s.orbs.length < 12) s.orbs.push(makeOrb());
        return t - 1;
      });
    }, 1000);

    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(drawLoop);
  }, [drawLoop]);

  // ── Mouse move ────────────────────────────────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = ARENA_W / rect.width;
    const scaleY = ARENA_H / rect.height;
    stateRef.current.mx = (e.clientX - rect.left) * scaleX;
    stateRef.current.my = (e.clientY - rect.top) * scaleY;
  }, []);

  // touch support
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect  = canvasRef.current!.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = ARENA_W / rect.width;
    const scaleY = ARENA_H / rect.height;
    stateRef.current.mx = (touch.clientX - rect.left) * scaleX;
    stateRef.current.my = (touch.clientY - rect.top) * scaleY;
  }, []);

  // ── Click / tap orb ───────────────────────────────────────────────────────

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    const rect   = canvasRef.current!.getBoundingClientRect();
    const scaleX = ARENA_W / rect.width;
    const scaleY = ARENA_H / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top)  * scaleY;

    const s  = stateRef.current;
    let hit  = -1;
    for (let i = s.orbs.length - 1; i >= 0; i--) {
      const o  = s.orbs[i];
      const dx = o.x - cx; const dy = o.y - cy;
      if (dx * dx + dy * dy <= o.r * o.r) { hit = i; break; }
    }
    if (hit === -1) return;

    const orb  = s.orbs[hit];
    s.orbs.splice(hit, 1);
    s.score   += 1;
    setScore(s.score);

    // burst into 2 children (only if parent orb)
    if (!orb.isChild) {
      s.orbs.push(makeOrb(true, orb.x - orb.r, orb.y));
      s.orbs.push(makeOrb(true, orb.x + orb.r, orb.y));
    }

    // ensure minimum orbs alive
    if (s.orbs.filter((o) => !o.isChild).length < 3) {
      s.orbs.push(makeOrb());
    }
  }, [phase]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(stateRef.current.raf);
  }, []);

  const pct = timeLeft / GAME_TIME;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999999] isolate overflow-hidden"
    >
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow text-lg">
                🔮
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Gravity Orbs</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {phase === "playing" ? `${timeLeft}s left` : "Click the orbs!"}
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
              <button onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* timer bar */}
          {phase === "playing" && (
            <div className="h-1 w-full bg-muted/30">
              <div className="h-full transition-all duration-1000 ease-linear"
                style={{ width: `${pct * 100}%`,
                  background: pct > 0.5 ? "var(--primary)" : pct > 0.25 ? "#f59e0b" : "#ef4444" }} />
            </div>
          )}

          {/* arena */}
          <div className="relative bg-card/20" style={{ height: ARENA_H }}>
            <canvas
              ref={canvasRef}
              width={ARENA_W} height={ARENA_H}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onClick={handleClick}
              className="block w-full cursor-crosshair"
              style={{ touchAction: "none" }}
            />

            {/* idle overlay */}
            <AnimatePresence>
              {phase === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm text-center px-6">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-5xl">🔮</motion.div>
                  <div>
                    <p className="text-lg font-black text-foreground">Gravity Orbs</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      Move your cursor to attract the orbs. Click them to burst. 30 seconds. Go.
                    </p>
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={startGame}
                    className="btn-shine flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow">
                    Start
                  </motion.button>
                </motion.div>
              )}

              {phase === "done" && (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/88 backdrop-blur-sm px-8 text-center">
                  <p className="text-5xl">{score >= 20 ? "🏆" : score >= 10 ? "🔮" : "💥"}</p>
                  <div>
                    <p className="text-3xl font-black text-foreground">{score}</p>
                    <p className="text-sm text-muted-foreground">orbs burst</p>
                  </div>
                  {newRecord && (
                    <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                      <Trophy className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary">New best!</span>
                    </div>
                  )}
                  <div className="flex w-full flex-col gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={startGame}
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

          {phase === "playing" && (
            <div className="flex items-center justify-center border-t border-border/40 bg-card/60 py-2">
              <p className="text-[10px] text-muted-foreground/50">
                Move cursor to attract orbs · Click to burst them
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
