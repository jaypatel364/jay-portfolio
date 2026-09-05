/**
 * Feature flags — toggles for sections, games, and effects.
 * Flip booleans here; no component edits needed for on/off.
 */

export const features = {
  // ── Sections / chrome ─────────────────────────────────────────────────────
  showTerminal: true, // interactive terminal — lives in the About section (desktop only)
  showHeroAvailability: true, // "Available for freelance work" pill above the hero headline
  showLoadingScreen: false, // off for production: overlay does not help SEO and delays LCP
  showFAQ: true, // keep visible — FAQ JSON-LD is only injected when this is true

  // ── SEO indexing ──────────────────────────────────────────────────────────
  // true = allow Google/Bing. Keep Search Console verified on jaypateldev.com.
  allowIndexing: true,

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
