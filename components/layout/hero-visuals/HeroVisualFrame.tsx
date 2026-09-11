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

/** Shared canvas for inner-page hero art — quiet surface so the content can lead. */
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
        "relative isolate min-h-[280px] w-full overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-premium",
        overflowVisible && "overflow-visible",
        className,
      )}
    >
      <div className={cn("hero-visual-canvas", overflowVisible && "overflow-hidden")} aria-hidden>
        <div className="hero-visual-canvas__wash" />
        <div className="hero-visual-canvas__grid" />
        <div className="hero-visual-canvas__glow-primary" />
        <div className="hero-visual-canvas__vignette" />
        <div className="hero-visual-canvas__ring" />
      </div>
      <div className="relative z-10 h-full min-h-[280px]">{children}</div>
    </div>
  );
}
