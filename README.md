# Jay Patel — Portfolio

Personal portfolio website for Jay Patel, Full Stack Developer. Built with Next.js 15, React 19, Tailwind CSS v4, and Framer Motion.

Live at: `https://jaypateldev.com`

---

## Tech Stack

| Layer           | Technology                                                    |
| --------------- | ------------------------------------------------------------- |
| Framework       | Next.js 15 (App Router, Turbopack)                            |
| Language        | TypeScript 5                                                  |
| Styling         | Tailwind CSS v4                                               |
| Animations      | Framer Motion 12                                              |
| UI Primitives   | Radix UI + shadcn/ui                                          |
| Icons           | Lucide React + react-icons (Simple Icons — brand logos)       |
| Fonts           | Space Grotesk (headings), Inter (body), JetBrains Mono (code) |
| AI Chat         | Groq SDK (`llama-3.1-8b-instant`)                             |
| Database        | MongoDB (contact form storage)                                |
| Email           | Resend (contact form notifications)                           |
| Toast           | Sonner                                                        |
| Command Palette | cmdk                                                          |
| Rate limiting   | Upstash Redis                                                 |
| Errors          | Sentry                                                        |
| Deployment      | Vercel                                                        |

---

## Features

### Loading Screen

- Cinematic terminal boot sequence — optional, off by default (`showLoadingScreen: false`)
- Plays once per browser session when enabled (`sessionStorage` flag)
- Typewriter effect — 8 lines type one at a time with realistic per-character delays
- macOS-style terminal window — traffic light buttons, username@portfolio title bar
- Smooth progress bar, 6-second hard cap, ESC to skip
- Three-layer cinematic reveal: left/right curtain panels, glowing seam, radial iris bloom
- Toggle: `showLoadingScreen: true | false` — keep off for LCP; page HTML is always in the document either way

### AI Chatbot

- Floating FAB — bottom-right, pulse ring, unread badge, animated "Chat with Jay" label
- Streaming responses — word-by-word reveal with blinking caret
- 14 pre-built instant answers — no Groq tokens for intro, stack, experience, rates, hire, contact, resume, etc.
- Quick chip suggestions — rotating groups during conversation
- Inline markdown — `**bold**`, `` `code` ``, URLs as pill links
- 10-message conversation limit then "start fresh" banner
- Security — per-IP rate limiting (6 req/min, 30 req/hr), Zod validation, prompt injection guard, 3,500-token ceiling

### Game Zone

A single "Game Zone" button in the Skills section opens a full hub modal with all mini-games. Sticky header with category filter tabs (All / Reflex / Memory / Creative / Chill). Featured hero card for the recommended game. Compact scrollable game rows for the rest — scales to any number of games. Body scroll locked while hub is open. Smooth cross-fade when switching tabs.

Every game has an on/off flag in `settings/features.ts`. Setting it to `false` removes the game card entirely — no button, no modal.

| Game                  | Category | Flag               |
| --------------------- | -------- | ------------------ |
| ⚡ Reaction Time Test | Reflex   | `showReactionTest` |
| 🃏 Emoji Memory Flip  | Memory   | `showEmojiMemory`  |
| 🎨 Color Match Blitz  | Reflex   | `showColorMatch`   |
| 🎯 Dot Collector      | Reflex   | `showDotCollector` |
| 🔢 Code Breaker       | Memory   | `showCodeBreaker`  |
| ⌨️ Typing Speed Test  | Creative | `showTypingTest`   |
| ✨ Vibe Check         | Creative | `showVibeCheck`    |
| 🔮 Gravity Orbs       | Chill    | `showGravityOrbs`  |
| 🎨 Pixel Draw Race    | Creative | `showPixelDraw`    |
| 🧠 Jay's Brain        | Chill    | `showBrainGame`    |
| 🔀 Word Scramble      | Creative | `showWordScramble` |

All high scores are persisted in `localStorage`. Each game has a hire CTA that scrolls to the Contact section.

#### Game descriptions

**Reaction Time Test** — Screen goes dark, wait for the green flash, click as fast as possible. 5 rounds, running average, personal rank (Ninja / Pro / Human / Casual / Sloth).

**Emoji Memory Flip** — 16 face-down emoji cards, 8 pairs. Flip two at a time to find matches. Tracked by moves and time.

**Color Match Blitz** — A target color swatch appears. Pick the matching one from 4 options before 3 seconds runs out. Colors get closer together each round.

**Dot Collector** — Glowing dots pop onto screen and shrink away. Click them before they vanish. Combos earn bonus points. 30 seconds.

**Code Breaker** — 3×3 glowing tile grid lights up a sequence. Mirror it back. Each round adds one more step; speed increases.

**Typing Speed Test** — Type real code snippets from Jay's codebase. Live WPM + accuracy. 6 snippets: React hook, API route, Prisma query, Auth middleware, Socket.io, Zustand.

**Vibe Check** — 6 "this or that" dev choices (dark mode vs light, tabs vs spaces, etc.) reveal your developer archetype. Shareable result badge with copy-to-clipboard.

**Gravity Orbs** — Physics orbs float on screen. Move your cursor to attract them. Click to burst into smaller ones. 30 seconds.

**Pixel Draw Race** — An 8×8 pixel silhouette appears. Recreate it cell by cell before 20 seconds runs out. Match % and star rating at the end.

**Jay's Brain** — 20 floating skill nodes with real brand icons. Click each to unlock a real story from Jay's dev journey. Unlock all 20 for a celebration screen.

**Word Scramble** — A tech word gets scrambled. Type the correct word before 10 seconds runs out. Streak combos earn bonus points. Skip button available.

### Catch the Bug Easter Egg

A tiny animated bug (🐛🐞🦗🪲🦟) crawls across the screen at random intervals (45–120 seconds). Click it before it escapes.

- **70% chance** → full immersive overlay with squash animation, orbiting sparkles, stat pills, confetti burst, and hire CTA
- **30% chance** → quick toast notification only
- Bug hides automatically while any Game Zone modal is open
- Toggle: `showCatchTheBug: true | false`

### Cursor Effects

Five canvas-based cursor effects. Set one value in `settings/features.ts` — switching is instant.

| Value         | Effect                                                       |
| ------------- | ------------------------------------------------------------ |
| `"none"`      | Disabled                                                     |
| `"particles"` | Hue-cycling glow orbs drift and fade behind the cursor       |
| `"ripple"`    | Expanding water-drop ring ripples on every move              |
| `"magnetic"`  | 9 orbital dots elastically chase the cursor like planets     |
| `"lightning"` | Electric arc bolts shoot from cursor to random nearby points |
| `"pixelate"`  | Colored square pixels fall and dissolve behind the trail     |

All effects are canvas-only (`pointer-events: none`), fine-pointer only, auto-skip on touch and `prefers-reduced-motion`.

Config: `cursorEffect: "magnetic"` (or any value above)

### FAQ Section

- "Ask Me Anything" accordion with category filter bar (All / Work / Tech / Personal / Process)
- Spring-animated `layoutId` underlay on active filter
- Segment progress dots — fill as questions are opened, pulse on completion
- "All read" celebration banner with shimmer sweep and scroll-to-contact CTA
- Per-category colour accents on border, glow blob, badge, and chevron
- IDE line-number gutter prefix on every question
- Toggle: `showFAQ: true | false`

### Skills Section

- Grid / 3D Sphere view toggle
- 3D sphere uses Fibonacci lattice for uniform point distribution, quadratic depth curve for realistic depth, drag-to-spin with momentum
- Category filter tabs — sphere shows only that category's skills
- Game Zone trigger button at the bottom (desktop)

### Hero Section

- Word-swap headline with configurable words and slot-machine animation
- Interactive `zsh`-style terminal (`showTerminalHero: true`) — accepts `whoami`, `skills`, `experience`, `projects`, `contact`, `status`, `clear`, `help`; ↑↓ history, `Ctrl+C`, `Ctrl+L`

### Navigation

- Command palette (`⌘K`) — search, theme, accent, resume, social links
- Keyboard shortcuts overlay (`?`)
- Global shortcuts — `G+H/A/S/E/C/P` for sections, `T` for theme
- Scroll progress badge — section name + page % after hero (desktop)

### Other Features

- GitHub activity heatmap — rolling 12-month window, correct month labels, no horizontal scroll
- Projects section — filter by All / Fullstack / Frontend / Backend; supports `hideCode`, `nda`, `wip` flags
- Experience section — Cards and Timeline views with animated transitions
- Contact form — reCAPTCHA v2 checkbox, MongoDB save, Resend email, confetti, rate limiting, honeypot
- 6 accent colour presets persisted in `localStorage`
- Dark / light mode — respects `prefers-color-scheme`
- Scroll progress bar, cursor spotlight, back-to-top FAB
- Section error boundaries
- Konami code easter egg — `↑↑↓↓←→←→BA`

---

## Project Structure

```
├── app/                              # Next.js App Router (routes + APIs only)
│   ├── api/chat/route.ts
│   ├── api/contact/route.ts
│   ├── about/page.tsx
│   ├── skills/page.tsx
│   ├── work/page.tsx
│   ├── contact/page.tsx
│   ├── layout.tsx
│   ├── page.tsx                      # Composes sections — keep thin
│   ├── globals.css
│   ├── robots.ts
│   └── sitemap.ts
│
├── settings/                         # ★ Edit site data & flags here
│   ├── identity.ts                   # Name, email, links, career date
│   ├── features.ts                   # Boolean toggles + cursorEffect
│   ├── content.ts                    # FAQ, headlines, marquee, badges
│   ├── types.ts                      # Shared settings types
│   ├── seo.ts                        # Metadata + JSON-LD
│   └── index.ts                      # Merges into siteConfig
│
├── components/
│   ├── sections/                     # Page → section → local pieces
│   │   ├── hero/                     # HeroSection, TerminalBlock, …
│   │   ├── about/                    # About + TechMarquee + GitHubGraph
│   │   ├── skills/                   # Skills + SkillSphere + data
│   │   ├── experience/
│   │   ├── education/
│   │   ├── projects/
│   │   ├── faq/
│   │   ├── contact/
│   │   └── testimonials/
│   ├── features/                     # Cross-cutting features
│   │   ├── games/                    # GameZone + all mini-games
│   │   ├── chatbot/
│   │   ├── command-palette/
│   │   ├── resume/                   # PDF viewer overlay
│   │   └── accent/
│   ├── layout/                       # Navbar, Footer, LoadingScreen, …
│   ├── effects/                      # Cursor, Konami, CatchTheBug
│   ├── shared/                       # Brand, SectionHeading, CopyEmail, …
│   └── ui/                           # Used shadcn primitives only (flat)
│
├── hooks/
├── lib/                              # Utilities + thin re-exports
│   ├── site-config.ts                # → re-exports @/settings
│   ├── seo.ts                        # → re-exports @/settings/seo
│   ├── resume-data.ts
│   ├── accent-colors.ts
│   └── utils.ts
├── public/
└── STRUCTURE.md                      # Architecture guide (humans + AI)
```

Full conventions for humans and AI: see **[STRUCTURE.md](./STRUCTURE.md)**.

---

## Prerequisites

Use these versions on **Mac and Windows** so hooks and CI behave the same:

| Tool    | Version    | Notes                                                                                                                                             |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js | **22 LTS** | `.nvmrc` pins `22`; use [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows)                         |
| npm     | **10.9.x** | Ships with Node 22. **Do not use npm 11** — it generates a lock file CI cannot install (`npm ci` fails). Regenerate with `npx npm@10.9.2 install` |
| Git     | **≥ 2.32** | Mac: `brew install git` (avoid old Xcode Git). Windows: [Git for Windows](https://git-scm.com/download/win)                                       |

After `brew install git` on Mac, confirm the Homebrew binary is first on your PATH:

```bash
git --version   # should be 2.32+ (e.g. 2.55)
which git       # should NOT be /usr/bin/git on Mac if Homebrew git is installed
```

If `which git` still shows `/usr/bin/git`, add to `~/.zshrc`:

```bash
export PATH="/opt/homebrew/bin:$PATH"
```

Then open a new terminal and check again.

---

## Getting Started

```bash
npm install
npm run dev
```

**Important:** always use `npm` (not yarn). After changing dependencies:

```bash
npx npm@10.9.2 install   # use npm 10 — npm 11 breaks CI lock file sync
git add package-lock.json
```

CI runs `npm ci`, which fails if `package-lock.json` was generated with npm 11 or is out of sync with `package.json`.

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Step-by-step cloud setup (Vercel, Groq, Upstash, Sentry, MongoDB, Resend, reCAPTCHA, CI): **[INFRA.md](./INFRA.md)**.

Create `.env.local` at the project root:

```env
# Site URL — used for canonical URLs and sitemap (required in production)
NEXT_PUBLIC_SITE_URL=https://jaypateldev.com

# Groq AI — required for the chatbot
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Upstash Redis — shared rate limits on Vercel (recommended for production)
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# Sentry — optional error monitoring
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0

# MongoDB — contact form storage (optional)
MONGODB_URI=mongodb+srv://...

# Resend — contact form email (recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM="Jay Patel <noreply@jaypateldev.com>"
CONTACT_NOTIFY_TO=your@email.com

# Google reCAPTCHA v2 checkbox
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

`GROQ_API_KEY` is required for the chatbot. `NEXT_PUBLIC_SITE_URL` should be set to your real domain before going live. All other variables are optional — the site degrades gracefully without them.

---

## Customisation

All personal info, feature flags, and SEO live under **`settings/`**.

| File                   | What to edit                                                     |
| ---------------------- | ---------------------------------------------------------------- |
| `settings/identity.ts` | Name, email, social links, location, resume, career date         |
| `settings/features.ts` | Booleans (`showFAQ`, games, loading screen, …) + `cursorEffect`  |
| `settings/content.ts`  | FAQ items, headline words, daily stack, building/learning badges |
| `settings/chat.ts`     | Chatbot rates, system prompt, canned answers                     |
| `settings/seo.ts`      | Titles, descriptions, keywords, Open Graph, JSON-LD              |

`lib/site-config.ts` and `lib/seo.ts` remain as thin re-exports so old imports still work.

### Personal info

```ts
// settings/identity.ts
fullName:        "Jay Patel",
email:           "...",
github:          "...",
githubUsername:  "jaypatel364",
linkedin:        "...",
location:        "Ahmedabad, India",
resumeUrl:       "/jay-patel-resume.pdf",
resumeFileName:  "Jay-Patel-Resume.pdf",
bookingUrl:      "...",
careerStartDate: "2022-12",
```

### Feature flags

```ts
// settings/features.ts
showTerminalHero:  true,
showLoadingScreen: false,
showFAQ:           true,
showGameZone:      true,
showBrainGame:     true,
// …
showCatchTheBug:   true,
cursorEffect:      "magnetic",  // "none" | "particles" | "ripple" | "magnetic" | "lightning" | "pixelate"
allowIndexing:     false,       // flip true when going live
```

### Content (FAQ, headlines)

```ts
// settings/content.ts
headlineWords: ["clean UIs", "scalable apps", ...],
faqItems: [ { category: "work", question: "...", answer: "..." }, ... ],
```

### Adding a new game

1. Build your game component in `components/features/games/YourGame.tsx` — export a `YourGame({ onClose })` function
2. Add a flag to `settings/features.ts`: `showYourGame: true`
3. Add an entry to the `GAMES` array in `components/features/games/game-registry.tsx`
4. Wire the modal in `GameZone.tsx`

### Adding skills

Edit `SKILL_GROUPS` in `components/sections/skills/skill-data.ts`:

```ts
{ name: "Redis", icon: SiRedis, lightColor: "#D32E22", darkColor: "#FF4438" }
```

Icons from `react-icons/si` — browse [simpleicons.org](https://simpleicons.org).

### Adding projects

Edit `PROJECTS` in `components/sections/projects/ProjectsSection.tsx`:

```ts
{
  title: "My Project", tagline: "...", desc: "...",
  tags: ["React", "Node.js"], category: "fullstack",
  color: "from-violet-500/20 to-purple-500/20",
  codeUrl: "...", demoUrl: "...",
  // hideCode: true  |  nda: true  |  wip: true
}
```

### Updating the AI chatbot

- **Pre-built answers** (zero token cost) — edit `CANNED_ANSWERS` in `app/api/chat/route.ts`
- **Persona / facts** — edit `SYSTEM_PROMPT` in the same file

### Updating the loading screen

Edit `BOOT_LINES` in `components/layout/LoadingScreenParts.tsx`:

```ts
{ text: "Loading React · Next.js · TypeScript", preDelay: 140, suffix: "✓", speed: 22 }
```

### Updating Brain Game facts

Edit `SKILL_NODES` in `components/features/games/brain-data.ts` — each node has `id`, `label`, `Icon`, `color`, and `fact`.

### Cursor effect

```ts
// settings/features.ts
cursorEffect: "lightning",
```

Change to any of: `"none"` `"particles"` `"ripple"` `"magnetic"` `"lightning"` `"pixelate"`

---

## Icons

Icons are generated at request time:

- Favicon: `app/icon.tsx` → `/icon`
- Apple: `app/apple-icon.tsx` → `/apple-icon`
- Social card: `app/opengraph-image.tsx` → `/opengraph-image`

---

## Deployment

```bash
npm run build
npm run start
```

Deploys to Vercel automatically on push. Set `NEXT_PUBLIC_SITE_URL=https://jaypateldev.com` in Vercel environment variables before going live.

---

## Developer tooling

Git hooks (Husky) run automatically:

| Hook           | What runs                             |
| -------------- | ------------------------------------- |
| **pre-commit** | ESLint fix + Prettier on staged files |
| **pre-push**   | `tsc --noEmit` typecheck              |

Manual commands:

```bash
npm run lint          # ESLint (whole project)
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check (CI-friendly)
npm run typecheck     # TypeScript
```

After `npm install`, Husky is set up via the `prepare` script.
