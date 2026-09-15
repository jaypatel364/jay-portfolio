import { cn } from "@/lib/utils";
import { PAGE_CONTAINER } from "@/components/shared/page-container";

export type SectionTheme = "default" | "muted" | "dark" | "accent";

const THEME_CLASS: Record<SectionTheme, string> = {
  default: "",
  muted: "bg-muted/20 border-y border-border/50",
  dark: "bg-[oklch(0.16_0.012_265)] text-foreground border-y border-border/40",
  accent: "relative overflow-hidden",
};

interface SectionFrameProps {
  id: string;
  label: string;
  title: string;
  description?: string;
  theme?: SectionTheme;
  className?: string;
  children: React.ReactNode;
  fullBleed?: boolean;
}

export function SectionFrame({
  id,
  label,
  title,
  description,
  theme = "default",
  className,
  children,
  fullBleed = false,
}: SectionFrameProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-28 py-16 md:py-24", THEME_CLASS[theme], className)}
    >
      {theme === "accent" ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent"
          aria-hidden
        />
      ) : null}
      <div className={cn("relative", PAGE_CONTAINER)}>
        <header className="max-w-3xl">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {label}
          </span>
          <h2
            id={`${id}-heading`}
            className="font-heading mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </header>
        <div className={cn("mt-10", fullBleed ? "max-w-none" : "max-w-3xl")}>{children}</div>
      </div>
    </section>
  );
}
