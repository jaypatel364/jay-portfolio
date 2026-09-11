"use client";

import type { Service } from "@/lib/services/types";

/** SEO-rich depth — distributed prose, not a blog article layout. */
export function ServiceDeepContent({ service }: { service: Service }) {
  const overview = service.overview.split("\n\n").filter(Boolean);
  const extra = service.whatWeDo.paragraphs.slice(2);

  return (
    <section className="w-full border-t border-border/60 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          Deep dive
        </p>
        <h2 className="font-heading mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          {service.seo.focusKeyword} — in detail
        </h2>
        <div className="mt-8 space-y-5 text-base leading-[1.85] text-muted-foreground">
          {[...overview, ...extra].map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>

        {service.useCases.length ? (
          <div className="mt-12 border-t border-border/60 pt-12">
            <h3 className="font-heading text-lg font-bold">Common use cases</h3>
            <ul className="mt-4 space-y-4">
              {service.useCases.map((uc) => (
                <li key={uc.title}>
                  <p className="font-semibold text-foreground">{uc.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{uc.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
