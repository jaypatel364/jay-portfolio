import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/layout";
import { ProjectComingSoon } from "@/components/sections/projects/ProjectComingSoon";
import { getProjectBySlug, publicProjects } from "@/settings/projects";
import { projectBreadcrumbJsonLd, projectJsonLd, projectPageMetadata } from "@/settings/seo";

/**
 * Project detail route: `/work/<slug>/`
 * Only non-NDA projects. Always noindex until a full write-up ships later.
 * Legacy `/projects/<slug>/` permanently redirects here (see next.config).
 */
export function generateStaticParams() {
  return publicProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.nda) {
    return { robots: { index: false, follow: false } };
  }

  return {
    ...projectPageMetadata(project),
    // Always noindex project slug pages for now
    robots: { index: false, follow: true },
  };
}

export default async function WorkProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.nda) notFound();

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectBreadcrumbJsonLd(project)).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectJsonLd(project)).replace(/</g, "\\u003c"),
        }}
      />
      <ProjectComingSoon project={project} />
    </SiteChrome>
  );
}
