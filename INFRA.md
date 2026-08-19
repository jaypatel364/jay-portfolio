# Cloud infrastructure

How every external service is wired, what to create, and which env vars to paste where.

Copy values into **`.env.local`** for local work and into **Vercel → Project → Settings → Environment Variables** for production (Production + Preview). Never commit `.env` / `.env.local`.

Template: [`.env.example`](./.env.example).

---

## Map

```
Visitor
  └── Vercel (Next.js 15)
        ├── /api/chat     → Groq + Upstash rate limit + Sentry on 500s
        ├── /api/contact  → Upstash rate limit + reCAPTCHA + MongoDB + Resend + Sentry
        ├── GitHub graph  → public contributions API (ISR, 1h)
        └── UI crashes    → Sentry (SectionErrorBoundary, app/error, global-error)
```

| Service          | Required?   | What it does                               | Code                                  |
| ---------------- | ----------- | ------------------------------------------ | ------------------------------------- |
| Vercel           | Yes         | Hosting, HTTPS, env vars, ISR              | `next.config.ts`                      |
| Groq             | For chatbot | LLM replies                                | `app/api/chat/route.ts`               |
| Upstash Redis    | Recommended | Shared rate limits across Vercel instances | `lib/rate-limit.ts`                   |
| Sentry           | Recommended | Error monitoring (API + UI)                | `sentry.*.config.ts`, `lib/sentry.ts` |
| MongoDB          | Optional    | Persist contact form submissions           | `app/api/contact/route.ts`            |
| Resend           | Recommended | Email you when someone submits contact     | `lib/contact-mail.ts`                 |
| reCAPTCHA v2     | Recommended | Checkbox captcha on the contact form       | `lib/recaptcha.ts`                    |
| GitHub Actions   | Automatic   | CI: format, lint, typecheck, build         | `.github/workflows/ci.yml`            |
| SonarCloud       | Optional    | Code quality scan on `main` only           | `.github/workflows/sonarcloud.yml`    |
| GitHub graph API | None        | Contribution heatmap — no key              | `lib/github-contributions.ts`         |

If a **optional** service is unset, that feature no-ops. The site still loads.

---

## 1. Vercel

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Next.js**. Install command: `npm ci` (see `vercel.json`).
3. **Node.js version:** `22.x` — set in `package.json` → `engines.node`. In Vercel → Settings → General → Node.js Version, pick **22.x** if the dashboard override differs.
4. Add the env vars from the table below.
5. Set `NEXT_PUBLIC_SITE_URL` to **`https://jaypateldev.com`** (no trailing slash).
6. Redeploy after changing any `NEXT_PUBLIC_*` variable — those are baked in at build time.

**Domains:** attach `jaypateldev.com` and `www.jaypateldev.com` in Vercel → Settings → Domains. `next.config.ts` 301s `www` and the old production aliases (`jay-portfolio.vercel.app`, `jay-patel-dev.vercel.app`) to the apex. Preview URLs are not redirected.

Fonts are **self-hosted** via `@fontsource/*` (no Google Fonts fetch at build time).

---

## 2. Groq (chatbot)

Used by `POST /api/chat`. Without this key the chatbot returns **503**.

1. Create a key at [console.groq.com](https://console.groq.com).
2. Set `GROQ_API_KEY`.

Model and token budget live in `app/api/chat/route.ts`. Rates / system prompt / canned answers live in `settings/chat.ts`.

**Verify:** open the site, send a chat message, get a streamed reply.

---

## 3. Upstash Redis (rate limiting)

Vercel runs many serverless instances. In-memory maps do **not** share counts between them, so limits only stick in production when Redis is set.

Limits (sliding window, prefix `portfolio`):

| Route          | Limit                        |
| -------------- | ---------------------------- |
| `/api/chat`    | 6 / minute **and** 30 / hour |
| `/api/contact` | 3 / minute                   |

Locally, if Redis env is missing, the same numbers apply in-process (fine for `npm run dev`).

### Create the database

1. Sign in at [console.upstash.com](https://console.upstash.com).
2. **Redis** → **Create database**.
   - Region: closest to your Vercel region (often `iad` / Washington if Vercel is US East).
   - Type: **Regional** is enough (free tier).
3. Open the database → **REST API**.
4. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN` (read/write token)

### Env vars

```env
UPSTASH_REDIS_REST_URL=https://….upstash.io
UPSTASH_REDIS_REST_TOKEN=…
```

Add both to `.env.local` **and** Vercel (Production + Preview).

### Verify

1. Hit chat or contact a few times.
2. In Upstash → **Data Browser**, keys appear under `portfolio:…`.
3. Exceed the limit → API returns **429**.

No Redis → no crash. It silently uses in-memory fallback.

---

## 4. Sentry (errors)

Captures:

- API failures in chat / contact (`lib/sentry.ts`)
- Section UI crashes (`SectionErrorBoundary`)
- Route errors (`app/error.tsx`)
- Root-layout crashes (`app/global-error.tsx`)
- Server request errors (`instrumentation.ts` → `onRequestError`)

Source maps via the Sentry webpack plugin are **not** enabled (it broke the production build without extra auth). Stack traces still arrive; they may be minified in production.

### Create the project

1. Sign in at [sentry.io](https://sentry.io).
2. Create a project: platform **Next.js**.
3. Copy the **DSN**.

### Env vars

**Required for capture:**

```env
NEXT_PUBLIC_SENTRY_DSN=https://…@….ingest.sentry.io/…
```

Must be on **Vercel Production + Preview** (and `.env.local` if you want errors while developing). Because it is `NEXT_PUBLIC_*`, redeploy after changing it.

**Optional** (only if you later enable the Sentry build plugin for source maps):

```env
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=sntrys_…
```

Client, server, and edge inits live in:

- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `instrumentation.ts`

CSP already allows `https://*.ingest.sentry.io`.

### Verify

1. Deploy with the DSN set.
2. In Sentry → **Issues**, wait for events (or trigger a test exception in a throwaway preview).
3. Chat/contact 500s and section crashes should show `route` / `section` extras.

Session Replay is **off** (`replaysSessionSampleRate: 0`). PII is not sent (`sendDefaultPii: false`). Production trace sample rate is 10%.

---

## 5. MongoDB (optional — contact storage)

The contact form **fails closed**: `POST /api/contact` returns **503** unless Mongo saved the message **or** Resend sent it. Configure at least one of MongoDB or Resend for production.

Without `MONGODB_URI`, submissions are not stored. Resend can still deliver the message.

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Database user + Network Access: allow `0.0.0.0/0` (Vercel IPs are dynamic) or use Atlas Network Peering if you prefer.
3. Connect → Drivers → copy the URI.

```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/portfolio
```

The app uses database **`portfolio`**, collection **`contact`**.

**Verify:** submit the contact form → document appears in Atlas.

---

## 6. Resend (contact email)

Without Resend, no notification email is sent. Mongo can still persist the submission. If **neither** Mongo nor Resend is set, visitors see an error and are asked to email Jay directly.

Free tier is **3,000 emails/month** (100/day). One API key — the easiest fit for Vercel.

1. Sign in at [resend.com](https://resend.com).
2. Add and verify domain `jaypateldev.com` (DNS records Resend shows).
3. Create an API key.
4. Set:

```env
RESEND_API_KEY=re_…
RESEND_FROM="Jay Patel <noreply@jaypateldev.com>"
CONTACT_NOTIFY_TO=you@gmail.com
```

Until the domain is verified, Resend only allows sending from their onboarding address (`beth.t@example.com`) to **your own** account email.

**Verify:** submit contact → inbox at `CONTACT_NOTIFY_TO`, Reply-To = visitor email.

---

## 6b. Google reCAPTCHA v2 (checkbox)

Use the **“I'm not a robot” Checkbox** (v2), not Invisible or v3.

1. Open [Google reCAPTCHA admin](https://www.google.com/recaptcha/admin).
2. Create a key: type **reCAPTCHA v2** → **I'm not a robot Checkbox**.
3. Add domains: `jaypateldev.com` and `www.jaypateldev.com` (localhost is not needed — captcha is production-only).
4. Set:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=…
RECAPTCHA_SECRET_KEY=…
```

Redeploy after changing `NEXT_PUBLIC_*`. The checkbox and server check run **only on production** (`jaypateldev.com`). `npm run dev`, localhost, and Vercel preview skip captcha so you can test the form freely.

**Verify:** contact form shows the checkbox; Send stays disabled until it is checked; a failed/expired checkbox returns 400.

---

## 7. GitHub Actions CI

File: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

Runs on push/PR to `main` or `master` (`permissions: contents: read`):

1. `npm ci`
2. `npm audit --omit=dev --audit-level=high`
3. Prettier check
4. ESLint
5. `tsc --noEmit`
6. `next build`

Dependabot: [`.github/dependabot.yml`](./.github/dependabot.yml) — weekly npm and GitHub Actions updates.

No GitHub UI setup beyond pushing the workflow file.

Optional repo secret: `GROQ_API_KEY` (build uses a placeholder if unset). You do **not** need Upstash or Sentry secrets for CI.

---

## 8. SonarCloud (main branch only)

File: [`.github/workflows/sonarcloud.yml`](./.github/workflows/sonarcloud.yml).  
Config: [`sonar-project.properties`](./sonar-project.properties).

Runs **only** when code is pushed to `main` / `master` — including when a PR is merged. It does **not** run on feature-branch pushes or open PRs (CI still runs on PRs).

### One-time setup (free account)

1. Sign in at [sonarcloud.io](https://sonarcloud.io) with GitHub.
2. **+** → **Analyze new project** → import **`jaypatel364/jay-portfolio`**.
3. SonarCloud creates a project key (usually `jaypatel364_jay-portfolio`) and organization key (usually `jaypatel364`). Confirm they match [`sonar-project.properties`](./sonar-project.properties); edit that file if SonarCloud shows different values.
4. SonarCloud → **My Account** → **Security** → **Generate Tokens** → name it `github-actions` → copy the token.
5. GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - Name: `SONAR_TOKEN`
   - Value: paste the token from step 4
6. (Recommended) Install the **SonarQube Cloud** GitHub App when SonarCloud prompts you — enables richer GitHub integration.
7. Merge or push these workflow files to `main`. The **SonarCloud** job appears under **Actions**; results live on [sonarcloud.io](https://sonarcloud.io).

No tests are required for the first scan — SonarCloud analyzes TypeScript/TSX for bugs, smells, and security hotspots. When you add tests later, point `sonar.javascript.lcov.reportPaths=coverage/lcov.info` in `sonar-project.properties`.

---

## 9. GitHub contribution graph

No token. Server fetch in `lib/github-contributions.ts` with **ISR 1 hour**. Username comes from `settings/identity.ts` → `githubUsername`.

---

## Env var cheat sheet

| Variable                               | Where                     | Required                   |
| -------------------------------------- | ------------------------- | -------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Vercel + local            | Production SEO             |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Vercel (optional)         | Search Console HTML tag    |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`   | Vercel (optional)         | Bing Webmaster HTML tag    |
| `GROQ_API_KEY`                         | Vercel + local            | Chatbot                    |
| `UPSTASH_REDIS_REST_URL`               | Vercel + local            | Shared rate limits         |
| `UPSTASH_REDIS_REST_TOKEN`             | Vercel + local            | Shared rate limits         |
| `NEXT_PUBLIC_SENTRY_DSN`               | Vercel + local            | Error monitoring           |
| `SENTRY_ORG`                           | Vercel (optional)         | Source maps later          |
| `SENTRY_PROJECT`                       | Vercel (optional)         | Source maps later          |
| `SENTRY_AUTH_TOKEN`                    | Vercel (optional, secret) | Source maps later          |
| `MONGODB_URI`                          | Vercel + local            | Store contacts             |
| `RESEND_API_KEY`                       | Vercel + local            | Email contacts             |
| `RESEND_FROM`                          | Vercel + local            | Email from-address         |
| `CONTACT_NOTIFY_TO`                    | Vercel + local            | Email inbox                |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`       | Vercel + local            | Contact checkbox widget    |
| `RECAPTCHA_SECRET_KEY`                 | Vercel + local            | Verify captcha server-side |
| `IP_HASH_SALT`                         | Vercel + local (optional) | Hash IPs in rate limits    |
| `SONAR_TOKEN`                          | GitHub Actions secret     | SonarCloud scans           |

---

## Local vs production

| Concern          | `npm run dev`                       | Vercel production                  |
| ---------------- | ----------------------------------- | ---------------------------------- |
| Rate limit       | In-memory unless Upstash env is set | Upstash (set the two Redis vars)   |
| Sentry           | On if DSN is in `.env.local`        | On if DSN is in Vercel env         |
| Security headers | Applied via `next.config.ts`        | Same (HSTS, CSP, frame options, …) |
| GitHub graph     | Fetched, cached 1h                  | ISR, revalidate 1h                 |

---

## Go-live checklist

1. All env vars above that you use are on **Vercel Production** (and Preview if you want staging parity).
2. `NEXT_PUBLIC_SITE_URL` is `https://jaypateldev.com`, no trailing slash.
3. Redeploy after adding `NEXT_PUBLIC_*` vars.
4. Chat: one real message works; spam → 429.
5. Contact: Mongo row and/or email arrive. Checkbox captcha required when reCAPTCHA keys are set. If neither backend is configured, the form returns 503 (fail-closed).
6. Sentry: Issues page is receiving events after a real error.
7. Confirm `jaypateldev.com` and `www` in Vercel Domains; HTTPS is on.
8. **Search Console (needs you in the Google UI):** add `https://jaypateldev.com`, verify via DNS or HTML tag. If HTML tag, paste the token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploy. Submit `https://jaypateldev.com/sitemap.xml`.
9. **Bing Webmaster (needs you in the Bing UI):** same flow with `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
10. Flip `allowIndexing: true` in `settings/features.ts` **only after** the custom domain, sitemap, and OG/favicon routes work on production.
11. Confirm `settings/identity.ts` name, links, and that `public/jay-patel-resume.pdf` is current.

Folder architecture (not cloud): [STRUCTURE.md](./STRUCTURE.md).
