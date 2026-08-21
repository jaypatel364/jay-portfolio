"use client";

/**
 * Lightweight Game Zone CTA — hub + games load only after the user opens it.
 */

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const GameZoneHub = dynamic(() => import("./GameZone").then((m) => ({ default: m.GameZoneHub })));

const ENABLED_COUNT = [
  siteConfig.showReactionTest,
  siteConfig.showEmojiMemory,
  siteConfig.showColorMatch,
  siteConfig.showBrainGame,
  siteConfig.showCodeBreaker,
  siteConfig.showTypingTest,
  siteConfig.showStackBuild,
  siteConfig.showDotCollector,
  siteConfig.showNumberNinja,
  siteConfig.showWordScramble,
  siteConfig.showVibeCheck,
  siteConfig.showGravityOrbs,
  siteConfig.showPixelDraw,
].filter(Boolean).length;

export function GameZoneTrigger() {
  const [open, setOpen] = useState(false);

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
            {ENABLED_COUNT} games available
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
