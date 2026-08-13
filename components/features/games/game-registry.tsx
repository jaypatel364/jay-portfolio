"use client";

import {
  Brain,
  Zap,
  Keyboard,
  Sparkles,
  Timer,
  Layers,
  Palette,
  Target,
  Hash,
  Shuffle,
  Brush,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

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

export type { Difficulty, Category, GameEntry };
export { GAMES, CATEGORIES };
