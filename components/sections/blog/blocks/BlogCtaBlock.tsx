import {
  ArrowRight,
  Bell,
  Download,
  Mail,
  Megaphone,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SiteButton } from "@/components/shared";
import { cn } from "@/lib/utils";

const TEMPLATE_ICON: Record<string, LucideIcon> = {
  primary: Sparkles,
  secondary: ArrowRight,
  newsletter: Mail,
  download: Download,
  contact: Mail,
  getStarted: Rocket,
  announcement: Megaphone,
  custom: Bell,
};

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export function BlogCtaBlock({
  title,
  description,
  buttonText,
  buttonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
  template = "primary",
  alignment = "center",
}: {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  template?: string;
  alignment?: string;
}) {
  const Icon = TEMPLATE_ICON[template] ?? Sparkles;
  const isLeft = alignment === "left";

  return (
    <aside className="relative mt-12 overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-premium">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 flex flex-col gap-5 px-6 py-8 sm:px-10 sm:py-10",
          isLeft ? "items-start text-left" : "items-center text-center",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary shadow-glow">
          <Icon className="h-6 w-6 text-primary-foreground" aria-hidden />
        </div>

        {title ? (
          <h3 className="font-heading max-w-lg text-xl font-bold tracking-tight sm:text-2xl">
            {title}
          </h3>
        ) : null}

        {description ? (
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}

        {(buttonText && buttonUrl) || (secondaryButtonText && secondaryButtonUrl) ? (
          <div className={cn("flex flex-wrap gap-3", isLeft ? "justify-start" : "justify-center")}>
            {buttonText && buttonUrl ? (
              <SiteButton href={buttonUrl} external={isExternalUrl(buttonUrl)} variant="primary">
                {buttonText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </SiteButton>
            ) : null}
            {secondaryButtonText && secondaryButtonUrl ? (
              <SiteButton
                href={secondaryButtonUrl}
                external={isExternalUrl(secondaryButtonUrl)}
                variant="secondary"
              >
                {secondaryButtonText}
              </SiteButton>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        className="h-px w-full opacity-30"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--primary), var(--glow), transparent)",
        }}
        aria-hidden
      />
    </aside>
  );
}
