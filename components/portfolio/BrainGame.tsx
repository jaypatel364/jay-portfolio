"use client";

/**
 * BrainGame — "Jay's Brain" interactive skill explorer
 * ──────────────────────────────────────────────────────
 * • Modal canvas with 20 floating skill nodes
 * • Real react-icons/si icons — same library used in SkillsSection
 * • Smooth physics drift with soft repulsion — nodes never collide
 * • Click a node → fact panel slides in with rich detail
 * • Progress ring + unlock count in header
 * • All unlocked → confetti burst + celebration
 * • Space = random unlock, Escape = close
 * • Fully responsive
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, Sparkles, Trophy, RotateCcw, Zap, Lock } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiTailwindcss,
  SiDocker,
  SiAmazonwebservices,
  SiGraphql,
  SiFramer,
  SiPrisma,
  SiGit,
  SiNestjs,
  SiFigma,
  SiSocketdotio,
  SiJest,
  SiLinux,
  SiTurborepo,
} from "react-icons/si";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SkillNode {
  id: string;
  label: string;
  Icon: IconType;
  color: string;
  fact: string;
}

// ── Node data — real icons, real facts ───────────────────────────────────────

const SKILL_NODES: SkillNode[] = [
  {
    id: "react",
    label: "React",
    Icon: SiReact,
    color: "#61DAFB",
    fact: "Built 10+ production React apps. Jay's rule: if a component exceeds 200 lines, it becomes two.",
  },
  {
    id: "nextjs",
    label: "Next.js",
    Icon: SiNextdotjs,
    color: "#888888",
    fact: "This portfolio runs on Next.js 15 App Router with RSC. Jay migrated a client from Pages → App Router in one weekend.",
  },
  {
    id: "typescript",
    label: "TypeScript",
    Icon: SiTypescript,
    color: "#3178C6",
    fact: "Strict mode only. Motto: 'If the compiler is happy, I'm happy.' Refactored 8k lines of JS → TS in 3 days.",
  },
  {
    id: "nodejs",
    label: "Node.js",
    Icon: SiNodedotjs,
    color: "#5FA04E",
    fact: "Built a WebSocket server handling 500+ concurrent connections for a real-time chat app — zero dropped messages.",
  },
  {
    id: "mongodb",
    label: "MongoDB",
    Icon: SiMongodb,
    color: "#47A248",
    fact: "Designed schemas for a social platform with 100k+ documents. Aggregation pipelines are Jay's superpower.",
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    Icon: SiPostgresql,
    color: "#4169E1",
    fact: "Wrote a query that reduced a client's report generation from 8s → 400ms. Raw SQL + Prisma.",
  },
  {
    id: "redis",
    label: "Redis",
    Icon: SiRedis,
    color: "#FF4438",
    fact: "Used as both cache layer and rate limiter. Cut API response time by 70% by caching the right queries.",
  },
  {
    id: "tailwind",
    label: "Tailwind",
    Icon: SiTailwindcss,
    color: "#06B6D4",
    fact: "This entire portfolio UI is Tailwind v4. Jay can design a pixel-perfect component without opening Figma.",
  },
  {
    id: "docker",
    label: "Docker",
    Icon: SiDocker,
    color: "#2496ED",
    fact: "Containerised a full MERN stack with Docker Compose — spins up the entire dev environment in one command.",
  },
  {
    id: "aws",
    label: "AWS",
    Icon: SiAmazonwebservices,
    color: "#FF9900",
    fact: "Deployed a KYC platform on AWS using S3, CloudFront, and Rekognition for 3D liveness detection.",
  },
  {
    id: "graphql",
    label: "GraphQL",
    Icon: SiGraphql,
    color: "#E10098",
    fact: "Built a social media GraphQL API with NestJS + Apollo — feed ranking, notifications, follows in one elegant schema.",
  },
  {
    id: "framer",
    label: "Framer Motion",
    Icon: SiFramer,
    color: "#BB4AE8",
    fact: "Every animation on this portfolio is Framer Motion. Jay spent 3 hours perfecting the orbital skill ring alone.",
  },
  {
    id: "prisma",
    label: "Prisma",
    Icon: SiPrisma,
    color: "#5BC4D1",
    fact: "Replaced a hand-rolled ORM with Prisma and eliminated an entire class of runtime bugs overnight.",
  },
  {
    id: "git",
    label: "Git",
    Icon: SiGit,
    color: "#F05032",
    fact: "400+ GitHub contributions in the last year. Atomic commits only — every message tells a complete story.",
  },
  {
    id: "nestjs",
    label: "NestJS",
    Icon: SiNestjs,
    color: "#E0234E",
    fact: "Jay's backend of choice for large APIs. Modular architecture, DI, interceptors — genuinely loves it.",
  },
  {
    id: "figma",
    label: "Figma",
    Icon: SiFigma,
    color: "#F24E1E",
    fact: "Designs before coding. Used Figma + Visily for AI-assisted UI prototyping on a client NGO platform.",
  },
  {
    id: "socketio",
    label: "Socket.io",
    Icon: SiSocketdotio,
    color: "#999999",
    fact: "Real-time typing indicators, seen receipts, room management — built it all and made it feel instant.",
  },
  {
    id: "jest",
    label: "Jest/Vitest",
    Icon: SiJest,
    color: "#C21325",
    fact: "Wrote a test suite that caught a race condition before it hit production. Tests are first-class citizens.",
  },
  {
    id: "linux",
    label: "Linux",
    Icon: SiLinux,
    color: "#FCC624",
    fact: "Daily driver for development. Can navigate, debug, and deploy entirely from a terminal — no GUI needed.",
  },
  {
    id: "turborepo",
    label: "Turborepo",
    Icon: SiTurborepo,
    color: "#EF4444",
    fact: "Built a monorepo chat app with Turborepo — shared types between frontend and backend, zero duplication.",
  },
];

// ── Physics node position ─────────────────────────────────────────────────────

interface PhysicsNode {
  x: number; // 0–100 (% of container)
  y: number;
  vx: number; // velocity in % per frame
  vy: number;
}

/** Build initial positions using a Poisson-disc-like spread to guarantee no overlap */
function buildInitialPositions(count: number): PhysicsNode[] {
  const NODE_R = 6; // minimum distance between node centres (%)
  const positions: PhysicsNode[] = [];
  let attempts = 0;

  while (positions.length < count && attempts < 10000) {
    attempts++;
    const x = 8 + Math.random() * 84;
    const y = 8 + Math.random() * 78;

    const tooClose = positions.some((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      return Math.sqrt(dx * dx + dy * dy) < NODE_R;
    });

    if (!tooClose) {
      const speed = 0.007 + Math.random() * 0.008;
      const angle = Math.random() * 2 * Math.PI;
      positions.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
    }
  }
  return positions;
}

/** One tick of physics: move, bounce walls, apply soft repulsion */
function tickPhysics(nodes: PhysicsNode[]): PhysicsNode[] {
  const REPULSE_DIST = 9; // %
  const REPULSE_FORCE = 0.0012;
  const DAMPING = 0.995;
  const MAX_SPEED = 0.025;

  return nodes.map((n, i) => {
    let { x, y, vx, vy } = n;

    // Soft repulsion from other nodes
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const dx = x - nodes[j].x;
      const dy = y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      if (dist < REPULSE_DIST) {
        const force = REPULSE_FORCE / (dist * dist);
        vx += (dx / dist) * force;
        vy += (dy / dist) * force;
      }
    }

    // Damping
    vx *= DAMPING;
    vy *= DAMPING;

    // Speed cap
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > MAX_SPEED) {
      vx = (vx / speed) * MAX_SPEED;
      vy = (vy / speed) * MAX_SPEED;
    }

    // Move
    x += vx;
    y += vy;

    // Bounce off walls (with node half-size margin ~4%)
    if (x < 5) {
      x = 5;
      vx = Math.abs(vx);
    }
    if (x > 92) {
      x = 92;
      vx = -Math.abs(vx);
    }
    if (y < 5) {
      y = 5;
      vy = Math.abs(vy);
    }
    if (y > 88) {
      y = 88;
      vy = -Math.abs(vy);
    }

    return { x, y, vx, vy };
  });
}

// ── Confetti ──────────────────────────────────────────────────────────────────

function ConfettiBurst() {
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#ec4899", "#f97316"];
  const pieces = Array.from({ length: 72 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: 40 + Math.random() * 20,
    vx: (Math.random() - 0.5) * 140,
    vy: -(55 + Math.random() * 85),
    rot: Math.random() * 360,
    s: 0.5 + Math.random() * 0.9,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-2 w-2 rounded-[2px]"
          style={{ left: `${p.x}%`, top: "45%", backgroundColor: p.color, scale: p.s }}
          animate={{
            x: [0, p.vx, p.vx * 1.3],
            y: [0, p.vy, p.vy * 0.4 + 240],
            opacity: [1, 1, 0],
            rotate: [0, p.rot, p.rot * 2.5],
          }}
          transition={{ duration: 1.6 + Math.random() * 0.7, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ── Fact panel ────────────────────────────────────────────────────────────────

function FactPanel({ node, onClose }: { node: SkillNode; onClose: () => void }) {
  const Icon = node.Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className="absolute bottom-4 left-4 right-4 z-20 sm:bottom-5 sm:left-auto sm:right-5 sm:w-80"
    >
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/98 shadow-premium backdrop-blur-xl">
        {/* Colour accent stripe */}
        <div
          className="h-[3px] w-full"
          style={{ background: `linear-gradient(90deg, ${node.color}, ${node.color}88)` }}
        />
        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${node.color}18`, border: `1.5px solid ${node.color}35` }}
          >
            <Icon size={22} style={{ color: node.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-foreground">{node.label}</p>
              <button
                onClick={onClose}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{node.fact}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main game ─────────────────────────────────────────────────────────────────

export function BrainGame({ onClose }: { onClose: () => void }) {
  const [physics, setPhysics] = useState<PhysicsNode[]>([]);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [activeNode, setActiveNode] = useState<SkillNode | null>(null);
  const [allUnlocked, setAllUnlocked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const rafRef = useRef<number>(0);
  const allUnlockedRef = useRef(false);

  // Init positions
  useEffect(() => {
    setPhysics(buildInitialPositions(SKILL_NODES.length));
  }, []);

  // Physics RAF loop
  useEffect(() => {
    if (physics.length === 0) return;
    const tick = () => {
      setPhysics((p) => tickPhysics(p));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [physics.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        const remaining = SKILL_NODES.filter((n) => !unlocked.has(n.id));
        if (remaining.length) handleUnlock(remaining[Math.floor(Math.random() * remaining.length)]);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, onClose]);

  const handleUnlock = useCallback((node: SkillNode) => {
    setActiveNode(node);
    setUnlocked((prev) => {
      const next = new Set(prev);
      next.add(node.id);
      if (next.size === SKILL_NODES.length && !allUnlockedRef.current) {
        allUnlockedRef.current = true;
        setTimeout(() => {
          setShowConfetti(true);
          setAllUnlocked(true);
          setTimeout(() => setShowConfetti(false), 2400);
        }, 250);
      }
      return next;
    });
  }, []);

  const handleReset = () => {
    setUnlocked(new Set());
    setActiveNode(null);
    setAllUnlocked(false);
    allUnlockedRef.current = false;
  };

  const count = unlocked.size;
  const total = SKILL_NODES.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999999] flex items-center justify-center bg-background/75 p-3 backdrop-blur-md sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-label="Jay's Brain — skill explorer"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="relative flex h-[88vh] max-h-[700px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-premium"
      >
        <div className="h-[3px] w-full gradient-primary" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 bg-card/80 px-4 py-3 backdrop-blur-sm sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-none">Jay's Brain</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {count}/{total} facts discovered
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* SVG progress ring */}
            <div className="relative flex h-9 w-9 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-border/50"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={String(2 * Math.PI * 15)}
                  animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - count / total) }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
              <span className="relative text-[9px] font-bold tabular-nums text-foreground">
                {count}
              </span>
            </div>

            <button
              onClick={handleReset}
              title="Reset progress"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative flex-1 overflow-hidden">
          {/* Subtle dot grid */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(128,128,128,0.12) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Central glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px]" />

          {/* Skill nodes */}
          {physics.map((pos, i) => {
            const node = SKILL_NODES[i];
            if (!node) return null;
            const isUnlocked = unlocked.has(node.id);
            const isActive = activeNode?.id === node.id;
            const Icon = node.Icon;

            return (
              <button
                key={node.id}
                onClick={() => handleUnlock(node)}
                title={
                  isUnlocked ? `${node.label} — click to revisit` : `Click to unlock ${node.label}`
                }
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 rounded-2xl border px-2.5 py-2.5 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "z-10 border-primary/50 bg-primary/8 scale-110"
                    : isUnlocked
                      ? "border-border/50 bg-card/70 hover:scale-105 hover:border-primary/30 hover:bg-card"
                      : "border-border/35 bg-card/40 hover:border-primary/40 hover:bg-primary/5 hover:scale-105 backdrop-blur-sm",
                )}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  boxShadow: isActive
                    ? `0 0 24px ${node.color}50, 0 0 8px ${node.color}30`
                    : isUnlocked
                      ? `0 0 12px ${node.color}25`
                      : undefined,
                  willChange: "left, top",
                }}
              >
                {/* Lock / check badge */}
                <span
                  className={cn(
                    "absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px]",
                    isUnlocked
                      ? "bg-emerald-500 text-white"
                      : "bg-muted border border-border/50 text-muted-foreground",
                  )}
                >
                  {isUnlocked ? "✓" : <Lock className="h-2 w-2" />}
                </span>

                {/* Icon */}
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
                    isUnlocked ? "" : "opacity-50",
                  )}
                  style={{ backgroundColor: `${node.color}18` }}
                >
                  <Icon
                    size={18}
                    style={{ color: isUnlocked ? node.color : undefined }}
                    className={isUnlocked ? "" : "text-muted-foreground"}
                  />
                </span>

                {/* Label */}
                <span
                  className={cn(
                    "max-w-[58px] truncate text-[10px] font-semibold leading-tight",
                    isUnlocked ? "text-foreground/90" : "text-muted-foreground/60",
                  )}
                >
                  {node.label}
                </span>
              </button>
            );
          })}

          {/* Fact panel */}
          <AnimatePresence>
            {activeNode && (
              <FactPanel
                key={activeNode.id}
                node={activeNode}
                onClose={() => setActiveNode(null)}
              />
            )}
          </AnimatePresence>

          {/* All-unlocked banner */}
          <AnimatePresence>
            {allUnlocked && (
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="absolute left-1/2 top-4 z-20 -translate-x-1/2"
              >
                <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-card/95 px-4 py-2 shadow-premium backdrop-blur-md">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="whitespace-nowrap text-[12px] font-bold text-foreground">
                    You explored all of Jay's brain! 🎉
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/40 bg-card/60 px-4 py-2.5 sm:px-5">
          <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <Zap className="h-3 w-3 text-primary/50" />
            <span className="hidden sm:inline">Click any node to unlock · </span>
            Press{" "}
            <kbd className="mx-0.5 rounded border border-border/60 px-1 py-px text-[9px]">
              Space
            </kbd>{" "}
            for a random one
          </p>
          {count === total ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
              <Sparkles className="h-3 w-3" /> All unlocked!
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground/50">{total - count} remaining</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Trigger button ────────────────────────────────────────────────────────────

export function BrainGameTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group flex items-center gap-2.5 rounded-2xl border border-primary/25 bg-primary/6 px-5 py-3 text-sm font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/10 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain className="h-4 w-4 transition-transform group-hover:rotate-12" />
        </motion.span>{" "}
        Explore Jay's Brain
      </motion.button>

      <AnimatePresence>
        {open && <BrainGame key="brain-game" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
