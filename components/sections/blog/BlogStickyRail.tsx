"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const TOP_OFFSET = 112; // clears fixed navbar (~top-28)

/**
 * Pins the right rail while the left article column scrolls,
 * then parks it at the bottom when that column ends.
 * JS sticky — SiteChrome `overflow-x-clip` breaks CSS `position: sticky`.
 */
export function BlogStickyRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"static" | "fixed" | "absolute">("static");
  const [railStyle, setRailStyle] = useState<CSSProperties | undefined>();

  useEffect(() => {
    const container = containerRef.current;
    const rail = railRef.current;
    if (!container || !rail) return;

    let raf = 0;

    const update = () => {
      const railHeight = rail.offsetHeight;
      const railWidth = container.offsetWidth;
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top + window.scrollY;
      const containerHeight = container.offsetHeight;
      const scrollY = window.scrollY;

      const stickStart = containerTop - TOP_OFFSET;
      const stickEnd = containerTop + containerHeight - railHeight - TOP_OFFSET;

      if (scrollY < stickStart || containerHeight <= railHeight + 8) {
        setMode("static");
        setRailStyle(undefined);
        return;
      }

      if (scrollY >= stickEnd) {
        setMode("absolute");
        setRailStyle({
          position: "absolute",
          top: Math.max(0, containerHeight - railHeight),
          left: 0,
          width: railWidth,
        });
        return;
      }

      setMode("fixed");
      setRailStyle({
        position: "fixed",
        top: TOP_OFFSET,
        left: containerRect.left,
        width: railWidth,
      });
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    const ro = new ResizeObserver(onScrollOrResize);
    ro.observe(container);
    ro.observe(rail);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative h-full min-w-0", className)}>
      <div
        ref={railRef}
        className={cn("space-y-4", mode === "static" && "sticky top-28")}
        style={railStyle}
      >
        {children}
      </div>
    </div>
  );
}
