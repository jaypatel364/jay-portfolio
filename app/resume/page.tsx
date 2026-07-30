import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { EXPERIENCES, EDUCATION, SKILL_CATEGORIES } from "@/lib/resume-data";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Resume`,
  description: siteConfig.description,
};

export default function ResumePage() {
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);

  return (
    <>
      {/*
        Print-specific overrides injected inline so they work without a
        separate CSS file. Screen styles use Tailwind; @media print strips
        chrome and forces black-on-white.
      */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .resume-page { max-width: 100% !important; padding: 0 !important; }
          .resume-card { border: 1px solid #e5e7eb !important; box-shadow: none !important; }
          a { color: inherit !important; text-decoration: none !important; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      <div className="min-h-screen bg-background py-10 px-4 print:bg-white print:py-0">
        <div className="resume-page mx-auto max-w-3xl space-y-8">

          {/* ── Top bar (hidden on print) ─────────────────────────────── */}
          <div className="no-print flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-3">
            <p className="text-sm text-muted-foreground">
              Press{" "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
                Ctrl+P
              </kbd>{" "}
              /{" "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
                ⌘P
              </kbd>{" "}
              to save as PDF
            </p>
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Google Drive PDF
              </a>
              <Link
                href="/"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                ← Portfolio
              </Link>
            </div>
          </div>

          {/* ── Header ───────────────────────────────────────────────── */}
          <header className="resume-card rounded-2xl border border-border bg-card p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                  {siteConfig.name}
                </h1>
                <p className="mt-1 text-base font-medium text-primary">
                  Full Stack Developer · MERN Stack
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {siteConfig.description}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:text-right">
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors">
                  {siteConfig.email}
                </a>
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  github.com/jaypatel364
                </a>
                <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  linkedin.com/in/jaypatelfullstack
                </a>
                <span>{siteConfig.location}</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { label: "Experience", value: `${expLabel} years` },
                { label: "Projects", value: `${siteConfig.projectCount}+` },
                { label: "Stack", value: "MERN" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs"
                >
                  <span className="font-semibold text-foreground">{value}</span>
                  <span className="ml-1.5 text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </header>

          {/* ── Experience ───────────────────────────────────────────── */}
          <Section title="Work Experience">
            <div className="space-y-5">
              {EXPERIENCES.map((exp) => (
                <div
                  key={exp.title + exp.company}
                  className="resume-card rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground">
                        {exp.title}
                      </h3>
                      <p className="text-sm font-medium text-primary">{exp.company}</p>
                    </div>
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground sm:text-right">
                      <span>{exp.period}</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {exp.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Skills ───────────────────────────────────────────────── */}
          <Section title="Skills & Technologies">
            <div className="resume-card rounded-xl border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {SKILL_CATEGORIES.map(({ category, skills }) => (
                  <div key={category}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── Education ────────────────────────────────────────────── */}
          <Section title="Education">
            <div className="space-y-4">
              {EDUCATION.map((edu) => (
                <div
                  key={edu.degree}
                  className="resume-card rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground">
                        {edu.degree}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground">{edu.school}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{edu.year}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{edu.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Footer ───────────────────────────────────────────────── */}
          <footer className="pb-8 text-center text-xs text-muted-foreground">
            <p>
              {siteConfig.email} · {siteConfig.location}
            </p>
            <p className="mt-1 no-print">
              View the interactive portfolio at{" "}
              <Link href="/" className="text-primary hover:underline">
                {siteConfig.title}
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

// ── Reusable section wrapper ────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading mb-4 text-lg font-bold text-foreground after:ml-3 after:inline-block after:h-px after:w-16 after:translate-y-[-3px] after:bg-primary after:align-middle after:content-['']">
        {title}
      </h2>
      {children}
    </section>
  );
}
