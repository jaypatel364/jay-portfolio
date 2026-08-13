"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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

export type { BootLine };
export { SESSION_KEY, BOOT_LINES, TypedLine, CompletedLine };
