import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/layout";
import { ProjectComingSoon, ProjectDetailPage } from "@/components/sections/projects";
import { getProjectDetail } from "@/settings/project-details";
import { getProjectBySlug, isProjectPublished, routableProjects } from "@/settings/projects";
import {
  projectBreadcrumbJsonLd,
  projectDetailPageJsonLd,
  projectImageJsonLd,
  projectJsonLd,
  projectPageMetadata,
} from "@/settings/seo";

/**
 * Project detail route: `/work/<slug>/`
 * Published slugs (including NDA write-ups) render the full case study and are
 * indexable. Public projects without content keep the coming-soon placeholder
 * and stay noindex. Unpublished NDA work has no page at all.
 * Legacy `/projects/<slug>/` permanently redirects here (see next.config).
 */
export function generateStaticParams() {
  return routableProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const published = isProjectPublished(slug);

  if (!project || (project.nda && !published)) {
    return { robots: { index: false, follow: false } };
  }

  const detail = getProjectDetail(slug);

  return projectPageMetadata(project, {
    published,
    seoTitle: detail?.seo.title,
    seoDescription: detail?.seo.description,
    ogTitle: detail?.seo.ogTitle,
    ogDescription: detail?.seo.ogDescription,
    keywords: detail?.seo
      ? [detail.seo.primaryTopic, ...(detail.seo.secondaryTopics ?? [])]
      : undefined,
  });
}

export default async function WorkProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const published = isProjectPublished(slug);
  const detail = getProjectDetail(slug);

  if (!project || (project.nda && !published)) notFound();

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectBreadcrumbJsonLd(project)).replace(/</g, "\\u003c"),
        }}
      />
      {published && detail && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(projectDetailPageJsonLd(project, detail)).replace(
                /</g,
                "\\u003c",
              ),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(projectJsonLd(project, detail)).replace(/</g, "\\u003c"),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(projectImageJsonLd(project)).replace(/</g, "\\u003c"),
            }}
          />
        </>
      )}
      {published ? (
        <ProjectDetailPage project={project} />
      ) : (
        <ProjectComingSoon project={project} />
      )}
    </SiteChrome>
  );
}
