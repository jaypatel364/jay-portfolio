import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Service } from "@/lib/services/types";
import type { Project } from "@/settings/projects";
import { servicePath } from "@/lib/services";
import { cn } from "@/lib/utils";

function SectionShell({
  id,
  label,
  title,
  children,
  className,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-28 py-12 md:py-16", className)}
    >
      <div className="mx-auto max-w-3xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          {label}
        </span>
        <h2
          id={`${id}-heading`}
          className="font-heading mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {title}
        </h2>
      </div>
      <div className="mx-auto mt-8 max-w-3xl">{children}</div>
    </section>
  );
}

function ProseBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  );
}

export function ServiceOverviewSection({ service }: { service: Service }) {
  const paragraphs = service.overview.split("\n\n").filter(Boolean);
  return (
    <SectionShell id="overview" label="Overview" title={`About ${service.title.toLowerCase()}`}>
      <ProseBlock paragraphs={paragraphs} />
    </SectionShell>
  );
}

export function ServiceWhatWeDoSection({ service }: { service: Service }) {
  return (
    <SectionShell id="what-we-do" label="What I do" title={service.whatWeDo.heading}>
      <ProseBlock paragraphs={service.whatWeDo.paragraphs} />
    </SectionShell>
  );
}

export function ServiceCapabilitiesSection({ service }: { service: Service }) {
  return (
    <SectionShell id="capabilities" label="Capabilities" title="Core capabilities">
      <ul className="space-y-5">
        {service.capabilities.map((cap) => (
          <li key={cap.title} className="rounded-xl border border-border/70 bg-card/50 p-5">
            <h3 className="font-heading text-lg font-semibold text-foreground">{cap.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cap.description}</p>
            {cap.relatedServiceSlug ? (
              <Link
                href={servicePath(cap.relatedServiceSlug)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Related service
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServiceProblemsSection({ service }: { service: Service }) {
  return (
    <SectionShell id="problems" label="Problems" title="Common challenges I solve">
      <ul className="grid gap-4 sm:grid-cols-2">
        {service.problems.map((problem) => (
          <li key={problem.title} className="rounded-xl border border-border/70 p-5">
            <h3 className="font-heading font-semibold text-foreground">{problem.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {problem.description}
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServiceProcessSection({ service }: { service: Service }) {
  return (
    <SectionShell id="process" label="Process" title="How I work on this service">
      <ol className="relative space-y-0 border-l border-border/80 pl-6">
        {service.process.map((step, index) => (
          <li key={step.title} className="relative pb-8 last:pb-0">
            <span
              className="absolute -left-[calc(0.75rem+1px)] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-background text-xs font-bold text-primary"
              aria-hidden
            >
              {index + 1}
            </span>
            <h3 className="font-heading font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

export function ServiceTechnologiesSection({ service }: { service: Service }) {
  return (
    <SectionShell id="technologies" label="Technologies" title="Technologies & tools">
      <div className="grid gap-6 sm:grid-cols-2">
        {service.technologies.map((group) => (
          <div key={group.category} className="rounded-xl border border-border/70 p-5">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              {group.category}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-background/70 px-3 py-1 text-sm font-medium text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function ServiceUseCasesSection({ service }: { service: Service }) {
  return (
    <SectionShell id="use-cases" label="Use cases" title="Where this service fits">
      <ul className="space-y-4">
        {service.useCases.map((uc) => (
          <li key={uc.title} className="rounded-xl border border-border/70 p-5">
            <h3 className="font-heading font-semibold text-foreground">{uc.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{uc.description}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServiceAudiencesSection({ service }: { service: Service }) {
  return (
    <SectionShell id="audiences" label="Who it's for" title="Who this service is for">
      <ul className="grid gap-4 sm:grid-cols-2">
        {service.audiences.map((aud) => (
          <li key={aud.title} className="rounded-xl border border-border/70 p-5">
            <h3 className="font-heading font-semibold text-foreground">{aud.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{aud.description}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServiceDeliverablesSection({ service }: { service: Service }) {
  return (
    <SectionShell id="deliverables" label="Deliverables" title="What you receive">
      <ul className="space-y-3">
        {service.deliverables.map((d) => (
          <li key={d.title} className="flex gap-3 rounded-xl border border-border/70 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <h3 className="font-heading font-semibold text-foreground">{d.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServiceBenefitsSection({ service }: { service: Service }) {
  return (
    <SectionShell id="benefits" label="Outcomes" title="Benefits & outcomes">
      <ul className="grid gap-4 sm:grid-cols-2">
        {service.benefits.map((b) => (
          <li key={b.title} className="rounded-xl border border-border/70 bg-card/40 p-5">
            <h3 className="font-heading font-semibold text-foreground">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServiceCaseStudiesSection({ projects }: { service: Service; projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <SectionShell id="case-studies" label="Work" title="Related project examples">
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}/`}
              className="group flex flex-col rounded-xl border border-border/70 p-5 transition-colors hover:border-primary/35 hover:bg-primary/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-heading font-semibold text-foreground group-hover:text-primary">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary sm:mt-0">
                View project
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServiceFaqSection({ service }: { service: Service }) {
  return (
    <SectionShell id="faq" label="FAQ" title="Frequently asked questions">
      <div className="space-y-3">
        {service.faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-border/70 bg-card/30 open:border-primary/25"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-heading font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              {faq.question}
            </summary>
            <div className="border-t border-border/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

export function ServiceRelatedServicesSection({
  related,
}: {
  service: Service;
  related: Service[];
}) {
  if (!related.length) return null;

  return (
    <SectionShell id="related-services" label="Related" title="Related services">
      <ul className="grid gap-3 sm:grid-cols-2">
        {related.map((rel) => (
          <li key={rel.slug}>
            <Link
              href={servicePath(rel.slug)}
              className="group flex h-full flex-col rounded-xl border border-border/70 p-5 transition-colors hover:border-primary/35 hover:bg-primary/5"
            >
              <h3 className="font-heading font-semibold text-foreground group-hover:text-primary">
                {rel.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{rel.shortDescription}</p>
              <span className="mt-3 text-sm font-semibold text-primary">Learn more →</span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServiceRelatedPostsSection({ service }: { service: Service }) {
  if (!service.relatedPosts.length) return null;

  return (
    <SectionShell id="related-resources" label="Resources" title="Related articles & guides">
      <p className="mb-6 text-sm text-muted-foreground">
        Topic clusters connect service pages with deeper articles — explore guides related to{" "}
        {service.title.toLowerCase()}.
      </p>
      <ul className="space-y-3">
        {service.relatedPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}/`}
              className="group flex items-start justify-between gap-4 rounded-xl border border-border/70 p-5 transition-colors hover:border-primary/35 hover:bg-primary/5"
            >
              <div>
                <h3 className="font-heading font-semibold text-foreground group-hover:text-primary">
                  {post.title}
                </h3>
                {post.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
                ) : null}
              </div>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServiceFinalCtaSection({ service }: { service: Service }) {
  return (
    <section
      id="contact-cta"
      aria-labelledby="service-cta-heading"
      className="scroll-mt-28 border-t border-border/60 py-16 md:py-20"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-card to-card p-8 text-center sm:p-10">
        <h2
          id="service-cta-heading"
          className="font-heading text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Ready to discuss {service.title.toLowerCase()}?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Share your product context, timeline, and constraints — I will respond with honest
          feedback on scope and fit.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={service.hero.primaryCta.href}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {service.hero.primaryCta.label}
          </Link>
          {service.hero.secondaryCta ? (
            <Link
              href={service.hero.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/35 hover:bg-primary/5"
            >
              {service.hero.secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ServiceInlineCta({ service }: { service: Service }) {
  return (
    <div className="my-8 rounded-xl border border-border/70 bg-muted/30 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <p className="text-sm text-muted-foreground">
        Want to talk through {service.seo.focusKeyword} for your product?
      </p>
      <Link
        href={service.hero.primaryCta.href}
        className="mt-3 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:mt-0"
      >
        {service.hero.primaryCta.label}
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
