# Jay Patel Portfolio — Production Audit & Roadmap

**Site:** https://jaypateldev.com  
**Repo:** jay-portfolio  
**Date:** 17 August 2026  
**Scope:** Codebase inspection (architecture, security, SEO, CI/CD, UX) — not generic portfolio advice.

This document is the complete engineering audit. Convert to PDF later if needed; everything lives here.

---

## How to read status labels

| Label                   | Meaning                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------- |
| **Already implemented** | Present and sufficient, or present with only minor notes                              |
| **Needs improvement**   | Exists but is incomplete, incorrect, or not production-grade                          |
| **Missing**             | Not in the repo                                                                       |
| **Needs verification**  | Cannot be confirmed from the repository (Vercel, DNS, GitHub settings, live env vars) |

Priority: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

# 1. Executive Summary

This codebase is already a **feature-rich, well-structured Next.js 15 portfolio** with real production pieces (Groq chat, Upstash rate limits, Sentry, CI, SonarCloud, security headers). It is **not yet production-ready for jaypateldev.com**.

The biggest gaps are launch hygiene, a homepage SSR hole, missing brand assets, thin indexable content, zero tests, and a large unused-dependency surface — not “add more widgets.”

**What you already have:** a section-oriented architecture (`STRUCTURE.md`), a real settings layer, two API routes with Zod + rate limiting, JSON-LD, Husky, CI (format/lint/typecheck/build), SonarCloud, Sentry hooks, a print resume route, PWA wiring, and a very polished client UX (command palette, games, chatbot, GitHub heatmap, 3D skill sphere).

**What will fail or underperform on jaypateldev.com today:**

| Issue                                                                           | Status   | Why it matters                                      |
| ------------------------------------------------------------------------------- | -------- | --------------------------------------------------- |
| `allowIndexing: false`                                                          | Blocking | Google will not index the site                      |
| `public/robots.txt` still points at `jay-portfolio.vercel.app`                  | Blocking | Wrong sitemap / wrong property                      |
| No `og-image.png`, no `favicon.ico`, no PWA icons                               | Blocking | Broken social cards, broken install, 404 icons      |
| `LoadingScreenWrapper` returns `null` on the server                             | Blocking | Homepage HTML has **no `<h1>` / sections** until JS |
| Contact API returns 200 even if Mongo **and** SMTP fail                         | Blocking | Lost inbound leads                                  |
| Personal projects all use `hideCode: true`                                      | High     | Recruiters cannot inspect the work                  |
| `npm audit`: **5 high / 4 moderate** (nodemailer, next/postcss/sharp, next-pwa) | High     | Supply-chain risk before go-live                    |
| Zero tests                                                                      | High     | CI cannot prove the APIs still work                 |
| Fake `SearchAction` in WebSite JSON-LD                                          | Medium   | Claims a search box that does not exist             |

**Verdict:** treat this as a **pre-launch hardening sprint**, then add 2–3 deep showcase features (case studies, engineering page, tests). Do not add more games or more shadcn primitives.

---

# 2. Current Architecture Understanding

**Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4, Framer Motion, Vercel.

**Runtime map (from `INFRA.md` + code):**

```
Visitor → Vercel (Next.js 15)
  ├── /                 sections + client features
  ├── /resume           print resume
  ├── /api/chat         Groq stream + canned answers + rate limit
  ├── /api/contact      Zod + honeypot + Mongo + SMTP + rate limit
  ├── GitHub heatmap    github-contributions-api.jogruber.de (ISR 1h)
  └── Errors            Sentry (optional DSN)
```

## Routes that actually exist

| Route                   | File                                                         | Notes                         |
| ----------------------- | ------------------------------------------------------------ | ----------------------------- |
| `/`                     | `app/page.tsx`                                               | Single long homepage          |
| `/resume`               | `app/resume/page.tsx`                                        | Metadata + breadcrumb JSON-LD |
| `/api/chat`             | `app/api/chat/route.ts`                                      | POST only                     |
| `/api/contact`          | `app/api/contact/route.ts`                                   | POST only                     |
| `/sitemap.xml`          | `app/sitemap.ts`                                             | Home + resume                 |
| `/manifest.webmanifest` | `app/manifest.ts`                                            | PWA                           |
| 404 / error             | `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx` | Present                       |

## Already implemented well (do not rebuild)

- Settings split: `settings/identity.ts`, `features.ts`, `content.ts`, `chat.ts`, `seo.ts`
- Section folders under `components/sections/*` with barrels
- Cross-cutting features under `components/features/*`
- Security headers in `next.config.ts` (HSTS, CSP, XFO, nosniff, Referrer-Policy, Permissions-Policy, `poweredByHeader: false`)
- Chat: Zod, injection regex, off-topic filter, token budget, canned answers, 429s
- Contact: Zod, HTML escape in email, honeypot on API, rate limit
- Rate limit: Upstash with in-memory fallback (`lib/rate-limit.ts`)
- Error isolation: `SectionErrorBoundary`, Sentry inits, `removeConsole` in production
- Docs: `README.md`, `STRUCTURE.md`, `INFRA.md` are unusually good for a personal site
- CI: `.github/workflows/ci.yml` (pinned SHAs), SonarCloud on `main`
- Husky: lint-staged + pre-push `tsc`

## Intentionally unused / incomplete

- `components/sections/testimonials/` exists with **fabricated quotes** and is **not** mounted in `app/page.tsx` (correct — do not enable)
- `showStackBuild` / `showNumberNinja` are `false`, but those games are still **statically imported** in `GameZone.tsx`
- PWA plugin is wired; **icon files do not exist** (`public/icons/README.md` only)

## External configuration — needs verification

Vercel env vars, custom domain DNS/SSL, Upstash/Groq/Sentry/Mongo/SMTP actually set, GitHub branch protection, secret scanning, SonarCloud project import, Calendly URL, Google Drive resume sharing.

---

# 3. Top 15 Feature Recommendations

These assume the launch blockers in §9 are done first. They are chosen because they fit **this** repo, not a generic portfolio template.

**Not in the top 15 (already exist at sufficient fidelity):** dark mode, contact form, games hub, chatbot, command palette, FAQ accordion, GitHub heatmap UI, 3D sphere, Konami, Catch the Bug, accent picker, loading boot sequence.

---

## Feature #1

**Name:** Project case-study routes (`/projects/[slug]`)

**What it does:** Turns each real project into a long-form page: problem, constraints, architecture, your role, tech trade-offs, screenshots, and (for non-NDA work) repo/demo links. Homepage cards become an index, not the whole story.

**Why it is valuable:** Recruiters and clients cannot evaluate “Chat App / MiniList CMS / Verify 360” from a 3-line card. Case studies are the highest-signal content you can add, and they create indexable URLs for “Jay Patel MiniList CMS” / “NestJS GraphQL social API.”

**How it fits this existing codebase:** Extract `PROJECTS` from `components/sections/projects/ProjectsSection.tsx` into `settings/` or `lib/projects.ts`. Add `app/projects/[slug]/page.tsx` + `generateStaticParams` + per-page metadata in `settings/seo.ts`. Keep the current grid as the index. Wire sitemap in `app/sitemap.ts`.

**Technical implementation:** Static generation. MDX or typed TS objects (prefer typed TS to match `settings/`). `SoftwareSourceCode` / `CreativeWork` JSON-LD only when a public repo exists. NDA projects: architecture narrative only, no screenshots of client data.

**UI/UX:** Same visual language as `/resume`. TOC, stack chips, architecture diagram (static SVG), “View demo / View code.”

**Data/API requirements:** Static data. Optional GitHub API later.

**Complexity:** Medium  
**Impact:** Very High  
**Dependencies:** Real write-ups; public repos for personal projects (today all three public demos have `hideCode: true`).  
**Potential risks:** NDA leakage; thin pages that look like padding.  
**Suggested implementation order:** Phase 3, immediately after launch. Highest-leverage feature.

---

## Feature #2

**Name:** Dynamic Open Graph images (`next/og`)

**What it does:** Generates 1200×630 cards at `/api/og` (and per-page variants) using your OKLCH tokens, name, and role. Homepage, resume, and each case study get a distinct card.

**Why it is valuable:** `settings/seo.ts` already points at `/og-image.png`, but **that file does not exist**. LinkedIn/Twitter/Slack shares will look broken. Dynamic OG is also a visible “I know how sharing actually works” detail.

**How it fits:** Replace `OG_IMAGE` in `settings/seo.ts`. Add `app/api/og/route.tsx`. Use `metadataBase` already in `rootMetadata`.

**Technical implementation:** `ImageResponse` (Satori). Self-hosted fonts already in `@fontsource/*` — pass a subset. Cache-Control immutable. No extra service.

**UI/UX:** Users never “use” it; they see a branded card when the URL is pasted.

**Data/API requirements:** None (Edge).  
**Complexity:** Low–Medium  
**Impact:** High  
**Dependencies:** Production `NEXT_PUBLIC_SITE_URL`.  
**Potential risks:** Edge bundle size if you embed too many font weights.  
**Suggested implementation order:** Phase 0 (static PNG is enough to launch) → Phase 1 (dynamic).

---

## Feature #3

**Name:** `/engineering` — “How this site is built”

**What it does:** A public page that diagrams the real system: App Router, `settings/` as source of truth, `/api/chat` and `/api/contact` pipelines, Upstash windows, CSP headers, CI jobs, SonarCloud, Sentry, ISR for GitHub graph. Link to `STRUCTURE.md` / GitHub.

**Why it is valuable:** This is the one page that makes a staff engineer think “this person ships production software,” because the proof is the live site, not a bullet on a resume. You already have the content in `INFRA.md`.

**How it fits:** New section folder `components/sections/engineering/` **or** a dedicated `app/engineering/page.tsx` (better for SEO than another homepage hash). Nav item in `Navbar.tsx` / command palette.

**Technical implementation:** Static page. Optionally read `package.json` version and expose a sanitized “headers we send” list from the same source as `next.config.ts` (do not duplicate blindly). No admin auth.

**UI/UX:** Architecture diagram, request-flow for chat/contact, CI screenshot or badge, “open the repo.”

**Data/API requirements:** Static. Optional public GitHub badges.  
**Complexity:** Medium  
**Impact:** Very High  
**Dependencies:** Repo should be public; claims must match code (do not list Vitest until tests exist).  
**Potential risks:** Oversharing secrets/architecture of Groq prompts is fine; do not paste env values.  
**Suggested implementation order:** Phase 3, after tests exist so the page is honest.

---

## Feature #4

**Name:** Hosted resume PDF (replace Google Drive)

**What it does:** `/resume` already renders a print layout. Add a real PDF at `/jay-patel-resume.pdf` (or generate via print CSS / `react-pdf`) and point `identity.resumeUrl` at your domain.

**Why it is valuable:** Drive links look junior, can break sharing, and send users off-domain. `https://jaypateldev.com/resume` + a first-party PDF is what recruiters actually download.

**How it fits:** `settings/identity.ts` `resumeUrl`, `app/resume/page.tsx` download button, command palette “Download resume,” chatbot canned resume answer in `settings/chat.ts`.

**Technical implementation:** Simplest: export print-to-PDF once into `public/`. Better: CI job that prints `/resume` with Playwright on each release. Avoid a new microservice.

**UI/UX:** Same `/resume` page; download no longer opens Drive.

**Data/API requirements:** Static file or Playwright in CI.  
**Complexity:** Low (static PDF) / Medium (automated)  
**Impact:** High  
**Dependencies:** Keep `lib/resume-data.ts` as the single source of truth (Experience section currently **duplicates** it).  
**Potential risks:** PDF going stale vs HTML resume.  
**Suggested implementation order:** Phase 0 (upload a current PDF) then automate in Phase 2.

---

## Feature #5

**Name:** First-party GitHub stats (replace jogruber.de)

**What it does:** Fetch contributions, pinned repos, language mix, and recent public commits via GitHub’s API (server-only, ISR). Render the existing heatmap plus a “public work” strip.

**Why it is valuable:** `lib/github-contributions.ts` and `github-utils.tsx` hardcode `?y=2025&y=2026` against a third-party host. That is a single-point-of-failure, a CSP `connect-src` dependency, and it will rot in 2027. Official API is what a production app would use.

**How it fits:** `lib/github-contributions.ts`, `AboutSection.tsx` (already a server wrapper), `GitHubGraph.tsx`. Add `GITHUB_TOKEN` (fine-grained, public-repo read) to Vercel.

**Technical implementation:** Server `fetch` + `revalidate: 3600`. Never expose the token. Fallback to empty graph already exists. Pin years dynamically (`currentYear` and `currentYear-1`).

**UI/UX:** Same heatmap; optional pinned-repo cards that deep-link to case studies.

**Data/API requirements:** GitHub API + optional token (higher rate limit).  
**Complexity:** Medium  
**Impact:** High  
**Dependencies:** Public GitHub profile; token in Vercel.  
**Potential risks:** Token leak; rate limits; heatmap looking empty if the token is missing.  
**Suggested implementation order:** Phase 1 (dynamic years + fallback) then Phase 3 (pinned repos).

---

## Feature #6

**Name:** Route-level code splitting for Game Zone, chatbot, and easter eggs

**What it does:** Homepage JS currently statically imports **every game** in `GameZone.tsx` (including disabled StackBuild/NumberNinja), plus ChatBot, Konami, CatchTheBug, CursorTrail. Load them with `next/dynamic` after idle / on open.

**Why it is valuable:** This is a real performance engineering fix, not a gimmick. It improves INP/TBT and is something you can show on `/engineering` with before/after bundle stats.

**How it fits:** `app/page.tsx` imports, `components/features/games/GameZone.tsx`, `components/features/games/index.ts` (barrel currently re-exports all games).

**Technical implementation:** `next/dynamic({ ssr: false })` for GameZone hub and each game. ChatBot: load on first FAB click or `requestIdleCallback`. Keep hero/about/skills HTML in the critical path.

**UI/UX:** First open of Game Zone may show a 150ms skeleton; then identical UX.

**Data/API requirements:** None.  
**Complexity:** Low–Medium  
**Impact:** High  
**Dependencies:** None.  
**Potential risks:** Layout pop on lazy load — reserve FAB space.  
**Suggested implementation order:** Phase 1 (before launch if you have a day; otherwise first week).

---

## Feature #7

**Name:** API contract tests + a tiny public API docs page

**What it does:** Vitest tests for `/api/contact` and `/api/chat` (validation, honeypot, 429 shape, 503 without Groq). A `/engineering/api` page documenting request/response, rate limits, and what is **not** a public product API.

**Why it is valuable:** You already built non-trivial APIs. Without tests they are a liability. With tests + docs they become a portfolio artifact. Resume currently lists “Jest / Vitest” (`lib/resume-data.ts`) while the repo has **zero** test files.

**How it fits:** New `tests/api/` or `app/api/**/route.test.ts`. CI step in `.github/workflows/ci.yml`. Docs live next to Feature #3.

**Technical implementation:** Vitest + handler tests. Mock Groq/Mongo/SMTP. Do not hit real Groq in CI.

**UI/UX:** Engineers can read limits (6/min chat, 3/min contact) without opening source.

**Data/API requirements:** None in prod; mocks in CI.  
**Complexity:** Medium  
**Impact:** High  
**Dependencies:** Choose Vitest (matches resume + Next 15).  
**Potential risks:** Flaky tests if you hit real Upstash.  
**Suggested implementation order:** Phase 2, right after launch.

---

## Feature #8

**Name:** Engineering notes in MDX (not a generic blog)

**What it does:** 4–8 long-form notes: “CSP on a Next.js portfolio,” “rate limiting chat on Vercel,” “building a 3D skill sphere without Three.js,” “fail-closed contact forms.” RSS + `Article` JSON-LD.

**Why it is valuable:** Single-page sites have almost nothing for Google besides the homepage. Notes targeting “Jay Patel Next.js” / specific techniques create durable discovery. Quality over cadence.

**How it fits:** `app/notes/[slug]/page.tsx`, `content/notes/*.mdx`, sitemap expansion. Do **not** add Sanity (you already have `cdn.sanity.io` in `images.remotePatterns` but no CMS).

**Technical implementation:** Next MDX, static params, reading time, canonical per note.

**UI/UX:** Typographic article layout, back to `/notes`, share card via Feature #2.

**Data/API requirements:** Static MDX.  
**Complexity:** Medium  
**Impact:** High (long-term SEO)  
**Dependencies:** You actually writing them.  
**Potential risks:** Empty blog looks worse than no blog. Launch with ≥3 finished pieces or wait.  
**Suggested implementation order:** Phase 4 unless you already have drafts.

---

## Feature #9

**Name:** Lighthouse CI + bundle budgets in GitHub Actions

**What it does:** On each PR: Lighthouse (perf/a11y/SEO) against a preview or `next start`, plus `ANALYZE=true` webpack/turbopack stats with a max JS budget for `/`.

**Why it is valuable:** You already run format/lint/typecheck/build. Adding measurable budgets is the next honest CI step. It also catches the Game Zone bundle problem automatically.

**How it fits:** New job in `.github/workflows/ci.yml` or `lighthouse.yml`. Optional comment on PRs. Vercel preview URL — **needs verification** that previews exist.

**Technical implementation:** `lhci autorun` with assertions: LCP, CLS, INP, a11y ≥ 90. Fail on JS budget regression.

**UI/UX:** None for visitors; PR checks for you.

**Data/API requirements:** GitHub Actions; optional LHCI GitHub app.  
**Complexity:** Medium  
**Impact:** High (as a showcase + quality gate)  
**Dependencies:** Stable preview URL or local `next start` in CI.  
**Potential risks:** Flaky Lighthouse on shared runners — average 3 runs.  
**Suggested implementation order:** Phase 2.

---

## Feature #10

**Name:** Typed env validation + fail-closed contact

**What it does:** `@t3-oss/env-nextjs` (or Zod in `lib/env.ts`) validates env at boot. Contact route returns **503** if neither Mongo nor SMTP is configured. Chat already 503s without Groq — match that pattern.

**Why it is valuable:** Today `app/api/contact/route.ts` always returns `{ success: true }` even when it logs “Message received but not persisted.” That is a production incident waiting for the first recruiter email.

**How it fits:** `app/api/contact/route.ts`, `.env.example`, `INFRA.md`. Optional `GET /api/health` that reports `{ contact: "smtp"|"mongo"|"unconfigured", chat: boolean }` without leaking secrets.

**Technical implementation:** Zod env schema. Distinguish server vs `NEXT_PUBLIC_*`. Fail build in production if `NEXT_PUBLIC_SITE_URL` is still `https://your-domain.com`.

**UI/UX:** Contact form shows a truthful error if backends are down.

**Data/API requirements:** Existing Mongo/SMTP.  
**Complexity:** Low  
**Impact:** Very High (reliability)  
**Dependencies:** At least one of SMTP or Mongo on Vercel.  
**Potential risks:** None if you actually configure a backend.  
**Suggested implementation order:** Phase 0. This is not a “feature” for the homepage — it is required.

---

## Feature #11

**Name:** Chat link allowlist + prompt-injection hardening v2

**What it does:** `renderContent` in `chat-content.tsx` turns any `https://…` from the model into a clickable pill. Allowlist: your domain, GitHub, LinkedIn, Calendly, Drive (until PDF is first-party). Log/drop other URLs. Add origin check on `/api/chat`. Keep regex guards but treat them as defense-in-depth, not security.

**Why it is valuable:** A jailbroken `llama-3.1-8b-instant` can emit phishing links. Recruiters will click pills. This is real XSS-adjacent / social-engineering risk on a public LLM endpoint.

**How it fits:** `components/features/chatbot/chat-content.tsx`, `app/api/chat/route.ts`.

**Technical implementation:** Parse URL, allow hostnames. Reject `javascript:` (already mostly excluded by `http` split). Optional: strip markdown links. Origin header allowlist (`jaypateldev.com` + Vercel previews).

**UI/UX:** Unknown links render as plain text, not pills.

**Data/API requirements:** None.  
**Complexity:** Low  
**Impact:** High (security)  
**Dependencies:** Final domain list.  
**Potential risks:** Over-blocking legitimate GitHub repo URLs — allow `github.com`.  
**Suggested implementation order:** Phase 0–1.

---

## Feature #12

**Name:** `public/security.txt` + visible security posture

**What it does:** RFC 9116 `/.well-known/security.txt`, plus a short `/security` page: headers you ship, rate limits, “no user accounts,” how to report issues. Mirrors what you already do in `next.config.ts`.

**Why it is valuable:** Cheap signal of professional ops. Pairs with Feature #3. Useful if someone finds a Groq key leak or form abuse.

**How it fits:** `app/.well-known/security.txt/route.ts` or `public/.well-known/security.txt`. Email from `identity.ts`.

**Technical implementation:** Static. `Contact: mailto:…`, `Canonical`, `Expires` (max 1 year).

**UI/UX:** Almost none; security researchers and some crawlers look for it.

**Data/API requirements:** None.  
**Complexity:** Low  
**Impact:** Medium  
**Dependencies:** A mailbox you monitor.  
**Potential risks:** Expired `Expires` field looks sloppy — calendar reminder.  
**Suggested implementation order:** Phase 1.

---

## Feature #13

**Name:** `/now` + portfolio changelog

**What it does:** A Now page (what you’re building/learning — `currentlyBuilding` / `currentlyLearning` in `settings/content.ts` are **empty**) and `CHANGELOG.md` rendered at `/changelog` for this repo.

**Why it is valuable:** Shows you ship continuously. Gives Google a date-modified URL. Fills the dead “Currently building” UI you already coded in `AboutSectionClient.tsx`.

**How it fits:** Fill `settings/content.ts`; add `app/now/page.tsx` or just populate the existing badges. Changelog from conventional commits later (only if you adopt commitlint).

**Technical implementation:** Static. Update monthly. No CMS.

**UI/UX:** About badges actually appear; optional dedicated page.

**Data/API requirements:** Static.  
**Complexity:** Low  
**Impact:** Medium  
**Dependencies:** Discipline to update.  
**Potential risks:** Stale “now” is worse than empty.  
**Suggested implementation order:** Phase 1 (fill existing fields) / Phase 3 (pages).

---

## Feature #14

**Name:** Playwright accessibility + keyboard E2E

**What it does:** A few E2E tests: homepage has `h1`, skip link works, contact validation, chat 429, command palette `⌘K`, FAQ accordion keyboard, `/resume` print CSS doesn’t explode. axe-core on `/` and `/resume`.

**Why it is valuable:** You already have substantial `aria-*` and `prefers-reduced-motion`. That is unverified. Automated a11y is the difference between “we added labels” and “we enforce WCAG in CI.”

**How it fits:** `e2e/*.spec.ts`, CI job after build. axe on the **post-loading-screen** DOM (see SSR bug).

**Technical implementation:** Playwright. No visual regression at first (high maintenance).

**UI/UX:** None for visitors.

**Data/API requirements:** None.  
**Complexity:** Medium  
**Impact:** High  
**Dependencies:** Fix LoadingScreen SSR first or tests will see a blank page.  
**Potential risks:** Slow CI — run on PRs only, not every push to a feature branch if needed.  
**Suggested implementation order:** Phase 2, after Feature #6 and the loading-screen fix.

---

## Feature #15

**Name:** Design-token / theme lab (`/lab`)

**What it does:** Documents OKLCH tokens, 6 accent presets (`lib/accent-colors.ts`), type scale, motion rules, reduced-motion behavior. Live swatches; copy CSS variables.

**Why it is valuable:** Shows frontend systems thinking without a fake Storybook of unused Radix primitives. You already have a real token system in `app/globals.css`.

**How it fits:** `app/lab/page.tsx`, `lib/accent-colors.ts`, `hooks/use-accent.ts`. `noindex` this page if you don’t want it competing with core URLs — or index it as a frontend case study.

**Technical implementation:** Client island for live accent switching; rest static.

**UI/UX:** Internal-looking but public; “this is the design system behind jaypateldev.com.”

**Data/API requirements:** None.  
**Complexity:** Low  
**Impact:** Medium  
**Dependencies:** None.  
**Potential risks:** Looks like leftover shadcn if you dump unused components — only document **used** tokens.  
**Suggested implementation order:** Phase 4, or a weekend after launch.

---

# 4. Production Security Audit

## Application security

### Contact form always succeeds

**Current status:** Partially implemented  
**Evidence:** `app/api/contact/route.ts` lines 236–249 — if Mongo save and SMTP both fail (or both unconfigured), still `{ success: true }`. Client in `ContactSection.tsx` treats any 2xx as success + confetti.  
**Risk:** Recruiters think they reached you; you never see the message.  
**Severity:** High  
**What should be changed:** Return 503 unless `saved || sent`. Optionally queue to Sentry.  
**Implementation location:** `app/api/contact/route.ts`, `ContactSection.tsx`  
**Production requirement:** MUST HAVE before production

### Honeypot not sent by the real form

**Current status:** Partially implemented  
**Evidence:** API checks `website` (`route.ts` 213–221). Client honeypot returns early **without calling the API** and never includes `website` in JSON (`ContactSection.tsx` 20, 26–30).  
**Risk:** Low for form bots; API remains callable without honeypot. Origin check is the real fix.  
**Severity:** Low  
**What should be changed:** Send `website: ""` from the client; reject non-browser callers via Origin.  
**Implementation location:** `ContactSection.tsx`, both API routes  
**Production requirement:** Strongly recommended

### No Origin / CSRF check on APIs

**Current status:** Missing  
**Evidence:** No `middleware.ts`. No `Origin`/`Host` check in `app/api/chat/route.ts` or `contact/route.ts`. JSON POST is not a “simple request,” so browsers preflight — **not** a full CSRF story for non-browser clients.  
**Risk:** Scripted spam against Groq quota and SMTP. Rate limit mitigates per IP.  
**Severity:** Medium  
**What should be changed:** Allow `https://jaypateldev.com` + `https://*.vercel.app` previews. Reject others with 403.  
**Implementation location:** `lib/request-origin.ts` + both routes, or `middleware.ts`  
**Production requirement:** MUST HAVE before production

### Chat model URLs rendered as links

**Current status:** Partially implemented  
**Evidence:** `chat-content.tsx` `renderContent` splits on `https?:\/\/\S+` and sets `href={part}`.  
**Risk:** Phishing via model output. `javascript:` is not matched; `https://evil.com` is.  
**Severity:** Medium  
**What should be changed:** Hostname allowlist (Feature #11).  
**Implementation location:** `chat-content.tsx`  
**Production requirement:** MUST HAVE before production

### Prompt-injection guards are best-effort

**Current status:** Partially implemented  
**Evidence:** `INJECTION_PATTERNS` in `app/api/chat/route.ts`. Easy to bypass; system prompt in `settings/chat.ts` still sent to Groq.  
**Risk:** Persona jailbreak, off-policy answers, link injection. Not RCE.  
**Severity:** Low–Medium  
**What should be changed:** Allowlist links; don’t claim “secure against jailbreaks” on `/engineering`.  
**Implementation location:** chat route + UI  
**Production requirement:** Strongly recommended

### IP stored and forwarded as PII

**Current status:** Partially implemented  
**Evidence:** Contact payload inserts `ip` into Mongo; email body includes IP; `captureServerError(err, { route, ip })` in chat/contact. Sentry `sendDefaultPii: false` but IP is in `extra`.  
**Risk:** DPDP/GDPR-style exposure in Atlas + Sentry.  
**Severity:** Medium  
**What should be changed:** Hash IP for rate-limit keys only; don’t store raw IP in Mongo/email; don’t send IP to Sentry.  
**Implementation location:** `app/api/contact/route.ts`, `lib/sentry.ts`  
**Production requirement:** Strongly recommended

### `x-forwarded-for` trust

**Current status:** Partially implemented  
**Evidence:** `getClientIp` in `lib/rate-limit.ts` uses first `x-forwarded-for` hop. On Vercel this is set by the platform. Off-Vercel it is spoofable.  
**Risk:** Rate-limit bypass if not behind Vercel.  
**Severity:** Low (on Vercel) / High (elsewhere)  
**What should be changed:** Document “Vercel only”; use Vercel’s forwarded IP guidance.  
**Implementation location:** `lib/rate-limit.ts`  
**Production requirement:** Strongly recommended

### JSON-LD `dangerouslySetInnerHTML`

**Current status:** Partially implemented  
**Evidence:** `app/page.tsx`, `app/resume/page.tsx` — `JSON.stringify(schema)`. FAQ answers come from `settings/content.ts` (you control them).  
**Risk:** `</script>` in FAQ copy could break out of the script tag.  
**Severity:** Low  
**What should be changed:** `JSON.stringify(schema).replace(/</g, "\\u003c")`.  
**Implementation location:** page JSON-LD injection  
**Production requirement:** Strongly recommended

### Konami `innerHTML`

**Current status:** Already implemented (safe)  
**Evidence:** `KonamiEasterEgg.tsx` line 77 — static string, no user input.  
**Risk:** None today.  
**Severity:** Low  
**What should be changed:** Prefer `textContent` if you ever interpolate.  
**Implementation location:** `components/effects/KonamiEasterEgg.tsx`  
**Production requirement:** Nice to have

### Error message leakage

**Current status:** Already implemented  
**Evidence:** APIs return generic strings. `SectionErrorBoundary` stores `error.message` but does **not** render it. `app/error.tsx` is generic. Production silences `console.log/warn` via `lib/silence-console.ts` + inline script in `app/layout.tsx`.  
**Risk:** Low.  
**Severity:** Low  
**Production requirement:** Nice to have (keep as-is)

### Client-side secrets

**Current status:** Already implemented (good pattern)  
**Evidence:** Only `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_SENTRY_DSN` are public. Groq/Mongo/SMTP/Upstash are server-only.  
**Risk:** Sentry DSN is public by design (ingest can be abused).  
**Severity:** Low  
**What should be changed:** Sentry ingest rate limits / allowed domains in Sentry UI.  
**Implementation location:** Sentry project settings — **needs verification**  
**Production requirement:** Strongly recommended

### `.gitignore` does not ignore all env files

**Current status:** Partially implemented  
**Evidence:** `.gitignore` has `.env` and `*.local`, not `.env*`. `.env.production` / `.env.development` could be committed.  
**Risk:** Accidental secret commit.  
**Severity:** High  
**What should be changed:** `.env*` + `!.env.example`.  
**Implementation location:** `.gitignore`  
**Production requirement:** MUST HAVE before production

### Dead / leftover stack files

**Current status:** Missing cleanup  
**Evidence:** `lib/error-capture.ts` (h3/server.ts comments) is unused. `lib/error-page.ts` unused. `.gitignore` still lists `.vinxi`, `.tanstack`, `.nitro`.  
**Risk:** Confusion; not a direct exploit.  
**Severity:** Low  
**What should be changed:** Delete unused files.  
**Production requirement:** Nice to have

### Open redirects

**Current status:** Already implemented (no open redirect found)  
**Evidence:** No `redirect` based on query params. Project `href={project.demoUrl ?? "#"}` is static data.  
**Risk:** `#` fallback for missing `demoUrl` is a UX bug, not an open redirect.  
**Severity:** Low  
**What should be changed:** Don’t render Demo if `demoUrl` is missing.  
**Implementation location:** `ProjectsSection.tsx`  
**Production requirement:** Strongly recommended

### File uploads / SSRF (app)

**Current status:** Already implemented (N/A for uploads)  
**Evidence:** No upload endpoints. GitHub fetch URL is hardcoded. Nodemailer advisory (below) is the SSRF to care about.  
**Production requirement:** N/A

### Rate limiting

**Current status:** Already implemented (good, with caveats)  
**Evidence:** Chat 6/min + 30/hr; contact 3/min; Upstash prefix `portfolio`. In-memory fallback **does not work across Vercel isolates**.  
**Risk:** Without Upstash, Groq/SMTP abuse.  
**Severity:** High if Upstash unset; Low if set  
**What should be changed:** Require Upstash in production (fail closed or warn in health).  
**Implementation location:** `lib/rate-limit.ts`, Vercel env — **needs verification**  
**Production requirement:** MUST HAVE before production

---

## HTTP security

Headers in `next.config.ts` `securityHeaders` applied to `/(.*)`:

| Header                                                                     | Status                 | Assessment                                                                                         |
| -------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------- |
| `Strict-Transport-Security` `max-age=63072000; includeSubDomains; preload` | Already implemented    | Good. **Do not** submit to hstspreload.org until every subdomain is HTTPS — **needs verification** |
| `X-Frame-Options` `SAMEORIGIN`                                             | Already implemented    | Clickjacking protection. Redundant with CSP `frame-ancestors 'self'`                               |
| `X-Content-Type-Options` `nosniff`                                         | Already implemented    | Keep                                                                                               |
| `Referrer-Policy` `strict-origin-when-cross-origin`                        | Already implemented    | Good                                                                                               |
| `Permissions-Policy` camera/mic/geo/interest-cohort empty                  | Already implemented    | Good. Consider `payment=()`, `usb=()`                                                              |
| `X-DNS-Prefetch-Control` `on`                                              | Already implemented    | Fine                                                                                               |
| `Content-Security-Policy`                                                  | Partially implemented  | See below                                                                                          |
| `Cross-Origin-Opener-Policy`                                               | Missing                | Add `same-origin` (or `same-origin-allow-popups` if Calendly popups break)                         |
| `Cross-Origin-Resource-Policy`                                             | Missing                | `same-origin` is reasonable                                                                        |
| HTTPS enforcement                                                          | Needs verification     | Vercel provides this; confirm domain + redirects in dashboard                                      |
| CORS                                                                       | Missing (good default) | APIs don’t set `Access-Control-Allow-Origin` — keep it that way                                    |
| Cookies / SameSite                                                         | N/A                    | Theme is `localStorage`; no session cookies                                                        |

**CSP (current):**

```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval'
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob: https:
font-src 'self' data:
connect-src 'self' https://api.groq.com https://github-contributions-api.jogruber.de https://*.ingest.sentry.io
frame-src 'self' https://calendly.com https://drive.google.com
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'
```

**Issues:**

- `'unsafe-eval'` is a large hole (needed by some Next/PWA tooling — **needs verification** in a production build whether you can drop it).
- `'unsafe-inline'` scripts: expected without nonces; Next 15 can do nonce CSP — Medium effort.
- `img-src https:` allows any HTTPS image — overly broad; you don’t even use `next/image`.
- `frame-src` allows Calendly/Drive but the app **opens them in new tabs**, not iframes — tighten to `'none'` or `'self'`.
- `connect-src` includes Groq from the **browser**; chat goes to `/api/chat` (same origin). Browser does not need `api.groq.com` unless something client-side calls it. **Remove it** from CSP if unused — reduces impact of XSS.
- Missing: `upgrade-insecure-requests` (nice once HTTPS is confirmed).

**Production requirement:** Tightening `connect-src` / `frame-src` / `img-src` is **MUST HAVE**; nonce CSP is **Strongly recommended** after launch.

---

## Dependency security

**Current status:** Partially implemented

**Evidence:** `package-lock.json` exists; `packageManager: npm@10.9.2`; CI uses `npm ci`. No Dependabot/Renovate. Caret ranges on most deps.

**`npm audit` (production, run during this audit):** **9 issues — 5 high, 4 moderate, 0 critical.**

| Package                                                   | Severity | Notes                                                                                                     |
| --------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `nodemailer` ≤9.0.0 (you have `^8.0.7`)                   | High     | GHSA-p6gq-j5cr-w38f — raw option SSRF/file read. Your code does not pass `raw`, but **upgrade to ≥9.0.5** |
| `next` → `postcss` / `sharp`                              | High     | Transitive; don’t `audit fix --force` onto Next 16 blindly                                                |
| `@ducanh2912/next-pwa` → `serialize-javascript` / workbox | High     | PWA is already incomplete (no icons). Strong candidate to **remove PWA** until upstream is clean          |

**Unused production dependencies (install surface, not necessarily client bundle):** entire Radix suite except `@radix-ui/react-dialog` (used by `components/ui/dialog.tsx` / `command.tsx`); `recharts`, `date-fns`, `embla-carousel-react`, `react-day-picker`, `input-otp`, `vaul`, `react-resizable-panels`, `@hookform/resolvers`, `react-hook-form`. These look like a full shadcn init. They increase audit noise and supply-chain risk.

**What should be changed:**

1. Upgrade nodemailer to a patched 9.x and retest SMTP.
2. Remove unused Radix/shadcn packages.
3. Add Dependabot (`weekly`, npm + GitHub Actions).
4. `npm audit --audit-level=high` in CI (allowlist only with a comment).
5. Reconsider next-pwa.

**Production requirement:** Nodemailer upgrade + unused-dep prune = **MUST HAVE**; Dependabot = **MUST HAVE**; PWA removal = **Strongly recommended**

---

## Infrastructure / deployment

| Item                 | Status                   | Notes                                                                                            |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| `vercel.json`        | Already implemented      | `npm ci`, Next.js                                                                                |
| Docker               | Missing                  | Correct — don’t add                                                                              |
| Production env       | Needs verification       | Vercel dashboard                                                                                 |
| Sentry source maps   | Partially implemented    | Plugin **not** wrapped in `next.config.ts` (documented in `INFRA.md`)                            |
| CI permissions       | Missing                  | Workflows have **no** `permissions:` block — set `contents: read`                                |
| `GROQ_API_KEY` in CI | Already implemented      | Placeholder if secret missing — good                                                             |
| Sonar `SONAR_TOKEN`  | Needs verification       | Repo secret                                                                                      |
| Atlas `0.0.0.0/0`    | Documented in `INFRA.md` | Necessary for Vercel; URI leak = open DB                                                         |
| Gmail app password   | Documented               | Prefer Resend/Postmark over Gmail if you want less account-takeover risk                         |
| Logging              | Partially implemented    | Console silenced in prod; Sentry optional                                                        |
| Backups              | Needs verification       | Mongo Atlas backups if you store contacts                                                        |
| Monitoring / uptime  | Missing                  | UptimeRobot / Vercel checks — **needs verification** if anything exists outside repo             |
| PWA caching          | Partially implemented    | `cacheOnFrontEndNav` + `aggressiveFrontEndNavCaching: true` can serve **stale JS after deploys** |

**PWA recommendation:** disable aggressive nav caching or remove PWA until icons + a real install story exist. Service worker files (`public/sw.js`, `public/workbox-*.js`) are generated artifacts committed to git — don’t hand-edit them.

**Production requirement:** Env vars + Upstash + contact backend + CI `permissions` = MUST HAVE. PWA freeze = Strongly recommended.

---

## Git / GitHub security

| Item                                   | Status                                      | Evidence                                        |
| -------------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| `.gitignore` `.env`                    | Partially implemented                       | Doesn’t cover `.env.production`                 |
| Secrets in repo                        | Already implemented (no live secrets found) | Placeholders only in `.env.example` / README    |
| GitHub Actions pin SHA                 | Already implemented                         | `checkout` / `setup-node` / sonar action pinned |
| `permissions:`                         | Missing                                     | Both workflows                                  |
| Dependabot                             | Missing                                     | No `.github/dependabot.yml`                     |
| Secret scanning / push protection      | Needs verification                          | GitHub settings                                 |
| Branch protection / required PR checks | Needs verification                          | Should require `CI / quality`                   |
| CODEOWNERS                             | Missing                                     | Optional for a solo repo                        |
| Husky pre-commit / pre-push            | Already implemented                         | ESLint+Prettier; `tsc` on push                  |
| SECURITY.md                            | Missing                                     | Pair with security.txt                          |

---

## Production Security Checklist

### MUST DO BEFORE DEPLOYMENT

- Set `NEXT_PUBLIC_SITE_URL=https://jaypateldev.com` (no trailing slash) on Vercel Production **and** Preview; redeploy.
- Put `GROQ_API_KEY`, Upstash URL+token, and **at least one** of SMTP or `MONGODB_URI` on Vercel.
- Fail-closed contact (no 200 on total failure).
- Origin allowlist on `/api/chat` and `/api/contact`.
- Chat URL allowlist.
- Flip `allowIndexing` only after robots/sitemap/domain are correct.
- Fix `.gitignore` to `.env*`.
- Upgrade nodemailer; prune unused deps or accept the audit with a written exception.
- Confirm Vercel HTTPS + `www` → apex (or reverse) — **needs verification**.
- Confirm Mongo Atlas user is least-privilege, not a cluster admin — **needs verification**.

### SHOULD DO SOON AFTER DEPLOYMENT

- Dependabot + `npm audit` CI job.
- Hash/drop raw IPs from Mongo/Sentry.
- Tighten CSP (`connect-src`, `frame-src`, drop browser Groq).
- Sentry DSN + a test event; disable unused Sentry features (already no replay).
- GitHub branch protection + required CI.
- `security.txt`.
- Remove or disable PWA aggressive caching.
- Workflow `permissions: contents: read`.

### ADVANCED HARDENING

- CSP nonces via Next.js.
- COOP/CORP headers.
- Sentry source maps (`withSentryConfig`) once auth token is set.
- Fine-grained GitHub token for contributions API.
- Replace Gmail SMTP with a transactional provider.
- SBOM (`npm sbom`) in CI — only if you want the showcase; not required for a portfolio.

---

# 5. SEO Audit for jaypateldev.com

## Current SEO Score: **46 / 100**

**Why this score:** The **configuration** in `settings/seo.ts` is well above average (title template, OG, Twitter, Person/WebSite/ProfilePage/FAQ JSON-LD, canonical helpers, robots gated by a flag). The **runtime reality** is poor: indexing is off, robots.txt is the old Vercel URL, OG image and favicon 404, homepage SSR emits no main content, and there are only two URLs. That is a 75/100 SEO _design_ trapped in a 30/100 launch state.

---

## Metadata

| Item                  | Status                | Evidence                                                                                   |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| `<title>`             | Already implemented   | `SEO_TITLE_DEFAULT` / template in `settings/seo.ts`                                        |
| Meta description      | Already implemented   | Strong, specific (MERN, Ahmedabad, 3.5+ years)                                             |
| Canonical             | Partially implemented | Uses `BASE_URL` from `NEXT_PUBLIC_SITE_URL` → Vercel URL → localhost. Wrong if env unset   |
| Keywords              | Already implemented   | Present; Google ignores for ranking — harmless                                             |
| Author / creator      | Already implemented   |                                                                                            |
| Robots                | Partially implemented | `allowIndexing: false` → `noindex, nofollow` **and** `googleBot.noimageindex`              |
| Viewport              | Already implemented   | `rootViewport`                                                                             |
| `lang="en"`           | Already implemented   | `app/layout.tsx`                                                                           |
| Theme color           | Already implemented   | Light/dark in viewport                                                                     |
| Verification tags     | Missing (commented)   | Google/Bing in `rootMetadata`                                                              |
| Favicon / apple icons | Missing               | `icons` point at `/icons/icon-192.png` etc. — **files do not exist**. No `app/favicon.ico` |
| Manifest              | Partially implemented | `app/manifest.ts` exists; icons missing                                                    |

**Domain inconsistency (must fix in copy + env):**

- Target: **jaypateldev.com**
- `.env.example` / `INFRA.md`: `jaypatel.dev`
- `public/robots.txt`: `https://jay-portfolio.vercel.app/sitemap.xml`
- README live URL: `jay-portfolio.vercel.app`
- Commented project demo: `jay-patel-dev.vercel.app`

---

## Open Graph / Twitter

| Tag                                                       | Status                                                                                   |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| og:title / description / url / site_name / type=`profile` | Already implemented                                                                      |
| og:image                                                  | **Missing asset** — code references `/og-image.png` (1200×630) which is not in `public/` |
| twitter:card `summary_large_image`                        | Already implemented                                                                      |
| twitter:image                                             | Same missing file                                                                        |
| twitter site/creator                                      | Intentionally unset (`TWITTER_HANDLE` undefined) — fine                                  |

---

## Crawling

| Item                | Status                | Notes                                                                                      |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| `public/robots.txt` | Needs improvement     | Allows `/`, disallows `/api/` (good), **wrong sitemap host**                               |
| `app/robots.ts`     | Missing               | Should generate from `BASE_URL` so it cannot drift                                         |
| `app/sitemap.ts`    | Partially implemented | Only `/` and `/resume`; `lastModified: new Date()` is meaningless                          |
| noindex             | Currently on          | Correct for staging; **must flip** with domain cutover                                     |
| Conflict            | Yes                   | `Allow: /` in robots.txt vs meta `noindex` — meta wins, but robots.txt should match intent |

**JSON-LD SearchAction is incorrect:** `webSiteJsonLd.potentialAction` claims `/?q={search_term_string}`. There is no site search. Google can treat this as spammy structured data. **Remove it.**

**FAQ schema:** Synced from `faqItems` — good **if** the FAQ section stays visible (`showFAQ: true`). Comments in `seo.ts` say schema is injected even when the section is hidden — that is a policy violation (markup must match visible content). Keep FAQ visible or drop `faqJsonLd`.

**`dateModified: new Date()`** on ProfilePage changes every build/request — looks like doorway-date churn. Use a real `LAST_UPDATED` constant.

---

## URL structure

| Topic          | Assessment                                                                       |
| -------------- | -------------------------------------------------------------------------------- |
| Routes         | `/` and `/resume` only — too few for a serious organic footprint                 |
| Trailing slash | Next default (no trailing slash) — fine; pick one in Vercel                      |
| Duplicate URLs | Apex vs `www` vs `*.vercel.app` — **needs verification** (canonical + redirects) |
| 404            | `app/not-found.tsx` exists — noindex by default in Next — good                   |
| Redirects      | No `next.config.ts` redirects for old Vercel domains — add them at launch        |

---

## Structured data — what actually makes sense

| Schema                          | Verdict                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Person**                      | Keep. Core identity. Fix `email` (mailto is OK). Verify `alumniOf` URL `https://www.scet.ac.in` — **needs verification**. |
| **ProfilePage**                 | Keep. Matches a portfolio home.                                                                                           |
| **WebSite**                     | Keep **without** SearchAction.                                                                                            |
| **FAQPage**                     | Keep only while FAQ is visible.                                                                                           |
| **BreadcrumbList** on `/resume` | Keep.                                                                                                                     |
| **SoftwareSourceCode**          | Add **per public repo** on case-study pages — not on NDA cards.                                                           |
| **Article**                     | Only if you add notes.                                                                                                    |
| **WebPage**                     | Optional on inner pages.                                                                                                  |
| **JobPosting / LocalBusiness**  | Do **not** add. You are a person, not a shop.                                                                             |

---

## Content SEO

**Indexable content today is thin:** one homepage (hero, about, skills, experience, education, project cards, FAQ, contact) plus `/resume` which repeats the same facts.

Gaps:

- No project URLs → no “Jay Patel [project]” landing pages.
- NDA cards cannot be the SEO strategy (and shouldn’t be).
- `currentlyBuilding` / `currentlyLearning` are empty.
- About copy is generic (“e-commerce platforms…”) while listed projects are Chat App, MiniList CMS, PMS, Philantro, Verify 360 — **misaligned**.
- Personal demos hide source (`hideCode: true`) so you also cannot earn GitHub-sourced reputation from the site.
- Experience data **diverges**: intern dates `December 2022` vs `November 2022` (`lib/resume-data.ts` vs `ExperienceSection.tsx`). Google and recruiters will notice inconsistencies.

**Pages that would actually help organic visibility:**

1. `/` — “Jay Patel Full Stack Developer Ahmedabad”
2. `/resume` — already good
3. `/projects/minilist-cms`, `/projects/chat-app`, `/projects/social-backend`
4. `/engineering` — “how Jay Patel built this”
5. 3–8 `/notes/...` technical pieces
6. Optional `/now`

Do not add `/blog` as an empty index.

---

## Developer personal branding SEO

Communicate **one** identity everywhere (`settings/identity.ts` + JSON-LD + LinkedIn):

- **Who:** Jay Patel, Full Stack Developer, Ahmedabad, India
- **What:** MERN + Next.js / TypeScript, production web apps, form systems, KYC/HR-style products (NDA-safe language)
- **Proof:** Krishang Technolab since 2022, public demos, this repo’s engineering
- **Queries to write for (no ranking promises):** “Jay Patel developer”, “Jay Patel full stack Ahmedabad”, “Jay Patel Next.js”, “MiniList CMS”, “jaypateldev”

Use **jaypateldev.com** as the canonical name in JSON-LD `url` and `sameAs` (GitHub + LinkedIn already). Add a branded mailbox later (`hello@jaypateldev.com`) — Gmail in Person schema is acceptable but weaker.

---

## SEO performance (Core Web Vitals)

Cannot measure live CWV without the production URL — **needs verification** in Search Console / CrUX after launch. Code-level risks:

| Factor                     | Status                                                                     | Impact                                                                                                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SSR hole**               | `LoadingScreenWrapper` returns `null` while `booting === null`             | **Critical.** Server HTML for the page body is empty. Hero was written as a server component for SEO (`HeroSection.tsx`) and then wrapped in a client gate that throws it away. Also `visibility: hidden` during boot (~6s first visit) delays LCP. |
| Games on homepage bundle   | No `next/dynamic` anywhere                                                 | High JS, worse INP/TBT                                                                                                                                                                                                                              |
| Fonts                      | Self-hosted `@fontsource` (good) but **8 files** imported in `globals.css` | Watch LCP; consider 400/600 only                                                                                                                                                                                                                    |
| `next/image`               | Configured (AVIF/WebP, remotePatterns) but **never used**                  | No images to optimize except missing OG/icons                                                                                                                                                                                                       |
| Compress                   | `compress: true`                                                           | Good                                                                                                                                                                                                                                                |
| PWA aggressive cache       | Can serve stale / extra SW work                                            | Can hurt INP                                                                                                                                                                                                                                        |
| Theme FOUC                 | No blocking theme script; default CSS is light (`:root`), JS adds `dark`   | CLS/flash for dark-mode users                                                                                                                                                                                                                       |
| Client sections            | Many `"use client"` — still SSR in Next **unless parent returns null**     | The wrapper is the bug                                                                                                                                                                                                                              |
| Loading screen vs crawlers | Overlay + hidden content                                                   | Google executes JS, but LCP and “first paint empty” remain                                                                                                                                                                                          |

---

## Missing SEO items (priority)

### 1. Critical

1. Fix `LoadingScreenWrapper` so children **always SSR**; overlay the boot screen on top. Never `return null`.
2. `NEXT_PUBLIC_SITE_URL=https://jaypateldev.com`
3. Replace `public/robots.txt` with `app/robots.ts` using `BASE_URL`.
4. Add `public/og-image.png` (or `/api/og`) and real favicon/PWA icons.
5. Redirect `*.vercel.app` → apex; pick www vs non-www.
6. Flip `allowIndexing: true` **only after** 1–5.

### 2. High

7. Remove WebSite `SearchAction`.
8. FAQ schema only if FAQ is visible.
9. Case-study routes + sitemap entries.
10. Google Search Console + Bing Webmaster verification tokens in `rootMetadata`.
11. Align About copy with real projects; unify experience dates.

### 3. Medium

12. Dynamic OG per page.
13. `LAST_UPDATED` instead of `new Date()`.
14. Code-split games.
15. Theme anti-FOUC script.
16. Self-hosted resume PDF.

### 4. Low

17. Twitter handle.
18. `keywords` meta (keep or delete; not a ranking lever).
19. `/now` and notes.

---

## Recommended SEO architecture

| URL                        | Intent                                           |
| -------------------------- | ------------------------------------------------ |
| `https://jaypateldev.com/` | Primary identity: name + role + location + stack |
| `/resume`                  | “Jay Patel resume/CV”                            |
| `/projects/[slug]`         | Project + tech queries                           |
| `/engineering`             | How the site is built                            |
| `/notes/[slug]`            | Technical queries (later)                        |
| `/api/*`                   | Disallow in robots (already)                     |

---

## SEO implementation roadmap

**Before launch:** SSR fix, domain env, robots.ts, OG+favicon, redirects, remove SearchAction, decide FAQ visibility, Search Console DNS/HTML verify (**needs verification** of registrar).

**Launch week:** Flip `allowIndexing`, submit sitemap, inspect URL, share on LinkedIn and check the card, request indexing for `/` and `/resume`.

**First 30 days:** 2–3 case studies, fill currently building, fix copy mismatches, CrUX/Search Console coverage report.

**Long-term:** Notes, engineering page, internal links from home → projects → notes.

---

# 6. Engineering Showcase Recommendations

You already demonstrate: Husky, lint-staged, Prettier, ESLint (`next/core-web-vitals` + prettier), `tsc` on push and in CI, SonarCloud on `main`, pinned Actions, `STRUCTURE.md`, `INFRA.md`, feature flags, section error boundaries, Sentry hooks, Upstash, Zod APIs.

**Add only what closes a real gap.**

### Testing — Priority: 🟠 High · Complexity: Medium

**What it adds:** Proof the APIs and a11y claims work.  
**Why it matters:** Resume lists Jest/Vitest; chatbot canned answer lists Vitest and pnpm while README mandates npm — inconsistencies a reviewer will catch.  
**How it demonstrates maturity:** Tests on the _interesting_ code (`rate-limit`, contact fail-closed, chat Zod), not on `Button`.  
**How to implement:** Vitest for `lib/utils.ts` (`getExperienceLabel` already has a `now` param “useful in tests”), `lib/rate-limit.ts`, API handlers. Playwright + axe for `/` and `/resume`. Put tests in `tests/` (Sonar already expects `coverage/lcov.info` later). CI: `npm test` before build.

### CI/CD — Priority: 🟠 High · Complexity: Low–Medium

**What it adds:** `permissions: contents: read`; `npm audit`; test job; optional LHCI.  
**Why:** Workflows are already the right shape.  
**Avoid:** Semantic-release and changelog automation on a private-version `0.1.0` portfolio — low signal.

### Code quality — Priority: 🟡 Medium · Complexity: Low

**What it adds:** Conventional commits **only if** you want an honest changelog. commitlint is optional.  
**Do:** Delete unused deps; make `ExperienceSection` import `lib/resume-data.ts`; delete `lib/error-capture.ts` / `lib/error-page.ts`.  
**Skip:** Extra linters (Biome + ESLint + Sonar is too many).

### Security automation — Priority: 🟠 High · Complexity: Low

Dependabot + audit job + secret scanning enabled in GitHub (**needs verification**). Skip container scanning (no Docker). Skip full SAST product — SonarCloud already covers hotspots.

### Observability — Priority: 🟡 Medium · Complexity: Low

Sentry is already wired. **Do:** set DSN, one test event, uptime ping on `/` and `/api/contact` (OPTIONS/GET 405 is fine). **Skip:** Session Replay (already off — keep off), APM, log drains, OpenTelemetry collector.

**Analytics:** None in the repo. Add **Vercel Analytics + Speed Insights** (first-party, no extra CSP host if using `@vercel/analytics`) **or** Plausible. Skip GA4 unless you want ads-style tracking on a personal site.

### Performance — Priority: 🟠 High · Complexity: Medium

Bundle analyzer, dynamic import of games, drop unused font weights, kill aggressive PWA. Skip performance budgets until LHCI exists.

### Accessibility — Priority: 🟠 High · Complexity: Low–Medium

Add skip link to `#main` (`<main>` in `app/page.tsx` has no `id`). Contact form is JS-only (`onSubmit`, no `action`) — progressive enhancement or a `mailto:` fallback. Playwright + axe. Don’t claim WCAG 2.2 AA until you run a pass.

### Documentation — Priority: 🟢 Low · Complexity: Low

You already have the docs that matter. Add `SECURITY.md` (1 page). Skip CODE_OF_CONDUCT unless the repo is a community project. Skip ADRs until you have 3 real decisions (e.g. “why Upstash,” “why no CMS”). CONTRIBUTING.md only if the repo is public and you want PRs.

### Developer experience — Priority: 🟢 Low · Complexity: Low

Scripts are enough (`dev`, `build`, `lint`, `format`, `typecheck`). Add `test` and `analyze`. Typed env (Feature #10). Skip Makefile, Hygen generators, Storybook.

---

# 7. Codebase Architecture Review

**Overall:** The STRUCTURE.md model is sound and **already followed**. Do not flatten back to `components/portfolio/`. Do not add Redux.

## What is already well structured

- `settings/` vs `lib/` split; shims in `lib/seo.ts` and `lib/site-config.ts`
- `app/` limited to routes + APIs
- Section error boundaries on the homepage
- `HeroSection` as a server component with SEO copy (intent is right; wrapper undoes it)
- `AboutSection` server wrapper + client graph
- Chat copy moved to `settings/chat.ts`

## File-level recommendations

| Current file/folder                                            | Problem                                         | Why                                | Recommended change                                   | Priority    | Risk |
| -------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------- | ---------------------------------------------------- | ----------- | ---- |
| `components/layout/LoadingScreen.tsx` (`LoadingScreenWrapper`) | `if (booting === null) return null`             | Wipes SSR HTML; hurts SEO/LCP/a11y | Always render `children`; overlay loader             | 🔴 Critical | Low  |
| `components/sections/experience/ExperienceSection.tsx`         | Duplicate `EXPERIENCES` vs `lib/resume-data.ts` | Dates already disagree             | Import from `lib/resume-data.ts`                     | 🟠 High     | Low  |
| `components/sections/education/EducationSection.tsx`           | Duplicate `EDUCATION`                           | Same                               | Import from `lib/resume-data.ts`                     | 🟠 High     | Low  |
| `components/sections/projects/ProjectsSection.tsx` (471 lines) | Data + UI + expand logic in one client file     | Hard to add case studies           | `projects-data.ts` + keep UI                         | 🟠 High     | Low  |
| `components/features/games/GameZone.tsx`                       | Static import of all games                      | Homepage JS bloat                  | `next/dynamic` per game                              | 🟠 High     | Low  |
| `components/features/games/index.ts`                           | Barrel re-exports every game                    | Pulls them into any import         | Export only `GameZoneTrigger` from the public barrel | 🟠 High     | Low  |
| `package.json`                                                 | ~20 unused Radix + chart/form libs              | Supply chain + `npm ci` time       | Remove unused                                        | 🟠 High     | Low  |
| `components/sections/testimonials/`                            | Fake quotes                                     | Integrity risk if someone wires it | Delete or replace with real LinkedIn recs            | 🟠 High     | Low  |
| `lib/error-capture.ts`, `lib/error-page.ts`                    | Dead h3/Vinxi leftovers                         | Noise                              | Delete                                               | 🟡 Medium   | None |
| `settings/seo.ts` (474 lines)                                  | Large but cohesive                              | OK                                 | Keep; extract JSON-LD later if needed                | 🟢 Low      | —    |
| `components/effects/CursorTrail.tsx` (573)                     | Large; currently `cursorEffect: "none"`         | Still in homepage import graph     | Dynamic import when mode ≠ none                      | 🟡 Medium   | Low  |
| Game files 400–700 lines                                       | Fat but isolated                                | OK for games                       | Don’t merge into a framework                         | 🟢 Low      | —    |
| `components/ui/`                                               | Only dialog, command, sonner — **good**         | Matches “keep ui flat”             | Don’t add unused primitives                          | —           | —    |
| `app/api/contact/route.ts`                                     | Mongo client + SMTP + HTML in one file          | Acceptable for two integrations    | Split only if tests need it                          | 🟢 Low      | —    |
| `hooks/use-theme.tsx`                                          | No blocking script                              | FOUC                               | Inline script in `layout.tsx` reading `localStorage` | 🟡 Medium   | Low  |

**Unnecessary client components:** Footer, Education, and similar could be server components with small client islands. Not worth a mass conversion before launch.

**State management:** Local state + localStorage is appropriate. Don’t add Zustand for this site.

**API org:** Two routes is correct. Don’t create `/api/v1`.

---

# 8. Master Gap Analysis

| Category             | Current State                                               | Missing                                                                                 | Priority               |
| -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------- |
| Features             | Chat, games, palette, heatmap, sphere, FAQ, resume, contact | Case studies; engineering page; first-party PDF; honest “now” badges                    | 🟠 High (after launch) |
| Security             | Headers, Zod, rate limit, honeypot, Sentry hooks            | Origin checks; fail-closed contact; URL allowlist; `.env*`; nodemailer bump; Dependabot | 🔴 Critical            |
| SEO                  | Solid `settings/seo.ts`                                     | Indexing off; wrong robots; no OG/favicon; SSR empty; fake SearchAction; thin URLs      | 🔴 Critical            |
| Performance          | Compress, fontsource, image config unused                   | Code splitting; loading-screen LCP; PWA cache; font subset                              | 🟠 High                |
| Accessibility        | Lots of aria + reduced-motion                               | Skip link; SSR content; JS-only form; unverified contrast on `gradient-text`            | 🟠 High                |
| Testing              | None                                                        | Vitest + Playwright + CI                                                                | 🟠 High                |
| CI/CD                | Format, lint, tsc, build, Sonar on main                     | Tests, audit, `permissions`, PR Sonar, LHCI                                             | 🟡 Medium              |
| Code Quality         | Strict TS, Husky, Sonar                                     | Duplicated resume data; unused deps; dead files                                         | 🟡 Medium              |
| Observability        | Sentry code present                                         | DSN actually set; uptime; Web Vitals                                                    | 🟡 Medium              |
| Documentation        | README, STRUCTURE, INFRA                                    | SECURITY.md; env validation                                                             | 🟢 Low                 |
| Architecture         | Clear section model                                         | Loading wrapper; project data extraction; game barrels                                  | 🟡 Medium              |
| Developer Experience | Good scripts/docs                                           | `test` / `analyze` scripts; typed env                                                   | 🟢 Low                 |

---

# 9. Pre-Launch Checklist

## Code / content

- [ ] Fix `LoadingScreenWrapper` SSR (`components/layout/LoadingScreen.tsx`)
- [ ] `allowIndexing: true` in `settings/features.ts` **after** domain + robots are correct
- [ ] `app/robots.ts` from `BASE_URL`; delete stale `public/robots.txt` or make it identical
- [ ] Add `public/og-image.png`, `favicon.ico`, `public/icons/icon-192.png` + `icon-512.png`
- [ ] Unify all domain strings to **https://jaypateldev.com**
- [ ] Remove `SearchAction` from `webSiteJsonLd`
- [ ] Fail-closed contact + Origin checks + chat URL allowlist
- [ ] `.gitignore` `.env*`
- [ ] Sync intern dates across `ExperienceSection` and `lib/resume-data.ts`
- [ ] Point `resumeUrl` at `/resume` or a first-party PDF
- [ ] Do **not** enable testimonials
- [ ] Decide: keep FAQ visible if FAQ JSON-LD stays

## Vercel / DNS — needs verification

- [ ] Domain `jaypateldev.com` + `www` attached
- [ ] HTTPS
- [ ] Redirect Vercel aliases → apex
- [ ] Env: `NEXT_PUBLIC_SITE_URL`, `GROQ_API_KEY`, Upstash pair, SMTP or Mongo, `NEXT_PUBLIC_SENTRY_DSN`
- [ ] Node 22.x in Vercel matches `package.json` `engines`

## Google / Bing — needs verification

- [ ] Search Console + Bing Webmaster
- [ ] Submit `https://jaypateldev.com/sitemap.xml`
- [ ] Verification tokens in `settings/seo.ts`

## GitHub — needs verification

- [ ] Branch protection + required CI
- [ ] `SONAR_TOKEN` if you want scans
- [ ] Secret scanning / push protection

---

# 10. Prioritized Implementation Roadmap

## Phase 0 — Before Public Launch

| Task                                   | Why                               | Files                                                                                         | Deps                  | Complexity | Priority | Impact    |
| -------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------- | --------------------- | ---------- | -------- | --------- |
| SSR-render homepage under loader       | SEO + LCP + a11y                  | `LoadingScreen.tsx`                                                                           | None                  | Low        | 🔴       | Very High |
| Domain env + robots.ts + sitemap host  | Crawlers find the right site      | `settings/seo.ts`, `app/robots.ts`, `app/sitemap.ts`, `.env.example`, `INFRA.md`, `README.md` | Vercel domain         | Low        | 🔴       | Very High |
| OG image + favicon + icons             | Shares and browsers               | `public/`                                                                                     | Design 1200×630 + 512 | Low        | 🔴       | High      |
| Contact fail-closed + Origin allowlist | Don’t lose mail; stop quota theft | `app/api/contact/route.ts`, `app/api/chat/route.ts`                                           | SMTP or Mongo         | Low        | 🔴       | Very High |
| Chat URL allowlist                     | Stop phishing pills               | `chat-content.tsx`                                                                            | None                  | Low        | 🔴       | High      |
| Configure Vercel secrets               | Features actually work            | Vercel dashboard                                                                              | Accounts              | Low        | 🔴       | Very High |
| `.gitignore` `.env*`                   | Prevent secret commits            | `.gitignore`                                                                                  | None                  | Low        | 🔴       | High      |
| Nodemailer ≥9.0.5                      | High advisory                     | `package.json`                                                                                | SMTP retest           | Low        | 🟠       | High      |
| Flip `allowIndexing` last              | Avoid indexing the wrong host     | `settings/features.ts`                                                                        | All above             | Low        | 🔴       | Very High |

## Phase 1 — Production Hardening

| Task                                  | Why                  | Files                             | Deps                    | Complexity | Priority | Impact |
| ------------------------------------- | -------------------- | --------------------------------- | ----------------------- | ---------- | -------- | ------ |
| Dynamic import games/chat/effects     | INP / JS weight      | `GameZone.tsx`, `app/page.tsx`    | None                    | Medium     | 🟠       | High   |
| Tighten CSP                           | XSS blast radius     | `next.config.ts`                  | Verify Next still boots | Medium     | 🟠       | High   |
| Hash/drop IPs                         | Privacy              | contact route, sentry extras      | None                    | Low        | 🟠       | Medium |
| Theme FOUC script                     | CLS                  | `app/layout.tsx`, `use-theme.tsx` | None                    | Low        | 🟡       | Medium |
| Skip link + `id="main"`               | A11y                 | `app/page.tsx`, `Navbar.tsx`      | None                    | Low        | 🟠       | Medium |
| Disable aggressive PWA or remove PWA  | Stale caches + vulns | `next.config.ts`, `package.json`  | None                    | Low        | 🟠       | High   |
| Search Console / Bing                 | Operations           | `settings/seo.ts`                 | External                | Low        | 🟠       | High   |
| Dependabot + audit CI + `permissions` | Supply chain         | `.github/`                        | None                    | Low        | 🟠       | High   |
| First-party resume PDF                | Recruiter UX         | `identity.ts`, `public/`          | None                    | Low        | 🟠       | High   |
| Fill `currentlyBuilding` / learning   | Dead UI + SEO        | `settings/content.ts`             | None                    | Low        | 🟡       | Medium |
| `security.txt`                        | Ops hygiene          | `public/.well-known/`             | None                    | Low        | 🟡       | Low    |

## Phase 2 — Engineering Showcase

| Task                      | Why                        | Files                         | Deps        | Complexity | Priority | Impact |
| ------------------------- | -------------------------- | ----------------------------- | ----------- | ---------- | -------- | ------ |
| Vitest on utils + APIs    | Honest “tests” claim       | `tests/`, `ci.yml`            | Vitest      | Medium     | 🟠       | High   |
| Playwright + axe          | A11y evidence              | `e2e/`                        | SSR fix     | Medium     | 🟠       | High   |
| Deduplicate resume data   | Single source of truth     | Experience/Education sections | None        | Low        | 🟠       | Medium |
| Prune unused npm packages | Audit surface              | `package.json`                | None        | Low        | 🟠       | Medium |
| Lighthouse CI             | Perf regression            | `.github/workflows`           | Preview URL | Medium     | 🟡       | High   |
| SECURITY.md               | Matches security.txt       | repo root                     | None        | Low        | 🟢       | Low    |
| Sentry DSN verified       | Know when chat/contact 500 | Vercel + Sentry               | External    | Low        | 🟠       | High   |
| Uptime check              | Know when domain dies      | External                      | Domain      | Low        | 🟡       | Medium |

## Phase 3 — Portfolio Differentiation

| Task                                | Why                | Files                         | Deps            | Complexity | Priority | Impact    |
| ----------------------------------- | ------------------ | ----------------------------- | --------------- | ---------- | -------- | --------- |
| Case study routes                   | Recruiter + SEO    | `app/projects/`, project data | Writing         | Medium     | 🟠       | Very High |
| Unhide personal `codeUrl`s          | Proof of work      | `ProjectsSection` data        | Public GitHub   | Low        | 🟠       | Very High |
| `/engineering` page                 | Staff-level signal | `app/engineering/page.tsx`    | Honest tests/CI | Medium     | 🟠       | Very High |
| GitHub official API + rolling years | Reliability        | `lib/github-contributions.ts` | Token optional  | Medium     | 🟡       | High      |
| Dynamic OG                          | Share quality      | `app/api/og`                  | Fonts           | Medium     | 🟡       | High      |
| `/now` or changelog                 | Freshness          | `settings/content.ts`         | Discipline      | Low        | 🟢       | Medium    |

## Phase 4 — Long-Term

| Task                           | Why              | Files                    | Deps    | Complexity | Priority | Impact |
| ------------------------------ | ---------------- | ------------------------ | ------- | ---------- | -------- | ------ |
| MDX notes (only with 3+ ready) | Organic + brand  | `app/notes/`             | Writing | Medium     | 🟡       | High   |
| CSP nonces                     | Hardening        | `next.config.ts`, layout | Time    | High       | 🟢       | Medium |
| `/lab` design tokens           | Frontend systems | `app/lab/`               | None    | Low        | 🟢       | Medium |
| API docs page                  | Showcase         | engineering              | Tests   | Low        | 🟢       | Medium |
| Automated PDF in CI            | Freshness        | Playwright               | E2E     | Medium     | 🟢       | Low    |

---

# 11. Things I Should NOT Implement

| Temptation                                         | Why skip                                                                                                                      |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **More mini-games**                                | You already have 11 enabled. They inflate JS and signal “frontend playground,” not staff engineer. Hide more, don’t add more. |
| **Fake testimonials**                              | `TestimonialsSection.tsx` is invented CTOs. Shipping that would undermine everything else.                                    |
| **Sanity / CMS / Mongo for content**               | FAQ and copy belong in `settings/`. `cdn.sanity.io` is already in image config with no CMS.                                   |
| **Auth, user accounts, dashboards**                | No product users. Contact email is enough. Don’t build NextAuth for an admin inbox.                                           |
| **Kubernetes / Docker / Terraform**                | Vercel is the right production shape. Extra infra is résumé padding.                                                          |
| **Microservices / queues / Kafka**                 | One Next app, two routes.                                                                                                     |
| **GraphQL on this site**                           | You use GraphQL in a _project_; don’t add Apollo here.                                                                        |
| **Full shadcn kit**                                | You already installed it unused. Adding Storybook on top would advertise the problem.                                         |
| **GA4 + ads + heatmaps + session replay**          | Conflicts with the privacy stance (`sendDefaultPii: false`, replay already 0). Use Vercel Analytics if anything.              |
| **i18n**                                           | One language, one market story.                                                                                               |
| **PWA as a “feature”**                             | Incomplete icons, aggressive caching, vulnerable workbox stack. A portfolio does not need install-to-homescreen.              |
| **SearchAction / site search**                     | Nothing to search. Command palette is client-only.                                                                            |
| **commitlint + semantic-release + changelog bots** | Overhead without packages to version.                                                                                         |
| **OpenTelemetry collector / Grafana**              | Sentry + uptime is enough.                                                                                                    |
| **Headless WordPress / blog platform**             | Empty blog is worse than no blog.                                                                                             |
| **Enabling testimonials “just to fill space”**     | Integrity.                                                                                                                    |

---

# 12. Final Scorecard

| Category             | Score |
| -------------------- | ----: |
| Architecture         |    82 |
| Code Quality         |    76 |
| Security             |    64 |
| Testing              |     8 |
| CI/CD                |    68 |
| Performance          |    54 |
| Accessibility        |    71 |
| SEO                  |    46 |
| Developer Experience |    84 |
| Documentation        |    88 |
| Portfolio UX         |    83 |
| Production Readiness |    49 |

### Overall Score: **64 / 100**

**What pulls it up:** Unusual documentation quality, coherent folder architecture, real APIs with validation and rate limits, security headers, CI that actually builds, a distinctive (if heavy) UX.

**What pulls it down:** The site cannot be indexed as-is, homepage SSR is empty, brand assets are missing, contact can silently drop mail, there are zero tests, personal work hides source, and the dependency tree still looks like an untrimmed shadcn starter.

This is a **strong staging portfolio**, not yet a production personal site.

---

# 13. Top 10 Highest-Value Actions

1. **Always SSR page content** in `LoadingScreenWrapper` — overlay the boot animation; never `return null`.
2. **Cut over the domain correctly:** `NEXT_PUBLIC_SITE_URL=https://jaypateldev.com`, `app/robots.ts` from `BASE_URL`, Vercel redirects from old `*.vercel.app` hosts, then `allowIndexing: true`.
3. **Add `og-image.png`, favicon, and PWA icons** (or drop PWA until they exist). Social previews are currently broken by construction.
4. **Make `/api/contact` fail closed** and require SMTP or Mongo in production; add Origin checks on both APIs.
5. **Allowlist chatbot URLs** in `chat-content.tsx` so Groq cannot turn the widget into a phishing surface.
6. **Put Upstash + Groq + Sentry + mail/Mongo on Vercel and verify** with one real chat, one real contact, one Sentry test event, and a 429 test. External configuration — needs verification.
7. **`next/dynamic` the Game Zone (and chatbot)** so the homepage is not shipping ~4k+ lines of games, including disabled ones.
8. **Publish 3 project case studies and GitHub links** for Chat App, MiniList CMS, and the NestJS social API — `hideCode: true` on public demos is the biggest _portfolio_ miss in the repo.
9. **Add Vitest for APIs/utils and Playwright+axe for `/` and `/resume`, then run them in `ci.yml`** so the resume’s testing claims become true.
10. **Upgrade nodemailer, prune unused Radix/chart/form packages, add Dependabot, and ignore `.env*`** — shrink the attack surface you already installed but never used.

After those ten, the next unique showcase is an honest `/engineering` page — not another easter egg.
