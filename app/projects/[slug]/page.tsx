import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";
import { SiteChrome } from "@/components/layout";
import { features } from "@/settings/features";
import { publicCaseStudies, getProjectBySlug } from "@/settings/projects";
import { pageUrl, projectPageMetadata } from "@/settings/seo";

export function generateStaticParams() {
  if (!features.showCaseStudies) return [];
  return publicCaseStudies().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    if (!features.showCaseStudies) return { robots: { index: false, follow: false } };
    const project = getProjectBySlug(slug);
    if (!project?.caseStudy || project.nda) return {};
    return projectPageMetadata(project);
  });
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!features.showCaseStudies) notFound();
  const project = getProjectBySlug(slug);
  if (!project?.caseStudy || project.nda) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": project.codeUrl ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: project.desc,
    url: pageUrl(`projects/${project.slug}`),
    ...(project.codeUrl ? { codeRepository: project.codeUrl } : {}),
    ...(project.demoUrl ? { sameAs: project.demoUrl } : {}),
  };

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <main id="main" className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <Link
          href="/work/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All work
        </Link>

        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-primary">
          {project.tagline}
        </p>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{project.desc}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <Code2 className="h-4 w-4" />
              View code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Live demo
            </a>
          )}
        </div>

        <section className="mt-12 space-y-8">
          <div>
            <h2 className="font-heading text-xl font-bold">Problem</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {project.caseStudy.problem}
            </p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">Role</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {project.caseStudy.role}
            </p>
          </div>
          {project.caseStudy.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-heading text-xl font-bold">{section.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {section.body}
              </p>
            </div>
          ))}
        </section>
      </main>
    </SiteChrome>
  );
}
