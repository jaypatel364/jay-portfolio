import { cn } from "@/lib/utils";

export type ServiceSectionTheme = "default" | "muted" | "contrast";

const THEME: Record<ServiceSectionTheme, string> = {
  default: "",
  muted: "border-y border-border/60 bg-muted/25 dark:bg-muted/10",
  contrast: "border-y border-border/60 bg-card/40 dark:bg-card/20",
};

interface ServiceSectionShellProps {
  id?: string;
  label: string;
  title: string;
  description?: string;
  theme?: ServiceSectionTheme;
  width?: "narrow" | "wide" | "full";
  className?: string;
  children: React.ReactNode;
}

/** Shared section chrome — light/dark via design tokens. */
export function ServiceSectionShell({
  id,
  label,
  title,
  description,
  theme = "default",
  width = "wide",
  className,
  children,
}: ServiceSectionShellProps) {
  const inner =
    width === "full"
      ? "w-full px-4 sm:px-6"
      : width === "wide"
        ? "mx-auto max-w-6xl px-4 sm:px-6"
        : "mx-auto max-w-3xl px-4 sm:px-6";

  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn("scroll-mt-28 py-16 md:py-24", THEME[theme], className)}
    >
      <div className={cn("relative", inner)}>
        <header className={width === "narrow" ? undefined : "max-w-3xl"}>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {label}
          </span>
          <h2
            id={id ? `${id}-heading` : undefined}
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </header>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
