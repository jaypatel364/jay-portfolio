# Jay Patel — Portfolio

Personal portfolio for **Jay Patel**, Full Stack Developer.

**Live:** [jaypateldev.com](https://jaypateldev.com)

---

## Tech stack

| Layer     | Technology                                   |
| --------- | -------------------------------------------- |
| Framework | Next.js 15 (App Router, Turbopack)           |
| Language  | TypeScript 5                                 |
| UI        | React 19, Tailwind CSS v4, Radix UI / shadcn |
| Motion    | Framer Motion                                |
| AI chat   | Groq (`llama-3.1-8b-instant`)                |
| Data      | MongoDB (contact), Resend (email)            |
| Ops       | Upstash Redis (rate limits), Sentry, Vercel  |

---

## What’s in the product

- **Pages** — Home plus dedicated routes: `/about`, `/skills`, `/work`, `/contact`
- **Sections** — Modular home/inner content under `components/sections/`
- **Features** — AI chatbot, Game Zone, command palette (`⌘K`), resume viewer, accent themes
- **Effects** — Cursor modes, Catch the Bug, Konami easter egg
- **APIs** — `/api/chat`, `/api/contact` (validation, rate limits, graceful degradation)

Site copy, feature flags, and SEO live in **`settings/`**. Architecture details: **[STRUCTURE.md](./STRUCTURE.md)**.

---

## Project structure

```
app/                  # Routes + API only
settings/             # Identity, flags, content, SEO
components/
  sections/           # Page sections (hero, about, skills, …)
  features/           # Chatbot, games, command palette, resume
  layout/             # Nav, footer, loading, page chrome
  effects/            # Global overlays
  shared/ + ui/       # Shared UI + shadcn primitives
hooks/  lib/  public/
```

| Module      | Role                                   |
| ----------- | -------------------------------------- |
| `settings/` | Edit personal info, toggles, SEO, copy |
| `sections/` | Page content blocks                    |
| `features/` | Cross-cutting product UX               |
| `layout/`   | Shell chrome                           |
| `effects/`  | Global overlays                        |

---

## Prerequisites

| Tool    | Version    | Notes                                                    |
| ------- | ---------- | -------------------------------------------------------- |
| Node.js | **22 LTS** | Pinned in `.nvmrc`                                       |
| npm     | **10.9.x** | Do **not** use npm 11 — it breaks `npm ci` lockfile sync |
| Git     | **≥ 2.32** | Prefer Homebrew Git on Mac                               |

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Always use **npm** (not yarn).

After dependency changes, regenerate the lockfile with npm 10:

```bash
npx npm@10.9.2 install
git add package-lock.json
```

---

## Environment

Cloud setup (Vercel, Groq, Upstash, Sentry, MongoDB, Resend, reCAPTCHA): **[INFRA.md](./INFRA.md)**.

Copy `.env.example` → `.env.local`. Minimum for a full local experience:

```env
NEXT_PUBLIC_SITE_URL=https://jaypateldev.com
GROQ_API_KEY=
# Optional: Upstash, Sentry, MongoDB, Resend, reCAPTCHA — see INFRA.md
```

Unset optional services degrade gracefully; the site still loads.

---

## Customisation

| File                   | Edit for                                 |
| ---------------------- | ---------------------------------------- |
| `settings/identity.ts` | Name, email, links, resume, career start |
| `settings/features.ts` | Feature / game toggles, cursor, indexing |
| `settings/content.ts`  | FAQ, headlines, badges                   |
| `settings/pages.ts`    | Inner-page titles and hero copy          |
| `settings/chat.ts`     | Chatbot persona, rates, canned answers   |
| `settings/seo.ts`      | Metadata, Open Graph, JSON-LD            |

For section data (skills, projects, experience), follow the paths in **[STRUCTURE.md](./STRUCTURE.md)**.

---

## Scripts

```bash
npm run dev           # Dev server (Turbopack)
npm run build         # Production build
npm run start         # Serve production build
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run format        # Prettier
```

**Hooks:** pre-commit runs ESLint + Prettier on staged files; pre-push runs typecheck.

---

## Deployment

Deploys on Vercel via git push. Set `NEXT_PUBLIC_SITE_URL` and other env vars in the Vercel project before going live. Flip `allowIndexing` in `settings/features.ts` when ready for search engines.

---

## Further reading

| Doc                                          | Contents                   |
| -------------------------------------------- | -------------------------- |
| [STRUCTURE.md](./STRUCTURE.md)               | Architecture & conventions |
| [INFRA.md](./INFRA.md)                       | Cloud services & env vars  |
| [PRODUCTION-AUDIT.md](./PRODUCTION-AUDIT.md) | Launch audit / roadmap     |
