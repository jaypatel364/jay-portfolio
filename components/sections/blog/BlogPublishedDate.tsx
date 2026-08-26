import { CalendarDays, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function formatBlogDate(value?: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

/** Clear “Published” date chip — used on cards + article hero. */
export function BlogPublishedDate({
  date,
  readingMinutes,
  className,
  showLabel = true,
}: {
  date?: string | null;
  readingMinutes?: number | null;
  className?: string;
  showLabel?: boolean;
}) {
  const label = formatBlogDate(date);
  if (!label && !readingMinutes) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {label ? (
        <time
          dateTime={date || undefined}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 py-1 text-xs font-medium text-foreground/80"
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          {showLabel ? <span className="text-muted-foreground">Published</span> : null}
          <span className={showLabel ? "font-semibold text-foreground" : undefined}>{label}</span>
        </time>
      ) : null}
      {readingMinutes ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5 shrink-0 text-primary/80" aria-hidden />
          {readingMinutes} min read
        </span>
      ) : null}
    </div>
  );
}
