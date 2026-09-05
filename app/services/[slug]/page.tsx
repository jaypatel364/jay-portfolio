import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/layout";
import { ServicePageArticle } from "@/components/sections/service-pages";
import { getServiceBySlug, getServiceSlugs, type Service } from "@/lib/services";
import { getProjectBySlug } from "@/settings/projects";
import {
  serviceDetailBreadcrumbJsonLd,
  serviceFaqJsonLd,
  servicePageJsonLd,
  servicePageMetadata,
} from "@/settings/services-seo";

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { robots: { index: false, follow: false } };
  return servicePageMetadata(service);
}

function resolveCaseStudyProjects(service: Service) {
  return (service.caseStudySlugs ?? [])
    .map((projectSlug) => getProjectBySlug(projectSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p && !p.nda));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const caseStudyProjects = resolveCaseStudyProjects(service);
  const faqJsonLd = serviceFaqJsonLd(service);

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceDetailBreadcrumbJsonLd(service)).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicePageJsonLd(service)).replace(/</g, "\\u003c"),
        }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <main id="main">
        <ServicePageArticle service={service} caseStudyProjects={caseStudyProjects} />
      </main>
    </SiteChrome>
  );
}
