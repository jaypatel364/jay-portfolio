"use client";

import type { Service } from "@/lib/services/types";
import {
  getServiceBySlug,
  getServiceSectionHeading,
  getServiceSectionSupport,
  servicePath,
} from "@/lib/services";
import { CAPABILITY_ICON_CYCLE } from "@/components/sections/services/service-icons";
import {
  ServiceItemCards,
  type ServiceCardItem,
} from "@/components/sections/services/ServiceItemCards";
import { ServiceSectionShell } from "../primitives/ServiceSectionShell";

export function ServiceCapabilitiesSection({ service }: { service: Service }) {
  const items: ServiceCardItem[] = service.capabilities.map((cap, i) => ({
    title: cap.title,
    description: cap.description,
    href:
      cap.relatedServiceSlug && getServiceBySlug(cap.relatedServiceSlug)
        ? servicePath(cap.relatedServiceSlug)
        : undefined,
    icon: CAPABILITY_ICON_CYCLE[i % CAPABILITY_ICON_CYCLE.length],
  }));

  return (
    <ServiceSectionShell
      id="capabilities"
      label="Capabilities"
      title={getServiceSectionHeading(service, "capabilities")}
      description={getServiceSectionSupport(service, "capabilities")}
      theme="muted"
      width="wide"
    >
      <ServiceItemCards items={items} />
    </ServiceSectionShell>
  );
}
