"use client";

/**
 * BrainGame — "Jay's Brain" interactive skill explorer
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, Sparkles, Trophy, RotateCcw, Zap, Mail, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SKILL_NODES, type SkillNode } from "./brain-data";
import { buildInitialPositions, tickPhysics, type PhysicsNode } from "./brain-physics";
import { ConfettiBurst, FactPanel } from "./BrainGameParts";

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
      className="fixed inset-0 z-[9999999] overflow-y-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-label="Jay's Brain — skill explorer"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-background/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-3 sm:p-6">
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
                    isUnlocked
                      ? `${node.label} — click to revisit`
                      : `Click to unlock ${node.label}`
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

            {/* All-unlocked celebration overlay */}
            <AnimatePresence>
              {allUnlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 60%, color-mix(in oklch, var(--primary) 10%, transparent) 0%, color-mix(in oklch, var(--background) 92%, transparent) 70%)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  {/* Card */}
                  <motion.div
                    initial={{ scale: 0.82, opacity: 0, y: 28 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 340, damping: 28, delay: 0.12 }}
                    className="relative mx-4 flex max-w-sm flex-col items-center gap-5 overflow-hidden rounded-3xl border border-primary/25 bg-card/95 px-8 py-8 shadow-premium text-center"
                  >
                    {/* Top shimmer bar */}
                    <div className="absolute inset-x-0 top-0 h-[3px] gradient-primary" />

                    {/* Trophy glow */}
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        className="absolute h-24 w-24 rounded-full bg-primary/15 blur-2xl"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                        className="relative flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-glow"
                      >
                        <Trophy className="h-9 w-9 text-primary-foreground" />
                      </motion.div>
                      {/* Sparkle dots orbiting */}
                      {[0, 72, 144, 216, 288].map((deg, i) => (
                        <motion.span
                          key={i}
                          className="absolute h-2 w-2 rounded-full bg-primary"
                          style={{
                            top: `${50 - 46 * Math.cos((deg * Math.PI) / 180)}%`,
                            left: `${50 + 46 * Math.sin((deg * Math.PI) / 180)}%`,
                            opacity: 0.7,
                          }}
                          animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            delay: i * 0.22,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>

                    {/* Headline */}
                    <div className="space-y-1.5">
                      <p className="font-heading text-xl font-black tracking-tight text-foreground">
                        You cracked Jay's Brain! 🧠
                      </p>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">
                        You just explored every skill, tool, and story behind the code.
                        <br />
                        Most people don't make it this far.
                      </p>
                    </div>

                    {/* Stat pills */}
                    <motion.div
                      className="flex w-full gap-2"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
                      }}
                    >
                      {[
                        { label: "Skills", value: `${SKILL_NODES.length}`, sub: "unlocked" },
                        { label: "Brain IQ", value: "200+", sub: "certified" },
                        { label: "Badge", value: "🏆", sub: "Explorer" },
                      ].map((s) => (
                        <motion.div
                          key={s.label}
                          variants={{
                            hidden: { opacity: 0, y: 12 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                          className="flex flex-1 flex-col items-center gap-0.5 rounded-xl border border-border/60 bg-muted/40 py-2.5"
                        >
                          <span className="text-base font-black gradient-text">{s.value}</span>
                          <span className="text-[10px] text-muted-foreground">{s.sub}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* CTAs */}
                    <div className="flex w-full flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          // close game first, then scroll
                          // onClose is injected via the parent — we emit a custom event
                          window.dispatchEvent(new CustomEvent("braingame:hire"));
                        }}
                        className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-[13px] font-bold text-primary-foreground shadow-glow transition-all"
                      >
                        <Mail className="h-4 w-4" />
                        Now let's build something together
                        <ArrowRight className="h-3.5 w-3.5" />
                      </motion.button>
                      <button
                        onClick={() => setAllUnlocked(false)}
                        className="w-full rounded-xl border border-border/60 bg-transparent py-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        Keep exploring ↩
                      </button>
                    </div>
                  </motion.div>
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
              <span className="text-[10px] text-muted-foreground/50">
                {total - count} remaining
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Trigger button ────────────────────────────────────────────────────────────

export function BrainGameTrigger() {
  const [open, setOpen] = useState(false);

  // Listen for the "hire me" CTA fired from inside the celebration overlay
  useEffect(() => {
    const handler = () => {
      setOpen(false);
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 320); // let the modal exit animation finish first
    };
    window.addEventListener("braingame:hire", handler);
    return () => window.removeEventListener("braingame:hire", handler);
  }, []);

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
