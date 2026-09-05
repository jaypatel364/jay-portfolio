/**
 * Services route copy + SEO helpers (kept separate from settings/seo.ts for easy merge).
 */

import type { Metadata } from "next";
import { BASE_URL, OG_IMAGE, TWITTER_HANDLE, TWITTER_IMAGE, pageUrl } from "@/settings/seo";
import { siteConfig } from "@/settings";
import type { Service } from "@/lib/services/types";
import { getServicesHub } from "@/lib/services";
import type { ServicesHubSettings } from "@/lib/services/types";

export const servicesPagePath = "/services";

function absoluteUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${BASE_URL}${path.endsWith("/") ? path : `${path}/`}`;
}

function serviceCanonical(service: Service): string {
  return absoluteUrl(service.seo.canonicalPath) ?? pageUrl(`services/${service.slug}`);
}

export function servicesHubMetadata(hub: ServicesHubSettings = getServicesHub()): Metadata {
  const { seo } = hub;
  const title = seo.title;
  const description = seo.description;
  const canonical = pageUrl("services");

  return {
    title: { absolute: title },
    description,
    keywords: seo.keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: seo.ogTitle ?? title,
      description: seo.ogDescription ?? description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle ?? title,
      description: seo.ogDescription ?? description,
      images: seo.ogImage ? [seo.ogImage] : [TWITTER_IMAGE],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}

export function servicePageMetadata(service: Service): Metadata {
  const { seo } = service;
  const title = seo.title;
  const description = seo.description;
  const canonical = serviceCanonical(service);

  return {
    title: { absolute: title },
    description,
    keywords: seo.keywords,
    alternates: { canonical },
    robots: seo.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url: canonical,
      title: seo.ogTitle ?? title,
      description: seo.ogDescription ?? description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle ?? title,
      description: seo.ogDescription ?? description,
      images: seo.ogImage ? [seo.ogImage] : [TWITTER_IMAGE],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}

export function servicesHubJsonLd(serviceCount: number) {
  const hub = getServicesHub();
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.seo.title,
    description: hub.seo.description,
    url: pageUrl("services"),
    isPartOf: { "@type": "WebSite", name: siteConfig.fullName, url: `${BASE_URL}/` },
    numberOfItems: serviceCount,
  };
}

export function servicePageJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.seo.description,
    url: serviceCanonical(service),
    provider: {
      "@type": "Person",
      name: siteConfig.fullName,
      url: `${BASE_URL}/`,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: service.seo.focusKeyword,
  };
}

export function serviceFaqJsonLd(service: Service) {
  if (!service.faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function servicesBreadcrumbJsonLd(parts: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: parts.map((part, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: part.name,
      item: part.path === "" ? `${BASE_URL}/` : pageUrl(part.path.replace(/^\/+|\/+$/g, "")),
    })),
  };
}

export function serviceHubBreadcrumbJsonLd() {
  return servicesBreadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Services", path: "services" },
  ]);
}

export function serviceDetailBreadcrumbJsonLd(service: Service) {
  return servicesBreadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Services", path: "services" },
    { name: service.title, path: `services/${service.slug}` },
  ]);
}
