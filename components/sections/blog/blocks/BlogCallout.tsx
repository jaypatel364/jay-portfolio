import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  HelpCircle,
  Info,
  Lightbulb,
  Sparkles,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { cn } from "@/lib/utils";

const CALLOUT_META: Record<
  string,
  { border: string; bg: string; icon: LucideIcon; iconColor: string }
> = {
  warning: {
    border: "border-amber-500/35",
    bg: "bg-gradient-to-br from-amber-500/[0.10] to-amber-500/[0.03]",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  tip: {
    border: "border-emerald-500/35",
    bg: "bg-gradient-to-br from-emerald-500/[0.10] to-emerald-500/[0.03]",
    icon: Lightbulb,
    iconColor: "text-emerald-500",
  },
  proTip: {
    border: "border-emerald-500/35",
    bg: "bg-gradient-to-br from-emerald-500/[0.10] to-emerald-500/[0.03]",
    icon: Sparkles,
    iconColor: "text-emerald-500",
  },
  info: {
    border: "border-primary/30",
    bg: "bg-gradient-to-br from-primary/[0.10] to-primary/[0.03]",
    icon: Info,
    iconColor: "text-primary",
  },
  note: {
    border: "border-primary/30",
    bg: "bg-gradient-to-br from-primary/[0.10] to-primary/[0.03]",
    icon: Info,
    iconColor: "text-primary",
  },
  success: {
    border: "border-emerald-500/35",
    bg: "bg-gradient-to-br from-emerald-500/[0.10] to-emerald-500/[0.03]",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
  important: {
    border: "border-sky-500/35",
    bg: "bg-gradient-to-br from-sky-500/[0.10] to-sky-500/[0.03]",
    icon: Bell,
    iconColor: "text-sky-500",
  },
  bestPractice: {
    border: "border-violet-500/35",
    bg: "bg-gradient-to-br from-violet-500/[0.10] to-violet-500/[0.03]",
    icon: CheckCircle2,
    iconColor: "text-violet-500",
  },
  example: {
    border: "border-border/70",
    bg: "bg-gradient-to-br from-muted/60 to-card/40",
    icon: Sparkles,
    iconColor: "text-muted-foreground",
  },
  question: {
    border: "border-amber-500/30",
    bg: "bg-gradient-to-br from-amber-500/[0.08] to-amber-500/[0.02]",
    icon: HelpCircle,
    iconColor: "text-amber-500",
  },
  danger: {
    border: "border-red-500/35",
    bg: "bg-gradient-to-br from-red-500/[0.10] to-red-500/[0.03]",
    icon: XCircle,
    iconColor: "text-red-500",
  },
  keyTakeaway: {
    border: "border-primary/35",
    bg: "bg-gradient-to-br from-primary/[0.12] to-primary/[0.04]",
    icon: Sparkles,
    iconColor: "text-primary",
  },
};

export function BlogCallout({
  title,
  body,
  tone = "info",
  inlineComponents,
}: {
  title?: string;
  body?: PortableTextBlock[];
  tone?: string;
  inlineComponents: PortableTextComponents;
}) {
  const meta = CALLOUT_META[tone] ?? CALLOUT_META.info;
  const Icon = meta.icon;

  return (
    <aside
      className={cn(
        "relative mt-8 overflow-hidden rounded-2xl border px-5 py-4 sm:px-6 sm:py-5",
        meta.border,
        meta.bg,
      )}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-background/60 shadow-sm",
            meta.iconColor,
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          {title ? (
            <p className="font-heading text-sm font-bold tracking-tight text-foreground sm:text-[15px]">
              {title}
            </p>
          ) : null}
          {body?.length ? (
            <div
              className={cn("text-[0.98rem] leading-relaxed text-foreground/80", title && "mt-1.5")}
            >
              <PortableText value={body} components={inlineComponents} />
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
