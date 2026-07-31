/**
 * Accent color presets.
 * Each preset overrides only the primary/glow/ring CSS variables.
 * All other design tokens (background, card, border…) are untouched.
 */

export interface AccentPreset {
  id: string;
  label: string;
  /** Tailwind-compatible preview color for the swatch dot */
  swatch: string;
  /** CSS variable overrides injected on :root */
  light: Record<string, string>;
  dark: Record<string, string>;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    id: "amber",
    label: "Amber",
    swatch: "#f59e0b",
    light: {
      "--primary": "oklch(0.65 0.18 45)",
      "--glow": "oklch(0.75 0.15 45)",
      "--ring": "oklch(0.65 0.18 45)",
    },
    dark: {
      "--primary": "oklch(0.72 0.17 45)",
      "--glow": "oklch(0.72 0.17 45)",
      "--ring": "oklch(0.72 0.17 45)",
    },
  },
  {
    id: "violet",
    label: "Violet",
    swatch: "#7c3aed",
    light: {
      "--primary": "oklch(0.55 0.22 295)",
      "--glow": "oklch(0.65 0.18 295)",
      "--ring": "oklch(0.55 0.22 295)",
    },
    dark: {
      "--primary": "oklch(0.68 0.20 295)",
      "--glow": "oklch(0.68 0.20 295)",
      "--ring": "oklch(0.68 0.20 295)",
    },
  },
  {
    id: "cyan",
    label: "Cyan",
    swatch: "#06b6d4",
    light: {
      "--primary": "oklch(0.60 0.16 210)",
      "--glow": "oklch(0.70 0.13 210)",
      "--ring": "oklch(0.60 0.16 210)",
    },
    dark: {
      "--primary": "oklch(0.72 0.15 210)",
      "--glow": "oklch(0.72 0.15 210)",
      "--ring": "oklch(0.72 0.15 210)",
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    swatch: "#10b981",
    light: {
      "--primary": "oklch(0.60 0.18 160)",
      "--glow": "oklch(0.70 0.15 160)",
      "--ring": "oklch(0.60 0.18 160)",
    },
    dark: {
      "--primary": "oklch(0.72 0.17 160)",
      "--glow": "oklch(0.72 0.17 160)",
      "--ring": "oklch(0.72 0.17 160)",
    },
  },
  {
    id: "rose",
    label: "Rose",
    swatch: "#f43f5e",
    light: {
      "--primary": "oklch(0.60 0.22 10)",
      "--glow": "oklch(0.70 0.18 10)",
      "--ring": "oklch(0.60 0.22 10)",
    },
    dark: {
      "--primary": "oklch(0.70 0.20 10)",
      "--glow": "oklch(0.70 0.20 10)",
      "--ring": "oklch(0.70 0.20 10)",
    },
  },
];

export const DEFAULT_ACCENT_ID = "violet";
export const ACCENT_STORAGE_KEY = "portfolio-accent";
