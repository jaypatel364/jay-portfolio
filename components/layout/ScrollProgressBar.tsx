"use client";

import { useEffect, useRef } from "react";

/** Top progress bar — CSS transform only (no framer / no layout reads beyond scrollY). */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = barRef.current;
      if (!el) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? window.scrollY / docHeight : 0;
      el.style.transform = `scaleX(${pct})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left will-change-transform"
      style={{
        transform: "scaleX(0)",
        background:
          "linear-gradient(90deg, var(--primary) 0%, color-mix(in oklch, var(--primary) 70%, transparent) 100%)",
      }}
    />
  );
}
