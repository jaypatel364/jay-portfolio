"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ScrollProgress {
  /** 0–100 overall page scroll percentage */
  percent: number;
  /** true once the user has scrolled past the page hero */
  pastHero: boolean;
}

/**
 * Tracks overall page scroll progress (0–100).
 * `pastHero` becomes true once scroll passes the first `#main > section`
 * (or one viewport if no section is found), which is when we show the navbar badge.
 *
 * Hero height is cached and only remeasured on resize/path change to avoid
 * forced reflow from getBoundingClientRect on every scroll tick.
 */
export function useScrollProgress(): ScrollProgress {
  const pathname = usePathname();
  const [state, setState] = useState<ScrollProgress>({ percent: 0, pastHero: false });
  const heroThresholdRef = useRef(0);

  useEffect(() => {
    const measureHero = () => {
      const main = document.getElementById("main");
      const firstSection = main?.querySelector("section");
      heroThresholdRef.current = firstSection
        ? Math.max(firstSection.getBoundingClientRect().height * 0.65, 120)
        : window.innerHeight;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      const pastHero = scrollTop > heroThresholdRef.current;
      setState((prev) =>
        prev.percent === percent && prev.pastHero === pastHero ? prev : { percent, pastHero },
      );
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    measureHero();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureHero, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureHero);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return state;
}
