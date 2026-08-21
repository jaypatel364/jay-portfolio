"use client";

/**
 * GameZone — unified mini-game hub
 */

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { GAMES, CATEGORIES, type Category } from "./game-registry";
import { FeaturedCard, GameRow } from "./GameZoneCards";

const BrainGame = dynamic(() => import("./BrainGame").then((m) => ({ default: m.BrainGame })));
const CodeBreakerGame = dynamic(() =>
  import("./CodeBreakerGame").then((m) => ({ default: m.CodeBreakerGame })),
);
const TypingSpeedTest = dynamic(() =>
  import("./TypingSpeedTest").then((m) => ({ default: m.TypingSpeedTest })),
);
const ReactionTimeTest = dynamic(() =>
  import("./ReactionTimeTest").then((m) => ({ default: m.ReactionTimeTest })),
);
const EmojiMemory = dynamic(() =>
  import("./EmojiMemory").then((m) => ({ default: m.EmojiMemory })),
);
const ColorMatch = dynamic(() => import("./ColorMatch").then((m) => ({ default: m.ColorMatch })));
const StackBuild = dynamic(() => import("./StackBuild").then((m) => ({ default: m.StackBuild })));
const DotCollector = dynamic(() =>
  import("./DotCollector").then((m) => ({ default: m.DotCollector })),
);
const NumberNinja = dynamic(() =>
  import("./NumberNinja").then((m) => ({ default: m.NumberNinja })),
);
const WordScramble = dynamic(() =>
  import("./WordScramble").then((m) => ({ default: m.WordScramble })),
);
const VibeCheck = dynamic(() => import("./VibeCheck").then((m) => ({ default: m.VibeCheck })));
const GravityOrbs = dynamic(() =>
  import("./GravityOrbs").then((m) => ({ default: m.GravityOrbs })),
);
const PixelDrawRace = dynamic(() =>
  import("./PixelDrawRace").then((m) => ({ default: m.PixelDrawRace })),
);

// ── Hub modal ─────────────────────────────────────────────────────────────────

export function GameZoneHub({ onClose }: { onClose: () => void }) {
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
