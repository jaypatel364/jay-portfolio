"use client";

/**
 * LoadingScreen — cinematic terminal boot sequence
 * ─────────────────────────────────────────────────
 * • Plays once per session (sessionStorage flag)
 * • Fully theme-aware: uses CSS variables only — no hardcoded colours
 *   Works in light, dark, and any accent colour automatically
 * • Lines type one at a time — never duplicated
 * • Aurora glows + animated dot grid background
 * • Animated progress bar with shimmer
 * • Skip button (ESC) for impatient users
 * • Split-panel curtain reveal into the site
 * • Fully responsive
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

// ── Session key ───────────────────────────────────────────────────────────────

const SESSION_KEY = "jay_boot_done";

// ── Boot lines ────────────────────────────────────────────────────────────────

interface BootLine {
  text: string;
  preDelay: number;
  suffix?: string;
  comment?: boolean;
  speed?: number;
}

const BOOT_LINES: BootLine[] = [
  { text: `Connecting to ${siteConfig.title}`, preDelay: 400, suffix: "✓", speed: 36 },
  { text: "Initialising design system", preDelay: 120, suffix: "✓", speed: 30 },
  { text: "Loading React · Next.js · TypeScript", preDelay: 140, suffix: "✓", speed: 22 },
  { text: "Mounting Node.js · MongoDB · PostgreSQL", preDelay: 160, suffix: "✓", speed: 22 },
  { text: "Spinning up Docker containers", preDelay: 200, suffix: "✓", speed: 28 },
  { text: "// No bugs were harmed in this process", preDelay: 100, comment: true, speed: 20 },
  { text: "Brewing coffee", preDelay: 280, suffix: "☕ ✓", speed: 46 },
  { text: `All systems ready · Welcome to ${siteConfig.title} 🚀`, preDelay: 320, speed: 32 },
];

// ── TypedLine ─────────────────────────────────────────────────────────────────

function TypedLine({
  text,
  suffix,
  comment,
  speed,
  onDone,
}: {
  text: string;
  suffix?: string;
  comment?: boolean;
  speed: number;
  onDone: () => void;
}) {
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    idxRef.current = 0;
    setChars(0);
    setDone(false);

    const type = () => {
      idxRef.current += 1;
      setChars(idxRef.current);
      if (idxRef.current < text.length) {
        timerRef.current = setTimeout(type, speed);
      } else {
        timerRef.current = setTimeout(() => {
          setDone(true);
          setTimeout(onDone, 80);
        }, 60);
      }
    };
    timerRef.current = setTimeout(type, speed);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const displayed = text.slice(0, chars);

  return (
    <div className="flex items-baseline gap-2.5">
      {!comment && (
        <span className="shrink-0 select-none font-mono text-[12px] sm:text-[14px] text-primary/80">
          $
        </span>
      )}
      <span
        className={
          comment
            ? "font-mono text-[11px] sm:text-[13px] text-muted-foreground/50 italic"
            : "font-mono text-[12px] sm:text-[14px] text-foreground/90"
        }
      >
        {displayed}
        {chars < text.length && (
          <motion.span
            className="ml-px inline-block w-[2px] h-[0.9em] align-middle rounded-sm bg-primary"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.45, repeat: Infinity }}
          />
        )}
      </span>
      {done && suffix && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 font-mono text-[12px] sm:text-[14px] text-emerald-500"
        >
          {suffix}
        </motion.span>
      )}
    </div>
  );
}

// ── CompletedLine — static, dimmed ────────────────────────────────────────────

function CompletedLine({ line }: { line: BootLine }) {
  return (
    <div className="flex items-baseline gap-2.5 opacity-40">
      {!line.comment && (
        <span className="shrink-0 select-none font-mono text-[12px] sm:text-[14px] text-primary/70">
          $
        </span>
      )}
      <span
        className={
          line.comment
            ? "font-mono text-[11px] sm:text-[13px] text-muted-foreground/40 italic"
            : "font-mono text-[12px] sm:text-[14px] text-foreground/70"
        }
      >
        {line.text}
      </span>
      {line.suffix && (
        <span className="shrink-0 font-mono text-[12px] sm:text-[14px] text-emerald-500/60">
          {line.suffix}
        </span>
      )}
    </div>
  );
}

// ── Main loading screen ───────────────────────────────────────────────────────

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [current, setCurrent] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSkipVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const target = Math.min(97, Math.round((doneCount / BOOT_LINES.length) * 97));
    setProgress((p) => (target > p ? target : p));
  }, [doneCount]);

  const handleLineDone = () => {
    const justDone = current;
    setDoneCount(justDone + 1);
    if (justDone < BOOT_LINES.length - 1) {
      const next = justDone + 1;
      setTimeout(() => setCurrent(next), BOOT_LINES[next].preDelay);
    } else {
      setProgress(100);
      setTimeout(() => {
        setRevealing(true);
        setTimeout(onDone, 850);
      }, 700);
    }
  };

  const handleSkip = () => {
    setProgress(100);
    setRevealing(true);
    setTimeout(onDone, 650);
  };

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
        /* Split curtain reveal — uses bg-background to match site exactly */
        <motion.div
          key="curtain"
          className="pointer-events-none fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-background"
            animate={{ x: "-100%" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-background"
            animate={{ x: "100%" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Glowing seam */}
          <motion.div
            className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 gradient-primary blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
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
    sessionStorage.setItem(SESSION_KEY, "1");
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
        animate={{ opacity: booting ? 0 : 1 }}
        transition={{ duration: 0.01 }}
        style={{ visibility: booting ? "hidden" : "visible" }}
      >
        {children}
      </motion.div>
    </>
  );
}
