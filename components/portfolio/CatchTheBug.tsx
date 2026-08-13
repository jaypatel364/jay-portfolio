"use client";

/**
 * CatchTheBug — roaming easter egg with 70 / 30 reward split
 * ──────────────────────────────────────────────────────────────────────────
 * • A tiny animated bug crawls across the screen at random intervals
 * • 70 % chance → full immersive "Bug Squashed" overlay screen
 * • 30 % chance → quick toast notification only
 * • Each skin rotates so every appearance feels fresh
 * • Ping ring makes the bug noticeable without being annoying
 * • Escape dismisses the overlay
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, Bug, Trophy, Zap, ArrowRight, Mail } from "lucide-react";

// ── Config ────────────────────────────────────────────────────────────────────

const MIN_INTERVAL_MS = 45_000;
const MAX_INTERVAL_MS = 120_000;
const WALK_DURATION_S = 11;
const BUG_SIZE_PX = 38;
const OVERLAY_CHANCE = 0.7; // 70 % → full overlay, 30 % → toast only

const BUG_SKINS = ["🐛", "🐞", "🦗", "🪲", "🦟"];

// ── Confetti (imperative canvas) ──────────────────────────────────────────────

function burstConfettiAt(x: number, y: number) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;z-index:99999;pointer-events:none;";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#ec4899", "#f97316"];
  const pieces = Array.from({ length: 80 }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 12,
    vy: -(4 + Math.random() * 10),
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.28,
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
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      p.opacity -= 0.015;
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
  }, 3200);
}

// ── Squash overlay (70 % path) ────────────────────────────────────────────────

interface SquashOverlayProps {
  bugSkin: string;
  squashCount: number;
  onClose: () => void;
}

function SquashOverlay({ bugSkin, squashCount, onClose }: SquashOverlayProps) {
  // Trigger confetti once on mount
  useEffect(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    burstConfettiAt(cx, cy);
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const titles = ["Bug squashed.", "Got it!", "Eliminated.", "Flattened.", "Debugged in prod."];
  const subtitles = [
    "That's literally what I do for a living.",
    `${squashCount} bugs down. Infinite to go.`,
    "Clean code is no accident. Neither was that.",
    "Debugging is a superpower.",
    "You're thinking like an engineer now.",
  ];
  const idx = (squashCount - 1) % titles.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[9999995] flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 32 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 360, damping: 28, delay: 0.05 }}
        className="relative flex w-full max-w-sm flex-col items-center gap-5 overflow-hidden rounded-3xl border border-primary/25 bg-card/98 px-8 py-8 text-center shadow-premium"
      >
        {/* shimmer bar */}
        <div className="absolute inset-x-0 top-0 h-[3px] gradient-primary" />

        {/* close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Bug emoji — squash animation */}
        <div className="relative flex items-center justify-center">
          {/* glow ring */}
          <motion.div
            className="absolute h-28 w-28 rounded-full bg-primary/15 blur-2xl"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* squash effect */}
          <motion.div
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-glow"
            initial={{ scaleY: 1.4, scaleX: 0.8 }}
            animate={{ scaleY: 1, scaleX: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.1 }}
          >
            <motion.span
              style={{ fontSize: 36 }}
              initial={{ rotate: -30 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.15 }}
            >
              {bugSkin}
            </motion.span>
          </motion.div>

          {/* orbiting sparkles */}
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-full bg-primary"
              style={{
                top: `${50 - 52 * Math.cos((deg * Math.PI) / 180)}%`,
                left: `${50 + 52 * Math.sin((deg * Math.PI) / 180)}%`,
              }}
              animate={{ scale: [0.5, 1.3, 0.5], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <p className="font-heading text-2xl font-black tracking-tight text-foreground">
            {titles[idx]} {squashCount > 1 ? `×${squashCount}` : ""}
          </p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{subtitles[idx]}</p>
        </div>

        {/* Stat pills */}
        <motion.div
          className="flex w-full gap-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } } }}
        >
          {[
            {
              icon: <Bug className="h-3.5 w-3.5" />,
              label: "Squashed",
              value: String(squashCount),
            },
            { icon: <Trophy className="h-3.5 w-3.5" />, label: "Badge", value: "🏆 Debugger" },
            {
              icon: <Zap className="h-3.5 w-3.5" />,
              label: "Rank",
              value: squashCount >= 5 ? "Pro" : "Rookie",
            },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-border/60 bg-muted/40 py-2.5 px-1"
            >
              <span className="text-primary/70">{s.icon}</span>
              <span className="text-[11px] font-black gradient-text">{s.value}</span>
              <span className="text-[9px] text-muted-foreground">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <div className="flex w-full flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              onClose();
              setTimeout(
                () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
                300,
              );
            }}
            className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-[13px] font-bold text-primary-foreground shadow-glow"
          >
            <Mail className="h-4 w-4" />
            Now let's squash bugs together
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-border/50 bg-transparent py-2.5 text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Keep browsing ↩
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Path generator ────────────────────────────────────────────────────────────

interface BugPath {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  rotation: number;
  flipX: boolean;
}

function generatePath(): BugPath {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 60;
  const side = (): "h" | "v" => (Math.random() < 0.5 ? "h" : "v");
  const edge = (s: "h" | "v", lo: boolean): [number, number] =>
    s === "h"
      ? [lo ? -BUG_SIZE_PX : vw + BUG_SIZE_PX, pad + Math.random() * (vh - pad * 2)]
      : [pad + Math.random() * (vw - pad * 2), lo ? -BUG_SIZE_PX : vh + BUG_SIZE_PX];

  const [fx, fy] = edge(side(), true);
  const [tx, ty] = edge(side(), false);
  const dx = tx - fx,
    dy = ty - fy;
  return {
    fromX: fx,
    fromY: fy,
    toX: tx,
    toY: ty,
    rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
    flipX: dx < 0,
  };
}

// ── Main component ────────────────────────────────────────────────────────────

export function CatchTheBug() {
  const [visible, setVisible] = useState(false);
  const [squashed, setSquashed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [path, setPath] = useState<BugPath | null>(null);
  const [skinIndex, setSkinIndex] = useState(0);

  const squashCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const escapeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const gameOpenRef = useRef(false); // true while any GameZone modal is open

  // ── Pause while any game is running ───────────────────────────────────────
  useEffect(() => {
    const onOpen = () => {
      gameOpenRef.current = true;
      // immediately hide the bug if it's crawling
      setVisible(false);
      clearTimeout(escapeRef.current);
      clearTimeout(timerRef.current);
    };
    const onClose = () => {
      gameOpenRef.current = false;
      // reschedule after a short grace period
      scheduleNext();
    };
    window.addEventListener("gamezone:open", onOpen);
    window.addEventListener("gamezone:close", onClose);
    return () => {
      window.removeEventListener("gamezone:open", onOpen);
      window.removeEventListener("gamezone:close", onClose);
    };
    // scheduleNext is stable (useCallback with no deps that change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Schedule ──────────────────────────────────────────────────────────────

  const scheduleNext = useCallback(() => {
    clearTimeout(timerRef.current);
    if (gameOpenRef.current) return; // don't schedule while a game is open
    const delay = MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
    timerRef.current = setTimeout(() => {
      if (gameOpenRef.current) return; // double-check at fire time
      setSkinIndex((i) => (i + 1) % BUG_SKINS.length);
      setPath(generatePath());
      setSquashed(false);
      setVisible(true);
    }, delay);
  }, []);

  useEffect(() => {
    const firstDelay = process.env.NODE_ENV === "development" ? 8_000 : MIN_INTERVAL_MS;
    timerRef.current = setTimeout(() => {
      setPath(generatePath());
      setSquashed(false);
      setVisible(true);
    }, firstDelay);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Escape timer
  useEffect(() => {
    if (!visible) return;
    escapeRef.current = setTimeout(
      () => {
        setVisible(false);
        scheduleNext();
      },
      WALK_DURATION_S * 1000 + 400,
    );
    return () => clearTimeout(escapeRef.current);
  }, [visible, scheduleNext]);

  // ── Squash ────────────────────────────────────────────────────────────────

  const handleSquash = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      if (squashed || !visible) return;

      clearTimeout(escapeRef.current);
      clearTimeout(timerRef.current);

      squashCount.current += 1;
      setSquashed(true);

      const useOverlay = Math.random() < OVERLAY_CHANCE;

      if (useOverlay) {
        // 70 % — full overlay (confetti fired inside overlay on mount)
        setTimeout(() => {
          setVisible(false);
          setShowOverlay(true);
        }, 350);
      } else {
        // 30 % — toast only
        const el = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const cx = el.left + el.width / 2;
        const cy = el.top + el.height / 2;
        burstConfettiAt(cx, cy);
        const count = squashCount.current;
        const msgs = [
          "Bug squashed. That's literally what I do. 💻",
          `${count} bugs down. Infinite to go. 🐛`,
          "Clean code is no accident. Neither was that. ✨",
          `Debugging is a superpower. ${count} confirmed. 🏆`,
          `${count} squashes. You're thinking like an engineer now. 🚀`,
        ];
        toast("🐛 Bug squashed!", {
          description: msgs[(count - 1) % msgs.length],
          duration: 3500,
        });
        setTimeout(() => {
          setVisible(false);
          scheduleNext();
        }, 500);
      }
    },
    [squashed, visible, scheduleNext],
  );

  if (!path) return null;

  return (
    <>
      {/* ── Crawling bug ── */}
      <AnimatePresence>
        {visible && (
          <motion.button
            key="bug"
            aria-label="Catch the bug!"
            title="Catch the bug!"
            onClick={handleSquash}
            onTouchStart={handleSquash}
            initial={{ x: path.fromX, y: path.fromY, opacity: 0, scale: 0.5 }}
            animate={
              squashed
                ? { scale: 0, opacity: 0, rotate: 360 }
                : { x: path.toX, y: path.toY, opacity: [0, 1, 1, 1, 0], scale: 1 }
            }
            transition={
              squashed
                ? { duration: 0.32, ease: "backIn" }
                : {
                    x: { duration: WALK_DURATION_S, ease: "linear" },
                    y: { duration: WALK_DURATION_S, ease: "easeInOut" },
                    opacity: { duration: WALK_DURATION_S, times: [0, 0.06, 0.7, 0.92, 1] },
                    scale: { duration: 0.4, ease: "backOut" },
                  }
            }
            className="fixed z-[9999994] flex cursor-pointer items-center justify-center select-none focus-visible:outline-none"
            style={{
              width: BUG_SIZE_PX,
              height: BUG_SIZE_PX,
              top: 0,
              left: 0,
              rotate: `${path.rotation}deg`,
              filter: squashed ? "none" : "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
            }}
          >
            {!squashed && (
              <motion.span
                className="absolute inset-0 rounded-full bg-primary/20"
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <motion.span
              className="relative z-10 select-none"
              style={{
                fontSize: 22,
                display: "block",
                transform: path.flipX ? "scaleX(-1)" : undefined,
              }}
              animate={squashed ? {} : { rotate: [-8, 8, -8] }}
              transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
            >
              {BUG_SKINS[skinIndex]}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── 70 % overlay ── */}
      <AnimatePresence>
        {showOverlay && (
          <SquashOverlay
            key="squash-overlay"
            bugSkin={BUG_SKINS[skinIndex]}
            squashCount={squashCount.current}
            onClose={() => {
              setShowOverlay(false);
              scheduleNext();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
