import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { ProjectVisual } from "../ProjectVisual";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { getProjectDetail } from "@/settings/project-details";
import { PROJECTS, projectHref, type Project, type ProjectCategory } from "@/settings/projects";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import {
  ArchitectureDiagram,
  BulletList,
  DecisionsList,
  DetailSection,
  FeatureGrid,
  InternalLinks,
  NdaNotice,
  OutcomeList,
  ProjectLinks,
  ProseBlock,
  RoleList,
  StackGrid,
} from "./ProjectDetailSections";

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  fullstack: "Full Stack",
  frontend: "Frontend",
  backend: "Backend",
};

function getRelatedProjects(project: Project, relatedSlugs?: string[]): Project[] {
  const slugs =
    relatedSlugs ??
    PROJECTS.filter((p) => p.slug !== project.slug && p.category === project.category)
      .slice(0, 3)
      .map((p) => p.slug);

  return slugs
    .map((slug) => PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p))
    .slice(0, 3);
}

interface ProjectDetailPageProps {
  project: Project;
}

/** Full published project write-up at `/work/<slug>/`. */
export function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const detail = getProjectDetail(project.slug);
  if (!detail) return null;

  const copy = siteConfig.workPage.detail ?? {
    moreProjects: "Related Projects",
    ndaLabel: "NDA protected",
  };
  const build = detail.build ?? detail.approach;
  const related = getRelatedProjects(project, detail.relatedSlugs);
  const highlightTags = project.tags.slice(0, 5);

  return (
    <main id="main" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
        <ProjectBreadcrumb project={project} />

        {/* Hero — copy first, full-width cover below for a larger showcase */}
        <header className="space-y-10 sm:space-y-12">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Project
              </span>
              {project.nda && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Lock className="h-2.5 w-2.5" aria-hidden />
                  NDA
                </span>
              )}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {project.tagline}
            </p>
            <h1 className="font-heading mt-2 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {detail.intro}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {CATEGORY_LABEL[project.category]}
              </span>
              {project.wip && (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  In Progress
                </span>
              )}
              {highlightTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <ProjectLinks
                demoUrl={project.demoUrl}
                codeUrl={project.codeUrl}
                hideCode={project.hideCode}
                nda={project.nda}
              />
            </div>
          </div>

          <ProjectVisual project={project} size="hero" priority />
        </header>

        {/* Case study */}
        <div className="mx-auto mt-16 max-w-3xl space-y-14 sm:mt-20 sm:space-y-16">
          {detail.ndaNotice && <NdaNotice label={copy.ndaLabel} notice={detail.ndaNotice} />}

          <DetailSection id="overview" title="Project Overview">
            <ProseBlock>{detail.overview}</ProseBlock>
          </DetailSection>

          <DetailSection id="role" title="My Role">
            <RoleList items={detail.role} />
          </DetailSection>

          <DetailSection id="problem" title="The Problem">
            <p>{detail.problem}</p>
          </DetailSection>

          <DetailSection id="build" title="How I Built It">
            <ProseBlock>{build}</ProseBlock>
          </DetailSection>

          <section id="features" aria-labelledby="features-heading" className="scroll-mt-28">
            <h2
              id="features-heading"
              className="font-heading text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Key Features
            </h2>
            <FeatureGrid features={detail.features} />
          </section>

          <DetailSection id="architecture" title="Technical Architecture">
            <ArchitectureDiagram architecture={detail.architecture} />
          </DetailSection>

          <section id="decisions" aria-labelledby="decisions-heading" className="scroll-mt-28">
            <h2
              id="decisions-heading"
              className="font-heading text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Engineering Decisions
            </h2>
            <DecisionsList decisions={detail.decisions} />
          </section>

          {detail.tradeoffs && detail.tradeoffs.length > 0 && (
            <DetailSection id="tradeoffs" title="Challenges and Trade-offs">
              <BulletList items={detail.tradeoffs} />
            </DetailSection>
          )}

          <DetailSection id="stack" title="Technology Stack">
            <StackGrid groups={detail.stack} />
          </DetailSection>

          <DetailSection id="outcome" title="Outcome">
            <OutcomeList items={detail.outcome} />
          </DetailSection>

          {detail.learned && detail.learned.length > 0 && (
            <DetailSection id="learned" title="What I Learned">
              <BulletList items={detail.learned} />
            </DetailSection>
          )}

          {detail.internalLinks && detail.internalLinks.length > 0 && (
            <InternalLinks links={detail.internalLinks} />
          )}
        </div>

        {/* Related projects */}
        {related.length > 0 && (
          <section
            id="related"
            aria-labelledby="related-heading"
            className="mx-auto mt-20 max-w-3xl scroll-mt-28"
          >
            <h2
              id="related-heading"
              className="font-heading text-2xl font-bold tracking-tight sm:text-3xl"
            >
              {copy.moreProjects}
            </h2>
            <ul className="mt-6 space-y-3">
              {related.map((relatedProject) => (
                <li key={relatedProject.slug}>
                  <Link
                    href={projectHref(relatedProject)}
                    className={cn(
                      "group flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/50 px-5 py-4",
                      "transition-all hover:border-primary/25 hover:bg-primary/5",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {relatedProject.tagline}
                      </p>
                      <p className="font-heading mt-0.5 truncate text-base font-semibold text-foreground group-hover:text-primary">
                        {relatedProject.title}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
