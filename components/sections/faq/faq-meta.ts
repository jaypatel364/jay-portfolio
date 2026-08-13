import type { FAQCategory } from "@/lib/site-config";

// ─── Category meta ────────────────────────────────────────────────────────────

const CATEGORY_META: Record<FAQCategory | "all", { label: string; color: string; glow: string }> = {
  all: {
    label: "All",
    color: "var(--primary)",
    glow: "color-mix(in oklch, var(--primary) 18%, transparent)",
  },
  work: {
    label: "Work",
    color: "oklch(0.68 0.18 160)",
    glow: "oklch(0.68 0.18 160 / 0.18)",
  },
  tech: {
    label: "Tech",
    color: "oklch(0.65 0.19 250)",
    glow: "oklch(0.65 0.19 250 / 0.18)",
  },
  personal: {
    label: "Personal",
    color: "oklch(0.70 0.18 330)",
    glow: "oklch(0.70 0.18 330 / 0.18)",
  },
  process: {
    label: "Process",
    color: "oklch(0.72 0.17 45)",
    glow: "oklch(0.72 0.17 45 / 0.18)",
  },
};

type Filter = FAQCategory | "all";

export type { Filter };
export { CATEGORY_META };
