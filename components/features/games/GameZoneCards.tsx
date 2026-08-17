"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Difficulty, GameEntry } from "./game-registry";

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

export { DiffBadge, FeaturedCard, GameRow };
