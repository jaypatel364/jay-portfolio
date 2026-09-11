import { servicesHub } from "@/settings/services/hub";
import { ALL_SERVICES } from "@/settings/services/pages";
import { DEFAULT_SERVICE_SECTION_ORDER, type Service, type ServiceSectionKey } from "./types";

export type {
  Service,
  ServicesHubSettings,
  ServiceSectionKey,
  ServiceHeadingKeywords,
  ServiceSectionSupport,
} from "./types";
export { DEFAULT_SERVICE_SECTION_ORDER } from "./types";
export {
  SERVICE_H2_TEMPLATES,
  getServiceSectionHeading,
  getServiceSectionHeadings,
  SECTION_KEY_TO_HEADING,
} from "./section-headings";
export type { ServiceSectionHeadings } from "./section-headings";
export { getServiceSectionSupport } from "./section-support";

export function getServicesHub() {
  return servicesHub;
}

export function isServicePublished(service: Service): boolean {
  return service.published;
}

export function getAllServices(): Service[] {
  return ALL_SERVICES.filter(isServicePublished).sort((a, b) => a.order - b.order);
}

export function getServiceBySlug(slug: string): Service | undefined {
  const service = ALL_SERVICES.find((s) => s.slug === slug);
  return service && isServicePublished(service) ? service : undefined;
}

export function getServiceSlugs(): string[] {
  return getAllServices().map((s) => s.slug);
}

export function getRelatedServices(service: Service): Service[] {
  return service.relatedServiceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is Service => Boolean(s));
}

const LEGACY_SECTION_ALIASES: Partial<Record<ServiceSectionKey, ServiceSectionKey>> = {
  architecture: "piecesConnect",
};

export function getServiceSectionOrder(service: Service): ServiceSectionKey[] {
  const raw = service.sectionOrder ?? DEFAULT_SERVICE_SECTION_ORDER;
  const seen = new Set<ServiceSectionKey>();
  const normalized: ServiceSectionKey[] = [];

  for (const key of raw) {
    const next = LEGACY_SECTION_ALIASES[key] ?? key;
    if (seen.has(next)) continue;
    seen.add(next);
    normalized.push(next);
  }

  for (const key of DEFAULT_SERVICE_SECTION_ORDER) {
    if (!seen.has(key)) normalized.push(key);
  }

  return normalized;
}

export function isServiceSectionVisible(service: Service, key: ServiceSectionKey): boolean {
  return service.sectionVisibility?.[key] !== false;
}

export function servicePath(slug: string): string {
  return `/services/${slug}/`;
}
