/**
 * Feature flags — toggles for sections, games, and effects.
 * Flip booleans here; no component edits needed for on/off.
 */

export const features = {
  // ── Sections / chrome ─────────────────────────────────────────────────────
  showTerminalHero: true,
  showLoadingScreen: true,
  showFAQ: true,

  // ── SEO indexing ──────────────────────────────────────────────────────────
  // false while building/staging; true when live on the real domain.
  allowIndexing: false,

  // ── Game Zone ─────────────────────────────────────────────────────────────
  showGameZone: true,
  showBrainGame: true,
  showCodeBreaker: true,
  showTypingTest: true,
  showReactionTest: true,
  showEmojiMemory: true,
  showColorMatch: true,
  showStackBuild: false, // hidden (replaced soon)
  showDotCollector: true,
  showNumberNinja: false, // hidden (replaced soon)
  showWordScramble: true,
  showVibeCheck: true,
  showGravityOrbs: true,
  showPixelDraw: true,

  // ── Easter eggs & effects ─────────────────────────────────────────────────
  showCatchTheBug: true,

  // "none" | "particles" | "ripple" | "magnetic" | "lightning" | "pixelate"
  cursorEffect: "none" as import("@/components/effects/CursorTrail").CursorEffectMode,
} as const;
