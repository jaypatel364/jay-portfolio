"use client";

import Image from "next/image";
import { useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  projectImageAlt,
  projectImageSrc,
  projectImageTitle,
  type Project,
} from "@/settings/projects";

interface ProjectVisualProps {
  project: Project;
  className?: string;
  /** Larger cover for the work-page zigzag and project detail hero. */
  size?: "card" | "feature";
  /** LCP hint for hero / detail cover images. */
  priority?: boolean;
}

function GradientFallback({ project, feature }: { project: Project; feature: boolean }) {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 32px)",
        }}
      />
      <div className="aurora-blob pointer-events-none absolute -left-8 top-0 h-32 w-32 bg-primary" />
      <div className="aurora-blob pointer-events-none absolute -bottom-10 right-0 h-28 w-28 bg-glow" />

      <div className="relative z-10 flex h-full items-center justify-center">
        {project.nda ? (
          <span
            className={cn(
              "flex items-center justify-center rounded-2xl shadow-sm",
              feature ? "h-16 w-16" : "h-12 w-12",
            )}
            style={{
              backgroundColor: `color-mix(in oklch, ${project.iconColor} 15%, transparent)`,
              border: `1.5px solid color-mix(in oklch, ${project.iconColor} 30%, transparent)`,
            }}
          >
            <Lock
              className={feature ? "h-7 w-7" : "h-5 w-5"}
              style={{ color: project.iconColor }}
            />
          </span>
        ) : (
          <span
            className={cn(
              "flex items-center justify-center rounded-2xl font-bold shadow-sm",
              feature ? "h-16 w-16 text-2xl" : "h-12 w-12 text-xl",
            )}
            style={{
              backgroundColor: `color-mix(in oklch, ${project.iconColor} 18%, transparent)`,
              color: project.iconColor,
              border: `1.5px solid color-mix(in oklch, ${project.iconColor} 35%, transparent)`,
            }}
          >
            {project.title[0]}
          </span>
        )}
      </div>
    </>
  );
}

/** Full-bleed project cover with SEO-friendly alt, title, and semantic figure markup. */
export function ProjectVisual({
  project,
  className,
  size = "card",
  priority = false,
}: ProjectVisualProps) {
  const feature = size === "feature";
  const [imageError, setImageError] = useState(false);
  const imageSrc = projectImageSrc(project);
  const imageAlt = projectImageAlt(project);
  const imageTitle = projectImageTitle(project);
  const showImage = !imageError;

  return (
    <figure
      className={cn(
        "relative m-0 overflow-hidden",
        !showImage && cn("bg-gradient-to-br", project.color),
        project.nda && !showImage && "opacity-90",
        "aspect-video w-full",
        feature && "rounded-2xl shadow-premium",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          title={imageTitle}
          fill
          className="object-cover object-center"
          sizes={
            feature
              ? "(max-width: 1024px) 100vw, 560px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          }
          priority={priority || feature}
          onError={() => setImageError(true)}
        />
      ) : (
        <GradientFallback project={project} feature={feature} />
      )}

      {/* Semantic caption — matches alt/title for crawlers and screen readers */}
      <figcaption className="sr-only">{imageTitle}</figcaption>

      {project.nda && (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
          <Lock className="h-2.5 w-2.5" />
          NDA
        </span>
      )}
      {project.wip && !project.nda && (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          In Progress
        </span>
      )}
    </figure>
  );
}
