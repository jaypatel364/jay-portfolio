import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InnerPageHeroProps {
  label: string;
  title: string;
  description: string;
  chips?: readonly string[];
  backHref?: string;
  backLabel?: string;
  className?: string;
  /** Page-specific art for the right column (desktop) / below copy (mobile). */
  visual?: ReactNode;
}

/** Server-rendered inner-page hero — SEO copy and LCP text paint in the initial HTML. */
export function InnerPageHero({
  label,
  title,
  description,
  chips = [],
  className,
  visual,
}: InnerPageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/60 px-4 pb-14 pt-28 sm:px-6 md:pb-20 md:pt-32",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div
        className="aurora-blob absolute -left-20 top-0 h-56 w-56 bg-primary"
        style={{ animation: "aurora-1 14s ease-in-out infinite" }}
      />
      <div
        className="aurora-blob absolute -right-16 bottom-0 h-48 w-48 bg-glow"
        style={{ animation: "aurora-2 16s ease-in-out infinite" }}
      />

      <div className="relative mx-auto w-full min-w-0 max-w-6xl">
        <div
          className={cn(
            visual &&
              "grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,440px)] lg:gap-14",
          )}
        >
          <div className={cn("min-w-0", !visual && "max-w-3xl")}>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {label}
            </span>
            <h1 className="font-heading mt-3 break-words text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>

            {chips.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>

          {visual ? (
            <div className="mx-auto w-full min-w-0 max-w-md lg:mx-0 lg:max-w-none">{visual}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
