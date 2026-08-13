"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { SESSION_KEY, BOOT_LINES, TypedLine, CompletedLine } from "./LoadingScreenParts";

// ── Main loading screen ───────────────────────────────────────────────────────

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [current, setCurrent] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);
  const revealedRef = useRef(false);

  // Show skip button after 1.5s
  useEffect(() => {
    const t = setTimeout(() => setSkipVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // ESC key skips immediately — works from the very first render
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // handleSkip is stable (no deps that change) so this is safe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Smooth progress timer ─────────────────────────────────────────────────
  // Drives progress independently from typing so it always looks alive.
  // Budget: reach ~90% in 5s, finishing line pushes to 100.
  // Uses a RAF loop so it's frame-accurate and never stutters.
  const progressRef = useRef(0);
  const progressRafRef = useRef<number>(0);
  const progressStartRef = useRef<number>(0);
  const BUDGET_MS = 5200; // reach 90% by this point

  useEffect(() => {
    progressStartRef.current = performance.now();

    const tick = (now: number) => {
      if (revealedRef.current) return;
      const elapsed = now - progressStartRef.current;
      // Ease-out curve: fast at start, slows near 90
      const t = Math.min(elapsed / BUDGET_MS, 1);
      const eased = 1 - Math.pow(1 - t, 2.2); // quadratic ease-out
      const target = Math.round(eased * 90); // cap at 90 — last line pushes to 100
      if (target > progressRef.current) {
        progressRef.current = target;
        setProgress(target);
      }
      if (t < 1) progressRafRef.current = requestAnimationFrame(tick);
    };

    progressRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Hard cap at 6s ────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      if (!revealedRef.current) triggerReveal();
    }, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerReveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    cancelAnimationFrame(progressRafRef.current);
    setProgress(100);
    setTimeout(() => {
      setRevealing(true);
      setTimeout(onDone, 900);
    }, 400);
  };

  const handleLineDone = () => {
    if (revealedRef.current) return;
    const justDone = current;
    setDoneCount(justDone + 1);
    if (justDone < BOOT_LINES.length - 1) {
      setTimeout(() => setCurrent(justDone + 1), BOOT_LINES[justDone + 1].preDelay);
    } else {
      // All lines done — push to 100% and reveal
      cancelAnimationFrame(progressRafRef.current);
      setProgress(100);
      setTimeout(triggerReveal, 500);
    }
  };

  const handleSkip = () => triggerReveal();

  return (
    <AnimatePresence>
      {!revealing ? (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          // bg-background + text-foreground — follows the active theme perfectly
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background px-4"
        >
          {/* Dot grid — uses foreground colour at low opacity, works in both themes */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Aurora orbs — use --primary so they match the accent colour */}
          <motion.div
            className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-primary/12 blur-[160px]"
            animate={{ x: [0, 70, 0], y: [0, 50, 0], scale: [1, 1.18, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[140px]"
            animate={{ x: [0, -60, 0], y: [0, -40, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/3 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-primary/6 blur-[110px]"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Terminal card */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[560px]"
          >
            {/* macOS-style title bar — bg-card + border-border */}
            <div className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-border/70 bg-card px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="mx-auto font-mono text-[11px] tracking-wider text-muted-foreground/50">
                {siteConfig.githubUsername}@portfolio — bash
              </span>
            </div>

            {/* Terminal body — bg-card, all text uses CSS vars */}
            <div className="min-h-[280px] rounded-b-2xl border border-border/70 bg-card px-5 py-5 sm:min-h-[320px]">
              {/* System info header */}
              <div className="mb-5 space-y-0.5 border-b border-border/50 pb-4">
                <p className="font-mono text-[11px] sm:text-[12px] text-primary/80">
                  {siteConfig.fullName} Portfolio · v2.0.0
                </p>
                <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/50">
                  Next.js 15 · TypeScript · Tailwind v4 · {new Date().getFullYear()}
                </p>
              </div>

              {/* Lines */}
              <div className="flex flex-col gap-2">
                {BOOT_LINES.slice(0, doneCount).map((line, i) => (
                  <CompletedLine key={i} line={line} />
                ))}
                {current < BOOT_LINES.length && current === doneCount && (
                  <TypedLine
                    key={`active-${current}`}
                    text={BOOT_LINES[current].text}
                    suffix={BOOT_LINES[current].suffix}
                    comment={BOOT_LINES[current].comment}
                    speed={BOOT_LINES[current].speed ?? 30}
                    onDone={handleLineDone}
                  />
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground/60">
                <span>Initialising portfolio</span>
                <motion.span
                  key={progress}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="tabular-nums text-primary/80"
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>
              <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-border/60">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full gradient-primary"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {/* Shimmer — uses a translucent white that works on both themes */}
                <motion.div
                  className="absolute inset-y-0 w-16 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  }}
                  animate={{ x: ["-4rem", "600px"] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 0.6 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Skip button — uses CSS vars */}
          <AnimatePresence>
            {skipVisible && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                onClick={handleSkip}
                className="relative z-10 mt-10 flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-5 py-2 font-mono text-[11px] text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:text-foreground active:scale-95"
              >
                Skip intro
                <kbd className="rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground/60">
                  ESC
                </kbd>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* ── Cinematic reveal ──────────────────────────────────────────────
           Three-layer exit:
           1. Left + right panels slide out (curtain split) with spring easing
           2. A glowing horizontal seam pulses at the split point
           3. A radial "iris" bloom scales up from centre — pure magic ✨
        ── */
        <motion.div
          key="curtain"
          className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          {/* Left panel */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-background"
            initial={{ x: 0 }}
            animate={{ x: "-101%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          />
          {/* Right panel */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-background"
            initial={{ x: 0 }}
            animate={{ x: "101%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          />
          {/* Glowing vertical seam at the split */}
          <motion.div
            className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 gradient-primary"
            style={{ filter: "blur(4px)" }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scaleY: [0, 1, 1, 1] }}
            transition={{
              duration: 0.85,
              ease: "easeInOut",
              delay: 0.05,
              times: [0, 0.15, 0.7, 1],
            }}
          />
          {/* Radial iris bloom — expands from centre, fades out */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--primary) 18%, transparent) 0%, transparent 70%)",
              width: "120vmax",
              height: "120vmax",
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Wrapper — handles sessionStorage + SSR ────────────────────────────────────

export function LoadingScreenWrapper({ children }: { children: React.ReactNode }) {
  const [booting, setBooting] = useState<boolean | null>(null);

  useEffect(() => {
    if (!siteConfig.showLoadingScreen) {
      setBooting(false);
      return;
    }
    setBooting(!sessionStorage.getItem(SESSION_KEY));
  }, []);

  const handleDone = () => {
    sessionStorage.setItem(SESSION_KEY, "0");
    setBooting(false);
  };

  if (booting === null) return null;

  return (
    <>
      <AnimatePresence>
        {booting && <LoadingScreen key="boot" onDone={handleDone} />}
      </AnimatePresence>
      <motion.div
        initial={false}
        animate={booting ? { opacity: 0, scale: 0.985 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ visibility: booting ? "hidden" : "visible" }}
      >
        {children}
      </motion.div>
    </>
  );
}
