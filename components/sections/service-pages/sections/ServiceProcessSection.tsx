"use client";

import type { Service } from "@/lib/services/types";
import { ProcessInteractive } from "@/components/sections/process/ProcessInteractive";
import { ServiceSectionShell } from "../primitives/ServiceSectionShell";

/** Service page process — reuses the Skills page interactive step rail. */
export function ServiceProcessSection({ service }: { service: Service }) {
  return (
    <ServiceSectionShell
      id="process"
      label="Process"
      title="My process"
      description="How I approach this service from discovery through delivery."
      theme="muted"
      width="wide"
    >
      <ProcessInteractive steps={service.process} sectionId="process" fullWidth />
    </ServiceSectionShell>
  );
}
