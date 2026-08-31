import Link from "next/link";
import { ArrowDown, ArrowLeft, Code2, ExternalLink, Lock } from "lucide-react";
import { SiteButton } from "@/components/shared";
import { cn } from "@/lib/utils";
import type {
  ProjectArchitecture,
  ProjectDecision,
  ProjectInternalLink,
  ProjectTechGroup,
} from "@/settings/project-details";

interface DetailSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DetailSection({ id, title, children, className }: DetailSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("scroll-mt-28", className)}>
      <h2
        id={`${id}-heading`}
        className="font-heading text-2xl font-bold tracking-tight sm:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

/** Renders blank-line separated paragraphs. */
export function ProseBlock({ children }: { children?: string | null }) {
  if (!children?.trim()) return null;

  return (
    <>
      {children
        .split("\n\n")
        .filter(Boolean)
        .map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
    </>
  );
}

export function NdaNotice({ label, notice }: { label: string; notice: string }) {
  return (
    <aside
      aria-label={label}
      className="rounded-2xl border border-border/70 bg-muted/30 p-5 sm:p-6"
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
        <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {label}
      </p>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{notice}</p>
    </aside>
  );
}

export function RoleList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card/50 px-4 py-3 text-sm text-foreground"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function FeatureGrid({ features }: { features: { title: string; description: string }[] }) {
  return (
    <ul className="mt-5 grid gap-4 sm:grid-cols-2">
      {features.map((feature) => (
        <li
          key={feature.title}
          className="rounded-2xl border border-border/70 bg-card/50 p-5 transition-colors hover:border-primary/20"
        >
          <h3 className="font-heading text-base font-semibold text-foreground">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function ArchitectureDiagram({ architecture }: { architecture: ProjectArchitecture }) {
  return (
    <div className="mt-5">
      <div className="mx-auto max-w-sm rounded-2xl border border-border/70 bg-card/50 p-6">
        <ol className="flex flex-col items-center gap-0">
          {architecture.layers.map((layer, i) => (
            <li key={layer} className="flex w-full flex-col items-center">
              <div className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-medium text-foreground">
                {layer}
              </div>
              {i < architecture.layers.length - 1 && (
                <ArrowDown className="my-1.5 h-4 w-4 text-primary/50" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        {architecture.explanation}
      </p>
    </div>
  );
}

export function DecisionsList({ decisions }: { decisions: ProjectDecision[] }) {
  return (
    <ul className="mt-5 space-y-4">
      {decisions.map((decision) => (
        <li
          key={decision.title}
          className="rounded-2xl border border-border/70 bg-card/50 p-5 sm:p-6"
        >
          <h3 className="font-heading text-base font-semibold text-foreground">{decision.title}</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="font-semibold text-foreground/90">Why</dt>
              <dd className="mt-0.5 leading-relaxed text-muted-foreground">{decision.why}</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground/90">Trade-off</dt>
              <dd className="mt-0.5 leading-relaxed text-muted-foreground">{decision.tradeoff}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function StackGrid({ groups }: { groups: ProjectTechGroup[] }) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.group} className="rounded-2xl border border-border/70 bg-card/50 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
            {group.group}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function OutcomeList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-base text-foreground/90">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Contextual in-body links — descriptive anchors, never "click here". */
export function InternalLinks({ links }: { links: ProjectInternalLink[] }) {
  return (
    <div className="space-y-3 border-t border-border/60 pt-6">
      {links.map((link) => (
        <p key={link.href} className="text-sm leading-relaxed text-muted-foreground">
          {link.sentence}{" "}
          <Link
            href={link.href}
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {link.anchor}
          </Link>
          .
        </p>
      ))}
    </div>
  );
}

interface ProjectLinksProps {
  demoUrl?: string;
  codeUrl?: string;
  hideCode?: true;
  nda?: true;
  /** Hero-only wayfinding; breadcrumb already links to Work. */
  showBackLink?: boolean;
}

export function ProjectLinks({
  demoUrl,
  codeUrl,
  hideCode,
  nda,
  showBackLink = false,
}: ProjectLinksProps) {
  const showCode = Boolean(codeUrl) && !hideCode && !nda;
  const showDemo = Boolean(demoUrl) && !nda;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showDemo && (
        <SiteButton href={demoUrl!} external variant="primary" size="sm">
          <ExternalLink className="h-4 w-4" aria-hidden />
          View Live Demo
        </SiteButton>
      )}
      {showCode && (
        <SiteButton href={codeUrl!} external variant="secondary" size="sm">
          <Code2 className="h-4 w-4" aria-hidden />
          View Source Code
        </SiteButton>
      )}
      {showBackLink && (
        <Link
          href="/work/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to Work
        </Link>
      )}
    </div>
  );
}
