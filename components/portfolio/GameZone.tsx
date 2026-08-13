"use client";

/**
 * GameZone — unified mini-game hub
 * ──────────────────────────────────────────────────────────────────────────
 * Fixes in this version:
 *  1. z-[9999999] + isolate — nothing bleeds through the backdrop
 *  2. body overflow locked while hub is open — no outside scroll
 *  3. Panel uses flex-col with a fixed max-height — header sticky, list scrolls
 *  4. Reflex category shows ALL reflex games including featured one
 *  5. More top padding (pt-16 sm:pt-20) so hub sits lower and feels spacious
 *  6. gamezone:open / gamezone:close events fired so CatchTheBug can pause
 *  7. NumberNinja + WordScramble added (10 games total)
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Gamepad2,
  Brain,
  Zap,
  Keyboard,
  Sparkles,
  Trophy,
  Play,
  Timer,
  Layers,
  Palette,
  Target,
  ChevronRight,
  Hash,
  Shuffle,
  Brush,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { BrainGame } from "@/components/portfolio/BrainGame";
import { CodeBreakerGame } from "@/components/portfolio/CodeBreakerGame";
import { ReactionTimeTest } from "@/components/portfolio/ReactionTimeTest";
import { EmojiMemory } from "@/components/portfolio/EmojiMemory";
import { ColorMatch } from "@/components/portfolio/ColorMatch";
import { StackBuild } from "@/components/portfolio/StackBuild";
import { DotCollector } from "@/components/portfolio/DotCollector";
import { NumberNinja } from "@/components/portfolio/NumberNinja";
import { WordScramble } from "@/components/portfolio/WordScramble";
import { VibeCheck } from "@/components/portfolio/VibeCheck";
import { GravityOrbs } from "@/components/portfolio/GravityOrbs";
import { PixelDrawRace } from "@/components/portfolio/PixelDrawRace";
import { cn } from "@/lib/utils";
import { TypingSpeedTest } from "./TypingSpeedTest";

// ── Types ─────────────────────────────────────────────────────────────────────

type Difficulty = "Easy" | "Medium" | "Hard" | "Any age";
type Category = "All" | "Reflex" | "Memory" | "Creative" | "Chill";

interface GameEntry {
  id: string;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  icon: React.ReactNode;
  difficulty: Difficulty;
  category: Category;
  color: string;
  glow: string;
  enabled: boolean;
  /** shown as hero card on the All tab AND as a normal row on its category tab */
  featured?: boolean;
  tags: string[];
}

// ── Game registry — add new games here ───────────────────────────────────────

const GAMES: GameEntry[] = [
  {
    id: "reaction",
    title: "Reaction Time Test",
    tagline: "How fast are your reflexes?",
    description:
      "Screen goes dark — wait for the green flash then click as fast as you can. 5 rounds, running average, personal rank.",
    emoji: "⚡",
    icon: <Timer className="h-5 w-5" />,
    difficulty: "Any age",
    category: "Reflex",
    color: "oklch(0.55 0.22 25)",
    glow: "rgba(239,68,68,0.4)",
    enabled: siteConfig.showReactionTest,
    featured: true,
    tags: ["Reflex", "Speed", "Rank"],
  },
  {
    id: "emoji",
    title: "Emoji Memory Flip",
    tagline: "Find all the matching pairs.",
    description:
      "16 face-down emoji cards, 8 pairs hidden. Flip two at a time — fewest moves wins.",
    emoji: "🃏",
    icon: <span className="text-xl leading-none">🃏</span>,
    difficulty: "Easy",
    category: "Memory",
    color: "oklch(0.60 0.19 160)",
    glow: "rgba(16,185,129,0.4)",
    enabled: siteConfig.showEmojiMemory,
    tags: ["Memory", "Logic", "Chill"],
  },
  {
    id: "colormatch",
    title: "Color Match Blitz",
    tagline: "Match the swatch before time runs out.",
    description:
      "A target color flashes — tap the matching swatch from 4 options before 3 seconds. Gets sneakier every round.",
    emoji: "🎨",
    icon: <Palette className="h-5 w-5" />,
    difficulty: "Medium",
    category: "Reflex",
    color: "oklch(0.65 0.22 330)",
    glow: "rgba(236,72,153,0.4)",
    enabled: siteConfig.showColorMatch,
    tags: ["Perception", "Speed", "Color"],
  },
  {
    id: "dotcollector",
    title: "Dot Collector",
    tagline: "Click every dot before it vanishes.",
    description:
      "Glowing dots pop and shrink. Click them before they disappear. Combos earn bonus points. 30-second frenzy.",
    emoji: "🎯",
    icon: <Target className="h-5 w-5" />,
    difficulty: "Any age",
    category: "Reflex",
    color: "oklch(0.60 0.20 220)",
    glow: "rgba(6,182,212,0.4)",
    enabled: siteConfig.showDotCollector,
    tags: ["Speed", "Clicking", "Frenzy"],
  },
  {
    id: "numberninja",
    title: "Number Ninja",
    tagline: "Solve the equation. Fast.",
    description:
      "A math equation appears — pick the correct answer from 4 options before 3 seconds run out. Gets harder as you score.",
    emoji: "🥷",
    icon: <Hash className="h-5 w-5" />,
    difficulty: "Any age",
    category: "Reflex",
    color: "oklch(0.60 0.20 260)",
    glow: "rgba(99,102,241,0.4)",
    enabled: siteConfig.showNumberNinja,
    tags: ["Math", "Speed", "Blitz"],
  },
  {
    id: "wordscramble",
    title: "Word Scramble",
    tagline: "Unscramble the jumbled tech word.",
    description:
      "A tech word gets scrambled — type the correct word before 10 seconds run out. Streak combos earn bonus points.",
    emoji: "🔀",
    icon: <Shuffle className="h-5 w-5" />,
    difficulty: "Easy",
    category: "Creative",
    color: "oklch(0.65 0.18 140)",
    glow: "rgba(132,204,22,0.4)",
    enabled: siteConfig.showWordScramble,
    tags: ["Words", "Spelling", "Streak"],
  },
  {
    id: "stack",
    title: "Stack & Build",
    tagline: "Drop blocks, build the tallest tower.",
    description:
      "A block swings left-right. Click to drop it. Overhang gets cut off. Miss completely — game over. Gets faster.",
    emoji: "🏗️",
    icon: <Layers className="h-5 w-5" />,
    difficulty: "Medium",
    category: "Chill",
    color: "oklch(0.65 0.18 80)",
    glow: "rgba(234,179,8,0.4)",
    enabled: siteConfig.showStackBuild,
    tags: ["Timing", "Arcade", "Classic"],
  },
  {
    id: "brain",
    title: "Jay's Brain",
    tagline: "Explore the mind behind the code.",
    description:
      "20 floating skill nodes drift across a canvas. Click each to unlock a real story from Jay's dev journey.",
    emoji: "🧠",
    icon: <Brain className="h-5 w-5" />,
    difficulty: "Any age",
    category: "Chill",
    color: "oklch(0.72 0.17 45)",
    glow: "rgba(202,138,4,0.4)",
    enabled: siteConfig.showBrainGame,
    tags: ["Explorer", "Skills", "Chill"],
  },
  {
    id: "codebreaker",
    title: "Code Breaker",
    tagline: "Mirror the sequence. Beat the clock.",
    description:
      "A 3×3 grid of glowing tiles lights up — mirror the sequence back exactly. Speed increases every round.",
    emoji: "🔢",
    icon: <Zap className="h-5 w-5" />,
    difficulty: "Medium",
    category: "Memory",
    color: "oklch(0.60 0.20 260)",
    glow: "rgba(99,102,241,0.4)",
    enabled: siteConfig.showCodeBreaker,
    tags: ["Reflex", "Memory", "High Score"],
  },
  {
    id: "typing",
    title: "Typing Speed Test",
    tagline: "Type Jay's actual code. Fast.",
    description:
      "Race through real snippets from Jay's codebase. Live WPM + accuracy. Six snippets: hooks, APIs, Prisma, Socket.io.",
    emoji: "⌨️",
    icon: <Keyboard className="h-5 w-5" />,
    difficulty: "Any age",
    category: "Creative",
    color: "oklch(0.60 0.19 160)",
    glow: "rgba(16,185,129,0.4)",
    enabled: siteConfig.showTypingTest,
    tags: ["Typing", "Speed", "WPM"],
  },
  {
    id: "vibecheck",
    title: "Vibe Check",
    tagline: "What's your developer archetype?",
    description:
      "6 'this or that' choices reveal your dev personality — Midnight Architect, Ship It King, and more. Shareable badge.",
    emoji: "✨",
    icon: <Sparkles className="h-5 w-5" />,
    difficulty: "Any age",
    category: "Creative",
    color: "oklch(0.65 0.22 300)",
    glow: "rgba(168,85,247,0.4)",
    enabled: siteConfig.showVibeCheck,
    tags: ["Personality", "Fun", "Shareable"],
  },
  {
    id: "gravityorbs",
    title: "Gravity Orbs",
    tagline: "Attract. Burst. Repeat.",
    description:
      "Colourful physics orbs float on screen. Move your cursor to attract them — click to burst into smaller ones. 30s of pure satisfaction.",
    emoji: "🔮",
    icon: <span className="text-xl leading-none">🔮</span>,
    difficulty: "Any age",
    category: "Chill",
    color: "oklch(0.60 0.20 260)",
    glow: "rgba(99,102,241,0.4)",
    enabled: siteConfig.showGravityOrbs,
    tags: ["Physics", "Satisfying", "Cursor"],
  },
  {
    id: "pixeldraw",
    title: "Pixel Draw Race",
    tagline: "Recreate the pixel art. Fast.",
    description:
      "An 8×8 pixel silhouette appears. Recreate it cell by cell before 20 seconds run out. Match % and star rating at the end.",
    emoji: "🎨",
    icon: <Brush className="h-5 w-5" />,
    difficulty: "Easy",
    category: "Creative",
    color: "oklch(0.65 0.18 25)",
    glow: "rgba(234,88,12,0.4)",
    enabled: siteConfig.showPixelDraw,
    tags: ["Creative", "Art", "Accuracy"],
  },
];

const CATEGORIES: Category[] = ["All", "Reflex", "Memory", "Creative", "Chill"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function DiffBadge({ level }: { level: Difficulty }) {
  const map: Record<Difficulty, string> = {
    "Any age": "bg-emerald-500/12 text-emerald-500 border-emerald-500/20",
    Easy: "bg-sky-500/12 text-sky-500 border-sky-500/20",
    Medium: "bg-amber-500/12 text-amber-500 border-amber-500/20",
    Hard: "bg-red-500/12 text-red-500 border-red-500/20",
  };
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
        map[level],
      )}
    >
      {level}
    </span>
  );
}

// ── Featured hero card (All tab only) ────────────────────────────────────────

function FeaturedCard({ game, onPlay }: { game: GameEntry; onPlay: (id: string) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={() => onPlay(game.id)}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card/80"
      style={{ boxShadow: hov ? `0 0 40px -8px ${game.glow}` : undefined }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl opacity-20"
        style={{ background: game.color }}
      />

      <div className="relative flex items-center gap-4 p-4 sm:p-5">
        <motion.div
          animate={hov ? { scale: 1.08, rotate: -8 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl"
          style={{ background: `${game.color}18`, border: `1.5px solid ${game.color}35` }}
        >
          {game.emoji}
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
              ⭐ Recommended
            </span>
            <DiffBadge level={game.difficulty} />
          </div>
          <p className="mt-1.5 font-heading text-base font-black text-foreground leading-tight">
            {game.title}
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground leading-snug">
            {game.description}
          </p>
        </div>

        <motion.div
          animate={hov ? { x: 3, opacity: 1 } : { x: 0, opacity: 0.6 }}
          className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-glow"
        >
          <Play className="h-4 w-4 fill-white text-white" />
        </motion.div>
      </div>

      <motion.div
        className="h-[2px] w-full"
        animate={{ scaleX: hov ? 1 : 0.25, opacity: hov ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(90deg,${game.color},${game.color}44)`,
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );
}

// ── Compact game row ──────────────────────────────────────────────────────────

function GameRow({
  game,
  index,
  onPlay,
}: {
  game: GameEntry;
  index: number;
  onPlay: (id: string) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: index * 0.025, ease: "easeOut" }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={() => game.enabled && onPlay(game.id)}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border p-3 transition-all duration-200",
        game.enabled
          ? "cursor-pointer border-border/40 bg-card/50 hover:border-primary/30 hover:bg-card/80"
          : "cursor-not-allowed border-border/20 bg-card/20 opacity-40",
      )}
      style={{ boxShadow: hov && game.enabled ? `0 0 20px -6px ${game.glow}` : undefined }}
    >
      {/* left accent bar */}
      <motion.div
        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
        animate={{ opacity: hov && game.enabled ? 1 : 0.15, scaleY: hov ? 1 : 0.5 }}
        transition={{ duration: 0.18 }}
        style={{ background: game.color, transformOrigin: "center" }}
      />

      {/* icon */}
      <motion.div
        className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
        style={{ background: `${game.color}15`, border: `1px solid ${game.color}25` }}
        animate={hov && game.enabled ? { scale: 1.08 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {game.emoji}
      </motion.div>

      {/* text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-bold text-foreground">{game.title}</p>
          <DiffBadge level={game.difficulty} />
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{game.tagline}</p>
      </div>

      {/* tags */}
      <div className="hidden shrink-0 items-center gap-1 sm:flex">
        {game.tags.slice(0, 2).map((t) => (
          <span
            key={t}
            className="rounded border border-border/30 bg-muted/30 px-1.5 py-0.5 text-[9px] text-muted-foreground/60"
          >
            {t}
          </span>
        ))}
      </div>

      {/* chevron */}
      <motion.div
        animate={hov && game.enabled ? { x: 2, opacity: 1 } : { x: 0, opacity: 0.25 }}
        className="shrink-0"
      >
        <ChevronRight className="h-4 w-4" style={{ color: hov ? game.color : "currentColor" }} />
      </motion.div>
    </motion.div>
  );
}

// ── Hub modal ─────────────────────────────────────────────────────────────────

function GameZoneHub({ onClose }: { onClose: () => void }) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Category>("All");
  const scrollRef = useRef<HTMLDivElement>(null);

  const enabledCount = GAMES.filter((g) => g.enabled).length;
  const featured = GAMES.find((g) => g.featured && g.enabled);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ── Notify CatchTheBug a game is active ───────────────────────────────────
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("gamezone:open"));
    return () => {
      window.dispatchEvent(new CustomEvent("gamezone:close"));
    };
  }, []);

  // Escape → close hub (only when no child game is open)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !activeGame) onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, activeGame]);

  // ── Category filter ───────────────────────────────────────────────────────
  // "All" tab: shows featured hero + rest (excluding featured from rows)
  // Category tabs: show ALL matching games including the featured one as a normal row
  const rows = useMemo(() => {
    if (activeTab === "All") return GAMES.filter((g) => g.enabled && !g.featured);
    return GAMES.filter((g) => g.enabled && g.category === activeTab);
  }, [activeTab]);

  // Tab counts — include featured in its category count
  const tabCount = (cat: Category) =>
    cat === "All"
      ? GAMES.filter((g) => g.enabled).length
      : GAMES.filter((g) => g.enabled && g.category === cat).length;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const openGame = (id: string) => setActiveGame(id);
  const closeGame = () => setActiveGame(null);

  return (
    <>
      {/* ── Overlay — z-[9999999] isolate ensures nothing bleeds through ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999999] isolate"
      >
        {/* blurred backdrop */}
        <div className="absolute inset-0 bg-background/88 backdrop-blur-xl" onClick={onClose} />

        {/* centred panel with generous top padding */}
        <div className="absolute inset-0 flex items-center justify-center px-4 pt-16 pb-6 sm:px-6 sm:pt-20">
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-premium"
            style={{ maxHeight: "min(86vh, 740px)" }}
          >
            {/* accent bar */}
            <div className="h-[3px] w-full shrink-0 gradient-primary" />

            {/* ── sticky header ── */}
            <div className="shrink-0 border-b border-border/50 bg-card/90 px-5 py-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
                    <Gamepad2 className="h-4 w-4 text-primary-foreground" />
                    <motion.span
                      className="absolute inset-0 rounded-xl gradient-primary"
                      animate={{ scale: [1, 1.45, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading text-base font-black leading-none text-foreground">
                        Game Zone
                      </p>
                      <span className="flex items-center gap-1 rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[9px] font-bold text-primary">
                        <Sparkles className="h-2 w-2" />
                        {enabledCount}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Pick a game. Any age. Any skill.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 sm:flex">
                    <Trophy className="h-3 w-3 text-primary" />
                    <span className="text-[10px] text-muted-foreground">All skill levels</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* category tabs */}
              <div
                className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5"
                style={{ scrollbarWidth: "none" }}
              >
                {CATEGORIES.map((cat) => {
                  const count = tabCount(cat);
                  if (cat !== "All" && count === 0) return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className={cn(
                        "shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all",
                        activeTab === cat
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/30 bg-muted/20 text-muted-foreground hover:border-primary/20 hover:text-foreground",
                      )}
                    >
                      {cat}{" "}
                      <span className={activeTab === cat ? "opacity-60" : "opacity-40"}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── scrollable game list ── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5"
              style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
            >
              {/* ambient glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/4 blur-[72px]" />

              <div className="relative flex flex-col gap-3">
                {/* featured hero — All tab only */}
                {activeTab === "All" && featured && (
                  <div className="mb-1">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                      Start here
                    </p>
                    <FeaturedCard game={featured} onPlay={openGame} />
                  </div>
                )}

                {/* section label + rows — keyed by tab so the whole block fades together */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="flex flex-col gap-3"
                  >
                    {rows.length > 0 && (
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                        {activeTab === "All" ? "All games" : activeTab}
                      </p>
                    )}

                    {rows.map((game, i) => (
                      <GameRow key={game.id} game={game} index={i} onPlay={openGame} />
                    ))}

                    {rows.length === 0 && activeTab !== "All" && (
                      <div className="py-10 text-center text-sm text-muted-foreground/40">
                        No games in this category yet.
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <p className="pt-2 text-center text-[10px] text-muted-foreground/30">
                  More games coming soon · Press{" "}
                  <kbd className="rounded border border-border/40 px-1 py-px text-[9px]">Esc</kbd>{" "}
                  to close
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Individual game modals — rendered outside panel, same z-layer ── */}
      <AnimatePresence>
        {activeGame === "brain" && <BrainGame key="brain" onClose={closeGame} />}
        {activeGame === "codebreaker" && <CodeBreakerGame key="cb" onClose={closeGame} />}
        {activeGame === "typing" && <TypingSpeedTest key="type" onClose={closeGame} />}
        {activeGame === "reaction" && <ReactionTimeTest key="reaction" onClose={closeGame} />}
        {activeGame === "emoji" && <EmojiMemory key="emoji" onClose={closeGame} />}
        {activeGame === "colormatch" && <ColorMatch key="color" onClose={closeGame} />}
        {activeGame === "stack" && <StackBuild key="stack" onClose={closeGame} />}
        {activeGame === "dotcollector" && <DotCollector key="dots" onClose={closeGame} />}
        {activeGame === "numberninja" && <NumberNinja key="ninja" onClose={closeGame} />}
        {activeGame === "wordscramble" && <WordScramble key="words" onClose={closeGame} />}
        {activeGame === "vibecheck" && <VibeCheck key="vibe" onClose={closeGame} />}
        {activeGame === "gravityorbs" && <GravityOrbs key="gravity" onClose={closeGame} />}
        {activeGame === "pixeldraw" && <PixelDrawRace key="pixel" onClose={closeGame} />}
      </AnimatePresence>
    </>
  );
}

// ── Trigger button ────────────────────────────────────────────────────────────

export function GameZoneTrigger() {
  const [open, setOpen] = useState(false);
  const enabledCount = GAMES.filter((g) => g.enabled).length;

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-primary/30 bg-primary/8 px-6 py-3.5 font-bold text-primary shadow-glow transition-all hover:border-primary/60 hover:bg-primary/12 hover:shadow-[0_0_28px_-4px_var(--glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative flex h-7 w-7 items-center justify-center rounded-lg gradient-primary shadow-glow">
          <motion.span
            className="absolute inset-0 rounded-lg gradient-primary"
            animate={{ scale: [1, 1.55, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Gamepad2 className="relative h-4 w-4 text-primary-foreground" />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="text-[13px] font-black tracking-tight">Game Zone</span>
          <span className="mt-0.5 text-[10px] font-normal text-primary/70">
            {enabledCount} games available
          </span>
        </span>
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm text-primary/60"
        >
          →
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && <GameZoneHub key="gz-hub" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
