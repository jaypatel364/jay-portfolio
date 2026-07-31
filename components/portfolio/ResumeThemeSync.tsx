"use client";

import { useEffect } from "react";
import { ACCENT_PRESETS, DEFAULT_ACCENT_ID, ACCENT_STORAGE_KEY } from "@/lib/accent-colors";

/**
 * Syncs the user's saved theme + accent color onto the resume page.
 * The /resume route is a standalone server component with no ThemeProvider,
 * so this tiny client component handles both on mount.
 * Renders nothing — purely a side-effect component.
 */
export function ResumeThemeSync() {
  useEffect(() => {
    const root = document.documentElement;

    // ── 1. Theme (dark / light) ──────────────────────────────────────
    const savedTheme = localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      savedTheme === "dark" ||
      ((!savedTheme || savedTheme === "system") && prefersDark);

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // ── 2. Accent color ──────────────────────────────────────────────
    const savedAccent = localStorage.getItem(ACCENT_STORAGE_KEY) ?? DEFAULT_ACCENT_ID;
    const preset =
      ACCENT_PRESETS.find((p) => p.id === savedAccent) ?? ACCENT_PRESETS[0];
    const vars = isDark ? preset.dark : preset.light;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  return null;
}
