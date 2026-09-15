"use client";

import type { Service } from "@/lib/services/types";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceTechStack({ service }: { service: Service }) {
  return (
    <SectionFrame id="technologies" label="Technology" title="Stack & tooling">
      <div className="space-y-8">
        {service.technologies.map((group) => (
          <div key={group.category}>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {group.category}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border/80 bg-background/60 px-3 py-1.5 text-sm font-medium text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
