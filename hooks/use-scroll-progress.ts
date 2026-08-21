"use client";

import { useState, useEffect } from "react";
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
 */
export function useScrollProgress(): ScrollProgress {
  const pathname = usePathname();
  const [state, setState] = useState<ScrollProgress>({ percent: 0, pastHero: false });

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      const main = document.getElementById("main");
      const firstSection = main?.querySelector("section");
      const heroThreshold = firstSection
        ? Math.max(firstSection.getBoundingClientRect().height * 0.65, 120)
        : window.innerHeight;
      const pastHero = scrollTop > heroThreshold;

      setState({ percent, pastHero });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  return state;
}
