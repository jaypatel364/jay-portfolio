"use client";

import { useAccent } from "@/hooks/use-accent";
import { useTheme } from "@/hooks/use-theme";

/** True when theme + accent preferences are hydrated from client storage. */
export function useAppearanceReady() {
  const { mounted: themeReady } = useTheme();
  const { ready: accentReady } = useAccent();
  return themeReady && accentReady;
}
