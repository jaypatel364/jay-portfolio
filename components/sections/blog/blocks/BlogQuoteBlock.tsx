import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlogQuoteBlock({
  text,
  author,
  source,
  sourceUrl,
  variant,
}: {
  text?: string;
  author?: string;
  source?: string;
  sourceUrl?: string;
  variant?: string;
}) {
  if (!text) return null;
  const isPull = variant === "pull";
  const isLarge = variant === "large";

  return (
    <figure
      className={cn(
        "relative mt-10 overflow-hidden rounded-2xl border",
        isLarge
          ? "border-primary/30 bg-gradient-to-br from-primary/[0.10] via-card/70 to-card/40 px-8 py-10 text-center sm:px-12 sm:py-12"
          : isPull
            ? "border-primary/25 bg-gradient-to-br from-primary/[0.08] via-card/60 to-card/40 px-6 py-7 sm:px-8 sm:py-8"
            : "border-border/70 bg-card/40 px-6 py-6",
      )}
    >
      <Quote
        className={cn(
          "absolute opacity-[0.07]",
          isLarge
            ? "right-8 top-8 h-20 w-20"
            : isPull
              ? "right-6 top-6 h-16 w-16"
              : "right-4 top-4 h-10 w-10",
        )}
        aria-hidden
      />

      <blockquote
        className={cn(
          "relative font-heading leading-snug text-foreground/90",
          isLarge
            ? "mx-auto max-w-3xl text-2xl font-bold sm:text-3xl"
            : isPull
              ? "text-xl font-semibold sm:text-2xl"
              : "text-lg italic",
        )}
      >
        &ldquo;{text}&rdquo;
      </blockquote>

      {(author || source) && (
        <figcaption className="relative mt-4 flex flex-wrap items-center gap-2 text-sm">
          {author ? <span className="font-semibold text-foreground">{author}</span> : null}
          {source ? (
            <>
              {author ? <span className="text-muted-foreground">·</span> : null}
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  className="text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source}
                </a>
              ) : (
                <span className="text-muted-foreground">{source}</span>
              )}
            </>
          ) : null}
        </figcaption>
      )}

      {isPull || isLarge ? (
        <div
          className="absolute bottom-0 left-0 h-1 w-full opacity-40"
          style={{
            background: "linear-gradient(90deg, var(--primary), var(--glow), transparent)",
          }}
          aria-hidden
        />
      ) : null}
    </figure>
  );
}
