"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TerminalBlockLazy = lazy(() =>
  import("./TerminalBlock").then((m) => ({ default: m.TerminalBlock })),
);

/** Same height as the booted terminal so nothing shifts when it swaps in. */
function TerminalSkeleton() {
  return (
    <div
      className="h-[326px] w-full rounded-2xl border border-border bg-card lg:h-[404px]"
      aria-hidden="true"
    />
  );
}

/**
 * Drop-in terminal for any section. Loads the chunk only once the panel is near
 * the viewport, and never renders on the server — the boot lines contain a live
 * date, so SSR output would not match hydration.
 */
export function TerminalPanel({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {visible ? (
        <Suspense fallback={<TerminalSkeleton />}>
          <TerminalBlockLazy />
        </Suspense>
      ) : (
        <TerminalSkeleton />
      )}
    </div>
  );
}
