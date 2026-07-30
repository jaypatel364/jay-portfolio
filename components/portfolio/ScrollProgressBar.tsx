"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  // useSpring gives a smooth lag-free follow
  const scaleX = useSpring(progress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(pct);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress(); // set on mount in case page is already scrolled
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--primary) 0%, color-mix(in oklch, var(--primary) 70%, transparent) 100%)",
      }}
    />
  );
}
