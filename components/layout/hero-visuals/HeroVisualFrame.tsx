import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroVisualFrameProps {
  children: ReactNode;
  className?: string;
  /** Accessible name for decorative compositions. Omit when the visual has its own interactive labels. */
  label?: string;
  /** Let inner art (e.g. orbiting icons) sit past the card edge without clipping. */
  overflowVisible?: boolean;
}

/** Shared canvas for inner-page hero art — matches the site card language. */
export function HeroVisualFrame({
  children,
  className,
  label,
  overflowVisible = false,
}: HeroVisualFrameProps) {
  return (
    <div
      aria-label={label}
      className={cn(
        "relative isolate min-h-[280px] w-full rounded-2xl border-2 border-primary/25 bg-card shadow-premium",
        overflowVisible ? "overflow-visible" : "overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit]",
          overflowVisible && "overflow-hidden",
        )}
        aria-hidden
      >
        <div className="absolute inset-0 bg-grid opacity-35" />
        <div
          className="aurora-blob absolute -left-10 top-0 h-36 w-36 bg-primary"
          style={{ animation: "aurora-1 12s ease-in-out infinite" }}
        />
        <div
          className="aurora-blob absolute -bottom-8 -right-6 h-32 w-32 bg-glow"
          style={{ animation: "aurora-2 15s ease-in-out infinite" }}
        />
      </div>
      <div className="relative z-10 h-full min-h-[280px]">{children}</div>
    </div>
  );
}
