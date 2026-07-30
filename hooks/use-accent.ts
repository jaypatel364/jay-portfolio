"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT_ID,
  ACCENT_STORAGE_KEY,
  type AccentPreset,
} from "@/lib/accent-colors";

function applyAccent(preset: AccentPreset, isDark: boolean) {
  const vars = isDark ? preset.dark : preset.light;
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function useAccent(resolvedTheme: "light" | "dark") {
  const [accentId, setAccentIdState] = useState<string>(DEFAULT_ACCENT_ID);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(ACCENT_STORAGE_KEY) ?? DEFAULT_ACCENT_ID;
    const preset = ACCENT_PRESETS.find((p) => p.id === saved) ?? ACCENT_PRESETS[0];
    setAccentIdState(preset.id);
    applyAccent(preset, resolvedTheme === "dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Also respond to storage events fired from CommandPalette
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== ACCENT_STORAGE_KEY || !e.newValue) return;
      const preset = ACCENT_PRESETS.find((p) => p.id === e.newValue) ?? ACCENT_PRESETS[0];
      setAccentIdState(preset.id);
      applyAccent(preset, resolvedTheme === "dark");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [resolvedTheme]);

  // Re-apply whenever the dark/light theme changes
  useEffect(() => {
    const preset = ACCENT_PRESETS.find((p) => p.id === accentId) ?? ACCENT_PRESETS[0];
    applyAccent(preset, resolvedTheme === "dark");
  }, [resolvedTheme, accentId]);

  const setAccent = useCallback(
    (id: string) => {
      const preset = ACCENT_PRESETS.find((p) => p.id === id) ?? ACCENT_PRESETS[0];
      setAccentIdState(preset.id);
      localStorage.setItem(ACCENT_STORAGE_KEY, preset.id);
      applyAccent(preset, resolvedTheme === "dark");
    },
    [resolvedTheme],
  );

  return { accentId, setAccent };
}
