"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { HeroVisualFrame } from "./HeroVisualFrame";

const NOTES = [
  {
    category: "Engineering",
    title: "Caching without the footguns",
    meta: "6 min · Next.js",
  },
  {
    category: "Backend",
    title: "APIs that stay predictable",
    meta: "8 min · Node.js",
  },
  {
    category: "Frontend",
    title: "Interfaces people finish using",
    meta: "5 min · React",
  },
] as const;

/** Blog hero — a cycling reader stack of engineering notes. */
export function BlogHeroVisual() {
  const reducedMotion = useReducedMotion();
  const [front, setFront] = useState(0);
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setFront((i) => (i + 1) % NOTES.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setLine(3);
      return;
    }
    setLine(0);
    const id = window.setInterval(() => {
      setLine((n) => (n >= 3 ? n : n + 1));
    }, 420);
    return () => window.clearInterval(id);
  }, [front, reducedMotion]);

  const active = NOTES[front];

  return (
    <HeroVisualFrame label="Animated stack of engineering blog notes">
      <div className="flex min-h-[280px] flex-col justify-between p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Reader
          </p>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" aria-hidden />
            Live notes
          </span>
        </div>

        <div className="relative mx-auto mt-5 h-[200px] w-full max-w-[270px]">
          {NOTES.map((note, i) => {
            const offset = (i - front + NOTES.length) % NOTES.length;
            return (
              <motion.div
                key={note.title}
                className="absolute inset-x-0 top-0"
                animate={{
                  y: offset * 12,
                  scale: 1 - offset * 0.055,
                  rotate: offset === 0 ? 0 : offset === 1 ? -3.5 : 4.5,
                  zIndex: NOTES.length - offset,
                  opacity: offset > 2 ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                <div className="rounded-xl border border-border/80 bg-background/92 p-4 shadow-premium backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {note.category}
                  </p>
                  <p className="font-heading mt-2 text-sm font-bold leading-snug text-foreground">
                    {note.title}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{note.meta}</p>

                  {offset === 0 ? (
                    <div className="mt-3 space-y-1.5" aria-hidden>
                      {[0, 1, 2].map((row) => (
                        <motion.div
                          key={row}
                          initial={false}
                          animate={{
                            width: line > row ? `${72 - row * 14}%` : "12%",
                            opacity: line > row ? 1 : 0.25,
                          }}
                          className="h-1.5 rounded-full bg-primary/25"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 space-y-1.5" aria-hidden>
                      <div className="h-1.5 w-[80%] rounded-full bg-muted" />
                      <div className="h-1.5 w-[60%] rounded-full bg-muted" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="truncate text-xs text-muted-foreground">
            Now reading · <span className="font-medium text-foreground">{active.category}</span>
          </p>
          <div className="flex gap-1.5">
            {NOTES.map((note, i) => (
              <button
                key={note.title}
                type="button"
                aria-label={`Show ${note.title}`}
                onClick={() => setFront(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === front ? "w-5 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </HeroVisualFrame>
  );
}
