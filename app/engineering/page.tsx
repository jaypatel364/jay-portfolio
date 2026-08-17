import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { features } from "@/settings/features";
import { SiteChrome } from "@/components/layout";
import { identity } from "@/settings/identity";
import { engineeringPageMetadata } from "@/settings/seo";

export const metadata: Metadata = engineeringPageMetadata;

const FLOWS = [
  {
    title: "Request path",
    items: [
      "Visitor hits Vercel (Next.js 15 App Router).",
      "Homepage HTML includes sections; games/chat/effects load after hydration.",
      "POST /api/chat → origin check → hashed IP rate limit → canned answer or Groq stream.",
      "POST /api/contact → origin check → rate limit → Mongo and/or SMTP (503 if neither works).",
    ],
  },
  {
    title: "Config & content",
    items: [
      "settings/ is the source of truth (identity, flags, FAQ, SEO, projects).",
      "lib/ holds utils, resume rows, rate limits, and origin hashing.",
      "No CMS. Copy changes are PRs.",
    ],
  },
  {
    title: "Quality gates",
    items: [
      "CI: format, ESLint, tsc, Vitest, production build, npm audit (high).",
      "Husky: lint-staged + pre-push typecheck.",
      "SonarCloud on main. Sentry when DSN is set (no session replay, no raw IPs).",
    ],
  },
];

export default function EngineeringPage() {
  if (!features.showEngineeringPage) notFound();

  return (
    <SiteChrome>
      <main id="main" className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          How it is built
        </p>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Engineering
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          This page is the production map for {identity.fullName}&apos;s portfolio — the same system
          described in the repo docs, without env values or prompt dumps.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-primary">
          <Link
            href={identity.github}
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the repo
          </Link>
          <Link href="/#projects" className="hover:underline">
            Case studies
          </Link>
        </div>

        <section className="mt-12 space-y-10">
          {FLOWS.map((block) => (
            <div key={block.title}>
              <h2 className="font-heading text-xl font-bold">{block.title}</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-xl font-bold">What this site does not do</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            <li>No PWA / service worker (stale caches were a launch risk).</li>
            <li>No fabricated testimonials.</li>
            <li>NDA client work has no public repos or screenshots.</li>
            <li>Indexing stays off until the custom domain is verified (`allowIndexing`).</li>
          </ul>
        </section>
      </main>
    </SiteChrome>
  );
}
