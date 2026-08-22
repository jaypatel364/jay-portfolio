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

const VALID_ACCENT_IDS = new Set(ACCENT_PRESETS.map((p) => p.id));

/** Normalize unknown ids (bad cookie / storage) to the default preset. */
export function resolveAccentId(id: string | null | undefined): string {
  if (id && VALID_ACCENT_IDS.has(id)) return id;
  return DEFAULT_ACCENT_ID;
}

export function getAccentPreset(id: string | null | undefined): AccentPreset {
  const safe = resolveAccentId(id);
  return ACCENT_PRESETS.find((p) => p.id === safe) ?? ACCENT_PRESETS[0];
}

/** Blocking CSS for every accent — applied via html[data-accent] (survives hydration). */
export function buildAccentBootCss(): string {
  const blocks: string[] = [];

  for (const preset of ACCENT_PRESETS) {
    const light = Object.entries(preset.light)
      .map(([key, value]) => `${key}:${value}`)
      .join(";");
    blocks.push(`html[data-accent="${preset.id}"]{${light}}`);

    const dark = Object.entries(preset.dark)
      .map(([key, value]) => `${key}:${value}`)
      .join(";");
    blocks.push(`html.dark[data-accent="${preset.id}"]{${dark}}`);
  }

  return blocks.join("");
}

/** Read persisted accent on the client (localStorage wins over html attribute). */
export function readStoredAccentId(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT_ID;

  try {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (stored) return resolveAccentId(stored);
  } catch {
    /* private mode / blocked storage */
  }

  return resolveAccentId(document.documentElement.dataset.accent);
}

/** Persist accent for SSR (cookie), client storage, and immediate paint (data-accent). */
export function persistAccentChoice(id: string): string {
  const safe = resolveAccentId(id);

  if (typeof document !== "undefined") {
    document.documentElement.dataset.accent = safe;

    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, safe);
    } catch {
      /* ignore */
    }

    document.cookie = `${ACCENT_STORAGE_KEY}=${encodeURIComponent(safe)};path=/;max-age=31536000;SameSite=Lax`;
  }

  return safe;
}
