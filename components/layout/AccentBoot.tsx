"use client";

import { useLayoutEffect } from "react";
import { persistAccentChoice, readStoredAccentId } from "@/lib/accent-colors";

/** Ensures data-accent matches storage before paint (provider handles picker state). */
export function AccentBoot() {
  useLayoutEffect(() => {
    persistAccentChoice(readStoredAccentId());
  }, []);

  return null;
}
