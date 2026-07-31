"use client";

import { useState, useEffect } from "react";

interface ScrollProgress {
  /** 0–100 overall page scroll percentage */
  percent: number;
  /** true once the user has scrolled past the viewport height */
  pastHero: boolean;
}

/**
 * Tracks overall page scroll progress (0–100).
 * `pastHero` becomes true once scrollY > innerHeight,
 * which is when we want to show the navbar progress badge.
 */
export function useScrollProgress(): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({ percent: 0, pastHero: false });

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      const pastHero = scrollTop > window.innerHeight;
      setState({ percent, pastHero });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return state;
}
