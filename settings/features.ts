/**
 * Feature flags — toggles for sections, games, and effects.
 * Flip booleans here; no component edits needed for on/off.
 */

export const features = {
  // ── Sections / chrome ─────────────────────────────────────────────────────
  showTerminalHero: true,
  showLoadingScreen: false, // off for production: overlay does not help SEO and delays LCP
  showFAQ: true, // keep visible — FAQ JSON-LD is only injected when this is true

  // ── SEO indexing ──────────────────────────────────────────────────────────
  // false until jaypateldev.com is live and Search Console is verified. Flip last.
  allowIndexing: false,

  // ── Extra routes — keep off for launch; flip after the homepage is live ───
  showResumePage: false,
  showEngineeringPage: false,
  showCaseStudies: false,

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
