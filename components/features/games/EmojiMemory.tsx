"use client";

/**
 * EmojiMemory — 4×4 emoji card flip memory game
 * ──────────────────────────────────────────────
 * • 16 cards = 8 emoji pairs, all face-down
 * • Flip two at a time — match = stay revealed, mismatch = flip back
 * • Move counter + live timer
 * • Win screen with score, time, and moves
 * • Best score (moves × seconds) in localStorage
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, ArrowRight, Mail, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const LS_KEY = "emoji_memory_best";

const EMOJI_POOL = [
  "🚀",
  "⚡",
  "🎯",
  "🔥",
  "💎",
  "🌊",
  "🎸",
  "🦊",
  "🐉",
  "🌈",
  "🎪",
  "🍀",
  "🎭",
  "🦋",
  "🔮",
  "🎨",
];
const PAIRS = 8;

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function buildDeck(): Card[] {
  const pool = [...EMOJI_POOL].sort(() => Math.random() - 0.5).slice(0, PAIRS);
  return [...pool, ...pool]
    .sort(() => Math.random() - 0.5)
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

function scoreValue(moves: number, secs: number) {
  return moves * 10 + secs;
}

export function EmojiMemory({ onClose }: { onClose: () => void }) {
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      if (v) setBest(parseInt(v, 10));
    } catch {
      /**/
    }
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Timer
  useEffect(() => {
    if (started && !won) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, won]);

  const handleFlip = useCallback(
    (id: number) => {
      if (locked || won) return;
      const card = cards[id];
      if (card.flipped || card.matched || selected.includes(id)) return;

      if (!started) setStarted(true);

      const newSelected = [...selected, id];
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));

      if (newSelected.length === 2) {
        setLocked(true);
        setMoves((m) => m + 1);
        const [a, b] = newSelected;
        const ca = cards[a],
          cb = cards[id];
        console.log(b);
        if (ca.emoji === cb.emoji) {
          // match
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === id ? { ...c, matched: true, flipped: true } : c,
            ),
          );
          setSelected([]);
          setLocked(false);

          // Check win after state settles
          setTimeout(() => {
            setCards((prev) => {
              const allMatched = prev.every((c) => c.matched || c.id === a || c.id === id);
              if (allMatched) {
                setWon(true);
                clearInterval(timerRef.current);
                setMoves((m) => {
                  const finalMoves = m;
                  setElapsed((e) => {
                    const score = scoreValue(finalMoves, e);
                    setBest((prevBest) => {
                      if (prevBest === null || score < prevBest) {
                        setNewRecord(true);
                        try {
                          localStorage.setItem(LS_KEY, String(score));
                        } catch {
                          /**/
                        }
                        return score;
                      }
                      return prevBest;
                    });
                    return e;
                  });
                  return finalMoves;
                });
              }
              return prev;
            });
          }, 50);
        } else {
          // mismatch — flip back after delay
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                (c.id === a || c.id === id) && !c.matched ? { ...c, flipped: false } : c,
              ),
            );
            setSelected([]);
            setLocked(false);
          }, 900);
        }
      } else {
        setSelected(newSelected);
      }
    },
    [locked, won, cards, selected, started],
  );

  const reset = () => {
    clearInterval(timerRef.current);
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setElapsed(0);
    setStarted(false);
    setWon(false);
    setLocked(false);
    setNewRecord(false);
  };

  const matchedCount = cards.filter((c) => c.matched).length / 2;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${mins}:${String(secs).padStart(2, "0")}`;

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
          {best && <div className="hidden"></div>}
          {/* header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-card/80 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <Layers className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Emoji Memory</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {matchedCount}/{PAIRS} matched
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground/60">Moves</p>
                <p className="text-sm font-black tabular-nums text-foreground">{moves}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground/60">Time</p>
                <p className="text-sm font-black tabular-nums gradient-text">{timeStr}</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* grid */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {cards.map((card) => (
                <motion.button
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  className={cn(
                    "relative aspect-square rounded-xl border-2 text-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    card.matched
                      ? "border-emerald-500/40 bg-emerald-500/10 cursor-default"
                      : card.flipped
                        ? "border-primary/40 bg-primary/8 cursor-default"
                        : "border-border/50 bg-card/70 hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
                  )}
                  whileHover={!card.flipped && !card.matched ? { scale: 1.06 } : {}}
                  whileTap={!card.flipped && !card.matched ? { scale: 0.94 } : {}}
                  disabled={card.flipped || card.matched || locked}
                >
                  <AnimatePresence mode="wait">
                    {card.flipped || card.matched ? (
                      <motion.span
                        key="front"
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-0 flex items-center justify-center select-none"
                      >
                        {card.emoji}
                        {card.matched && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white"
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="back"
                        initial={{ rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-lg select-none"
                      >
                        ?
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          {/* controls */}
          <div className="flex items-center justify-between border-t border-border/40 bg-card/60 px-5 py-3">
            <p className="text-[11px] text-muted-foreground">
              {won ? "🎉 You won!" : started ? "Find all matching pairs" : "Flip cards to start"}
            </p>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/60 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* win overlay */}
          <AnimatePresence>
            {won && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center rounded-3xl bg-background/92 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.85, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="flex flex-col items-center gap-4 px-8 text-center"
                >
                  <p className="text-5xl">🎉</p>
                  <div>
                    <p className="font-heading text-2xl font-black text-foreground">You won!</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {moves} moves · {timeStr}
                    </p>
                  </div>
                  {newRecord && (
                    <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                      <Trophy className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary">New best!</span>
                    </div>
                  )}
                  <div className="flex w-full flex-col gap-2 mt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={reset}
                      className="btn-shine flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Play Again
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
