"use client";

import { useEffect } from "react";

const MIN_MS = 280;
const MAX_MS = 800;

/**
 * Holds a themed blank first paint (html[data-page-pending]), then reveals
 * the full shell once fonts are ready so navbar + hero never pop in separately.
 */
export function PageReveal() {
  useEffect(() => {
    const root = document.documentElement;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.pageReady = "true";
      root.removeAttribute("data-page-pending");
      return;
    }

    const started = performance.now();
    let finished = false;

    const reveal = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      window.setTimeout(() => {
        root.dataset.pageReady = "true";
        root.removeAttribute("data-page-pending");
      }, wait);
    };

    const cap = window.setTimeout(reveal, MAX_MS);

    const fonts = document.fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => requestAnimationFrame(reveal));
    } else {
      requestAnimationFrame(reveal);
    }

    return () => {
      finished = true;
      window.clearTimeout(cap);
    };
  }, []);

  return null;
}
