"use client";

/**
 * VibeCheck — dev personality quiz
 * ──────────────────────────────────
 * • 6 "this or that" visual choice questions
 * • Each answer feeds into one of 6 personality archetypes
 * • Result shows archetype name, icon, tagline, and traits
 * • Shareable via clipboard copy
 */

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, RotateCcw, Share2, Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Questions ─────────────────────────────────────────────────────────────────

interface Choice { label: string; emoji: string; scores: Partial<Record<Archetype, number>> }
interface Question { q: string; a: Choice; b: Choice }

type Archetype =
  | "midnight_architect"
  | "ship_it_king"
  | "pixel_perfectionist"
  | "rubber_duck_whisperer"
  | "caffeine_compiler"
  | "open_source_oracle";

const QUESTIONS: Question[] = [
  {
    q: "Your dev setup:",
    a: { label: "Dark mode, always", emoji: "🌑", scores: { midnight_architect: 2, rubber_duck_whisperer: 1 } },
    b: { label: "Light mode (I like pain)", emoji: "☀️", scores: { pixel_perfectionist: 2, ship_it_king: 1 } },
  },
  {
    q: "A bug has been haunting you for 3 hours. You:",
    a: { label: "Rubber duck it until it confesses", emoji: "🦆", scores: { rubber_duck_whisperer: 3 } },
    b: { label: "Ship it and call it a feature", emoji: "🚀", scores: { ship_it_king: 3 } },
  },
  {
    q: "Tabs or spaces?",
    a: { label: "Tabs. Obviously.", emoji: "⇥", scores: { midnight_architect: 1, caffeine_compiler: 2 } },
    b: { label: "Spaces. Fight me.", emoji: "· · ·", scores: { pixel_perfectionist: 3 } },
  },
  {
    q: "It's 2am. You're:",
    a: { label: "Rewriting the entire codebase from scratch", emoji: "🌙", scores: { midnight_architect: 3 } },
    b: { label: "Finally understanding that one regex", emoji: "🧠", scores: { open_source_oracle: 3 } },
  },
  {
    q: "Your relationship with coffee:",
    a: { label: "It's basically blood at this point", emoji: "☕", scores: { caffeine_compiler: 3 } },
    b: { label: "I run on pure stubbornness", emoji: "💪", scores: { ship_it_king: 2, midnight_architect: 1 } },
  },
  {
    q: "You open a new codebase. First thing:",
    a: { label: "Read every file before touching anything", emoji: "📚", scores: { open_source_oracle: 2, pixel_perfectionist: 1 } },
    b: { label: "Find main() and start hacking", emoji: "⚡", scores: { ship_it_king: 2, caffeine_compiler: 1 } },
  },
];

// ── Archetypes ────────────────────────────────────────────────────────────────

interface ArchetypeInfo {
  name: string;
  emoji: string;
  tagline: string;
  traits: string[];
  color: string;
  glow: string;
}

const ARCHETYPES: Record<Archetype, ArchetypeInfo> = {
  midnight_architect: {
    name: "The Midnight Architect",
    emoji: "🌙",
    tagline: "Your best code ships when the world sleeps.",
    traits: ["Refactors at 2am", "Dark mode evangelist", "Has 47 open tabs", "Comments in verse"],
    color: "oklch(0.60 0.20 260)",
    glow: "rgba(99,102,241,0.4)",
  },
  ship_it_king: {
    name: "The Ship It King",
    emoji: "🚀",
    tagline: "Done is better than perfect. Always.",
    traits: ["Merges to main directly", "Todo comments since 2019", "Closes 10 issues before lunch", "Types fast, thinks faster"],
    color: "oklch(0.55 0.22 25)",
    glow: "rgba(239,68,68,0.4)",
  },
  pixel_perfectionist: {
    name: "The Pixel Perfectionist",
    emoji: "🔬",
    tagline: "1px off and you notice it in your sleep.",
    traits: ["CSS is an art form", "Spaces not tabs", "Rewrites PRs for fun", "Figma open 24/7"],
    color: "oklch(0.65 0.22 330)",
    glow: "rgba(236,72,153,0.4)",
  },
  rubber_duck_whisperer: {
    name: "The Rubber Duck Whisperer",
    emoji: "🦆",
    tagline: "You've explained it to the duck. The duck gets it.",
    traits: ["Thinks out loud", "Draws diagrams on everything", "Best pair programmer", "Documentation legend"],
    color: "oklch(0.65 0.18 80)",
    glow: "rgba(234,179,8,0.4)",
  },
  caffeine_compiler: {
    name: "The Caffeine Compiler",
    emoji: "☕",
    tagline: "Your code runs on coffee and chaos.",
    traits: ["3 cups before standup", "Tabs not spaces", "Runs on vibes", "Somehow it always works"],
    color: "oklch(0.60 0.18 45)",
    glow: "rgba(202,138,4,0.4)",
  },
  open_source_oracle: {
    name: "The Open Source Oracle",
    emoji: "🔮",
    tagline: "You've read every RFC. Twice.",
    traits: ["GitHub contributions streak", "Reads changelogs for fun", "Has opinions about semver", "The team's Stack Overflow"],
    color: "oklch(0.60 0.19 160)",
    glow: "rgba(16,185,129,0.4)",
  },
};

// ── Score tallying ────────────────────────────────────────────────────────────

function tally(answers: Choice[]): Archetype {
  const scores: Record<Archetype, number> = {
    midnight_architect: 0, ship_it_king: 0, pixel_perfectionist: 0,
    rubber_duck_whisperer: 0, caffeine_compiler: 0, open_source_oracle: 0,
  };
  for (const c of answers) {
    for (const [k, v] of Object.entries(c.scores)) {
      scores[k as Archetype] += v ?? 0;
    }
  }
  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as Archetype;
}

// ── Component ─────────────────────────────────────────────────────────────────

type Phase = "intro" | "quiz" | "result";

export function VibeCheck({ onClose }: { onClose: () => void }) {
  const [phase,    setPhase]    = useState<Phase>("intro");
  const [qIndex,   setQIndex]   = useState(0);
  const [answers,  setAnswers]  = useState<Choice[]>([]);
  const [result,   setResult]   = useState<Archetype | null>(null);
  const [copied,   setCopied]   = useState(false);
  const [chosen,   setChosen]   = useState<"a" | "b" | null>(null);

  const question = QUESTIONS[qIndex];
  const progress = qIndex / QUESTIONS.length;

  const pick = useCallback((choice: Choice, side: "a" | "b") => {
    setChosen(side);
    setTimeout(() => {
      const next = [...answers, choice];
      if (qIndex + 1 >= QUESTIONS.length) {
        setAnswers(next);
        setResult(tally(next));
        setPhase("result");
      } else {
        setAnswers(next);
        setQIndex(qIndex + 1);
        setChosen(null);
      }
    }, 320);
  }, [answers, qIndex]);

  const reset = () => {
    setPhase("intro");
    setQIndex(0);
    setAnswers([]);
    setResult(null);
    setChosen(null);
    setCopied(false);
  };

  const share = () => {
    if (!result) return;
    const info = ARCHETYPES[result];
    const text = `I just took the Dev Vibe Check on Jay's portfolio and I'm "${info.name}" ${info.emoji}\n\n"${info.tagline}"\n\nFind out your dev archetype → jay.dev`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast("📋 Copied to clipboard!", { description: "Share your archetype with the world.", duration: 3000 });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const info = result ? ARCHETYPES[result] : null;

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
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-background shadow-premium"
        >
          <div className="h-[3px] w-full gradient-primary" />

          {/* header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-card/80 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow text-lg">
                ✨
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Vibe Check</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {phase === "quiz" ? `Question ${qIndex + 1} of ${QUESTIONS.length}` : "Dev personality quiz"}
                </p>
              </div>
            </div>
            <button onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* progress bar */}
          {phase === "quiz" && (
            <div className="h-1 w-full bg-muted/30">
              <motion.div
                className="h-full gradient-primary"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          )}

          <div className="p-5">
            <AnimatePresence mode="wait">

              {/* intro */}
              {phase === "intro" && (
                <motion.div key="intro"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-5 py-4 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-6xl">✨</motion.div>
                  <div>
                    <p className="font-heading text-xl font-black text-foreground">What's your dev vibe?</p>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                      6 quick "this or that" choices. We'll reveal your developer archetype with a shareable badge.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 text-[11px]">
                    {Object.values(ARCHETYPES).map((a) => (
                      <span key={a.name}
                        className="rounded-full border border-border/40 bg-muted/30 px-2.5 py-1 text-muted-foreground">
                        {a.emoji} {a.name.split(" ").slice(1).join(" ")}
                      </span>
                    ))}
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setPhase("quiz")}
                    className="btn-shine flex items-center gap-2 rounded-xl gradient-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-glow">
                    Check My Vibe <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}

              {/* quiz */}
              {phase === "quiz" && (
                <motion.div key={`q-${qIndex}`}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="flex flex-col gap-5">
                  <p className="text-center text-lg font-black text-foreground">{question.q}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(["a", "b"] as const).map((side) => {
                      const choice = question[side];
                      const isChosen = chosen === side;
                      return (
                        <motion.button key={side}
                          onClick={() => !chosen && pick(choice, side)}
                          whileHover={!chosen ? { scale: 1.03, y: -2 } : {}}
                          whileTap={!chosen ? { scale: 0.97 } : {}}
                          animate={isChosen ? { scale: [1, 1.05, 1] } : {}}
                          className={cn(
                            "flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-200",
                            isChosen
                              ? "border-primary/50 bg-primary/10 shadow-glow"
                              : chosen
                                ? "border-border/20 bg-card/30 opacity-40"
                                : "cursor-pointer border-border/40 bg-card/60 hover:border-primary/40 hover:bg-card",
                          )}
                        >
                          <span className="text-4xl">{choice.emoji}</span>
                          <span className="text-[13px] font-semibold text-foreground leading-snug">{choice.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  {/* dot progress */}
                  <div className="flex justify-center gap-1.5">
                    {QUESTIONS.map((_, i) => (
                      <div key={i} className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i < qIndex ? "w-4 bg-primary" : i === qIndex ? "w-4 bg-primary/60" : "w-1.5 bg-muted",
                      )} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* result */}
              {phase === "result" && info && (
                <motion.div key="result"
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  className="flex flex-col items-center gap-4 py-2 text-center">

                  {/* archetype card */}
                  <div className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-5">
                    <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full blur-3xl opacity-25"
                      style={{ background: info.color }} />
                    <div className="relative">
                      <motion.div
                        animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-3 text-5xl">{info.emoji}</motion.div>
                      <p className="font-heading text-xl font-black text-foreground">{info.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground italic">"{info.tagline}"</p>
                    </div>
                  </div>

                  {/* traits */}
                  <div className="flex w-full flex-wrap justify-center gap-2">
                    {info.traits.map((t) => (
                      <span key={t}
                        className="rounded-full border border-border/40 bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* actions */}
                  <div className="flex w-full flex-col gap-2 mt-1">
                    <div className="flex gap-2">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={share}
                        className="btn-shine flex flex-1 items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow">
                        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                        {copied ? "Copied!" : "Share Result"}
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={reset}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-all">
                        <RotateCcw className="h-3.5 w-3.5" /> Retry
                      </motion.button>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { onClose(); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 300); }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/60 py-2.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-all">
                      <Mail className="h-3.5 w-3.5" /> Hire the {info.name.split(" ").slice(1).join(" ")} <ArrowRight className="h-3 w-3" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
