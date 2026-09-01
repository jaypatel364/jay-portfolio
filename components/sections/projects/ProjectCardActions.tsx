import Link from "next/link";
import { ArrowUpRight, Code2, ExternalLink, Info, Lock } from "lucide-react";
import { SiteButton } from "@/components/shared";
import { isProjectPublished, projectHref, type Project } from "@/settings/projects";
import { cn } from "@/lib/utils";

interface ProjectCardActionsProps {
  project: Project;
  /** Work zigzag rows use pill buttons; home cards use compact text links. */
  variant?: "work" | "home";
  className?: string;
}

function detailLabel(project: Project) {
  return isProjectPublished(project.slug) ? "View project" : "Project info";
}

/** Shared project CTAs — demo, code, and detail page links with accessible labels. */
export function ProjectCardActions({
  project,
  variant = "work",
  className,
}: ProjectCardActionsProps) {
  const hasDetailPage = !project.nda || isProjectPublished(project.slug);
  const showDemo = Boolean(project.demoUrl) && !project.nda;
  const showCode = Boolean(project.codeUrl) && !project.hideCode && !project.nda;
  const label = detailLabel(project);
  const detailHref = projectHref(project);

  if (project.nda) {
    return (
      <div
        className={cn("flex flex-wrap items-center gap-3", className)}
        role="group"
        aria-label={`Actions for ${project.title}`}
      >
        <p className="flex select-none items-center gap-1.5 text-xs text-muted-foreground/80">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Code &amp; demo unavailable under NDA
        </p>
        {hasDetailPage &&
          (variant === "work" ? (
            <SiteButton href={detailHref} size="sm" aria-label={`${label}: ${project.title}`}>
              {label}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </SiteButton>
          ) : (
            <Link
              href={detailHref}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`${label}: ${project.title}`}
            >
              <Info className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
      </div>
    );
  }

  if (variant === "work") {
    return (
      <div
        className={cn("flex flex-wrap items-center gap-3", className)}
        role="group"
        aria-label={`Actions for ${project.title}`}
      >
        <SiteButton href={detailHref} size="sm" aria-label={`${label}: ${project.title}`}>
          {label}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </SiteButton>
        {showDemo && (
          <SiteButton
            href={project.demoUrl!}
            external
            variant="secondary"
            size="sm"
            aria-label={`Open live demo for ${project.title}`}
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Live demo
          </SiteButton>
        )}
        {showCode && (
          <SiteButton
            href={project.codeUrl!}
            external
            variant="secondary"
            size="sm"
            aria-label={`View source code for ${project.title}`}
          >
            <Code2 className="h-4 w-4" aria-hidden />
            Source code
          </SiteButton>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-wrap items-center gap-4", className)}
      role="group"
      aria-label={`Actions for ${project.title}`}
    >
      {showCode && (
        <a
          href={project.codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`View source code for ${project.title}`}
        >
          <Code2 className="h-4 w-4" aria-hidden />
          Code
        </a>
      )}
      {showDemo && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Open live demo for ${project.title}`}
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Demo
        </a>
      )}
      <Link
        href={detailHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`${label}: ${project.title}`}
      >
        <Info className="h-4 w-4" aria-hidden />
        {label}
      </Link>
    </div>
  );
}
