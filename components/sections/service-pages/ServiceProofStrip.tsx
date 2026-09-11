"use client";

import { siteConfig } from "@/settings";
import { PROJECTS } from "@/settings/projects";
import { getExperienceLabel } from "@/lib/utils";
import { SectionFrame } from "./primitives/SectionFrame";

/** Real metrics only — sourced from identity and public project data. */
export function ServiceProofStrip() {
  const exp = getExperienceLabel(siteConfig.careerStartDate);
  const publicProjectCount = PROJECTS.filter((p) => !p.nda).length;

  const stats = [
    { value: `${exp} yrs`, label: "Professional experience" },
    { value: String(publicProjectCount), label: "Public portfolio projects" },
    { value: `${siteConfig.projectCount}+`, label: "Production builds referenced" },
    { value: "24h", label: "Typical reply time" },
  ];

  return (
    <SectionFrame id="proof" label="Proof" title="Grounded in shipped work" theme="muted">
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label} className="text-center sm:text-left">
            <p className="font-heading text-3xl font-bold tabular-nums text-primary sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stat.label}</p>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
