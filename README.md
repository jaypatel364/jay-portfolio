# Jay Patel — Portfolio

Personal portfolio website for Jay Patel, Full Stack Developer. Built with Next.js 15, React 19, Tailwind CSS v4, and Framer Motion.

Live at: `https://jay-portfolio.vercel.app`

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
| Email           | Nodemailer (SMTP contact notifications)                       |
| Toast           | Sonner                                                        |
| Command Palette | cmdk                                                          |
| PWA             | @ducanh2912/next-pwa                                          |
| Deployment      | Vercel                                                        |

---

## Features

### Loading Screen _(new)_

- **Cinematic terminal boot sequence** — plays once per browser session on first visit, then never again (`sessionStorage` flag)
- **Typewriter effect** — 8 lines type one at a time with realistic per-character delays; each line has its own speed setting
- **macOS-style terminal window** — traffic light buttons, username@portfolio title bar, system info header
- **Aurora glow orbs** — three layered radial gradient blobs animated independently behind the terminal
- **Animated progress bar** — smooth fill with a shimmer sweep, percentage counter
- **Skip button** — appears after 1.5 s with `ESC` hint for impatient visitors
- **Split-panel curtain reveal** — two panels slide outward on completion, with a glowing primary-colour seam at the centre
- **Fully theme-aware** — uses CSS variables (`--background`, `--card`, `--border`, `--primary`) so it matches light, dark, and every accent colour automatically
- **Toggle in `site-config`**: `showLoadingScreen: true | false`

### AI Chatbot _(new)_

- **Floating FAB** — bottom-right, `MessageCircle` icon, pulse ring animation, unread badge
- **"Chat with Jay" label** — animated pill appears ~2.8 s after page load to draw attention, hides when chat opens
- **Streaming responses** — word-by-word reveal with a blinking caret; typing dots while waiting for the first token
- **Jay's AI twin persona** — speaks in first person as Jay; knows his stack, experience, portfolio design, and contact details
- **Quick chip suggestions** — 3 rotating groups of 4 chips shown on the welcome screen; a scrollable chip bar appears above the input during conversation so users always have ideas
- **Inline markdown rendering** — `**bold**`, `` `code` ``, and URLs rendered as friendly pill links (LinkedIn → "LinkedIn Profile", Google Drive → "Resume (Google Drive)", etc.) — raw URLs never shown
- **Conversation limit** — at 10 messages shows a friendly "my brain is full 🧠💥" banner with a "Start fresh" button
- **Security & reliability**
  - Per-IP rate limiting: 6 req/min, 30 req/hr (well within Groq free-tier 30 RPM)
  - Zod schema validation on every request
  - Prompt injection guard (regex patterns block jailbreak attempts)
  - Off-topic guard with `JAY_CONTEXT_WORDS` allowlist — "introduce yourself", "your stack" etc. always pass through; clearly unrelated topics get a funny canned reply (zero Groq tokens spent)
  - Token budget enforcer — drops oldest message pairs before calling Groq if input chars exceed the 3,500-token ceiling
  - History trimmed to last 4 exchanges (8 messages) before every API call
  - `max_tokens: 250`, compressed system prompt (~180 tokens) — worst-case ~1,600 tokens per request
  - All errors mapped to user-friendly messages — raw API strings never reach the UI
- **Toggle in `site-config`**: no flag needed — chatbot is always available once `GROQ_API_KEY` is set

### Jay's Brain Game _(new)_

- **Interactive skill explorer** in the Skills section — click "Explore Jay's Brain 🧠" to open
- **20 floating skill nodes** with real `react-icons/si` icons — same library used in SkillsSection
- **Physics-based drift** — Poisson-disc initial placement guarantees no overlaps; soft repulsion force keeps nodes from colliding; momentum friction makes motion smooth
- **Click to unlock** — each node reveals a fun fact about Jay's real experience with that technology
- **Lock / check badges** — 🔒 on unvisited nodes, ✓ green check on unlocked
- **Fact panel** — slides in from bottom-right with a colour-matched accent stripe and the node's full story
- **SVG progress ring** in the header counts up as you unlock
- **All 20 unlocked** → confetti burst + "You explored all of Jay's brain! 🎉" banner
- **Keyboard shortcuts**: `Space` = unlock a random node, `Escape` = close
- **Toggle in `site-config`**: `showBrainGame: true | false`

### 3D Skill Sphere _(new)_

- **Replaces the orbital ring** in the single-category (Frontend / Backend / Tools) view on desktop
- **Fibonacci lattice distribution** — most uniform point placement on a sphere surface, no clustering at poles
- **Quadratic depth curve** — back nodes are meaningfully smaller and dimmer; theme-aware opacity floor (65% dark / 55% light) so nothing disappears
- **Rotating latitude lines** — 3 SVG latitude rings (solid equator + 2 dashed) projected through the same 3D math as the nodes, so they rotate with the globe
- **Drag to spin** — mouse and touch via Pointer Events API; `setPointerCapture` keeps drag working even when cursor leaves the container
- **Momentum on release** — velocity measured from drag delta; RAF loop decays with friction (`0.965`) so it coasts to a stop naturally
- **Auto-spin resumes** when velocity drops below threshold
- **Hover tooltip** — floating card above each node with the skill name in brand colour
- **Atmosphere glow** — radial gradient behind the sphere using `var(--primary)`, follows accent colour

### GitHub Activity Graph _(improved)_

- **Rolling 12-month window** — always shows the trailing year from today (Aug 2025 → Aug 2026 right now), never a fixed calendar year
- **No horizontal scroll** — cells use `flex-1` to fill 100% of the container; a `ResizeObserver` recalculates cell size on every resize
- **Correct month labels** — placed at the exact week index where the 1st of each month appears, so "Jun" sits above Jun 1's column, not May 26's
- **Local date arithmetic** — `localDateStr()` helper uses `getFullYear/Month/Date` (never `toISOString`) to avoid UTC off-by-one errors in UTC+ timezones
- **Stats pills** — total contributions, best streak, current streak, peak day — all with animated counters

### Hero Section

- **Inline word-swap headline** — cycles through configurable words with a slot-machine slide animation
- **Interactive terminal** (`showTerminalHero: true`) — `zsh`-style terminal accepting `whoami`, `skills`, `experience`, `projects`, `contact`, `status`, `clear`, `help`. Supports ↑↓ history, `Ctrl+C`, `Ctrl+L`. Commands in `help` are clickable. Boot sequence types in on mount.
- **Two-column layout** when terminal is on — text left, terminal right on desktop; collapses to centred single column on mobile
- **Availability badge** — links to booking URL configured in `siteConfig`

### Navigation

- **Responsive breakpoint** — full desktop navbar at ≥ 1024 px, mobile hamburger at ≤ 1023 px
- **Command palette** (`⌘K` / `Ctrl+K`) — search sections, toggle theme, change accent, open resume, navigate to social links
- **Keyboard shortcuts overlay** (`?`) — full shortcut reference modal
- **Global shortcuts** — `G+H/A/S/E/C/P` to jump sections, `T` toggle theme
- **Scroll progress badge** — section name + page % after scrolling past hero (desktop only)
- **Active section pill** — spring-animated indicator in desktop nav
- **Mobile accent picker** — full colour swatch popover inside the hamburger menu

### Skills Section

- **Filter tabs** — All / Frontend / Backend / Tools with spring-animated active pill
- **All view** — category cards with `flex-wrap` pill grids; `previewCount` per category controls how many pills show (extras replaced with a "+N more" badge)
- **Single-category view** — 3D sphere on desktop; pill grid fallback on mobile
- **`skillPreviewCounts` in `site-config`** — set per-category preview limits without touching component code
- **Animated stat counters** — skills, experience, projects count up on scroll
- **Dynamic experience label** — auto-calculated from `careerStartDate`

### Projects Section

- **Filter tabs** — All / Fullstack / Frontend / Backend
- **Three project states**: default (code + demo links) · `hideCode: true` · `nda: true` (lock badge + NDA ribbon) · `wip: true` (pulsing "In Progress" badge)
- **NDA footnote** — auto-appears when any NDA project is visible

### Experience Section

- **View toggle** — Cards and Timeline views with animated transitions
- **Timeline view** — alternating left/right layout with year markers

### Contact Form

- **Dual-service** — saves to MongoDB and sends SMTP email independently
- **Confetti on success** — canvas particle burst
- **Rate limiting** — 3 req/min per IP
- **Honeypot** — bot detection field

### Personalization

- **6 accent colour presets** — Amber, Violet, Cyan, Emerald, Rose (+ default) stored in `localStorage`
- **Dark / light mode** — persists, respects `prefers-color-scheme`
- **Accent synced to `/resume`** — `ResumeThemeSync` applies saved theme + accent

### Performance & Technical

- **Scroll progress bar** — spring-animated fill at the top of the page
- **Cursor spotlight** — radial gradient following the mouse (desktop only)
- **Back to top button** — bottom-left, appears after 400 px scroll
- **Page entrance animation** — staggered fade-in on load
- **PWA** — installable, offline-capable (production only)
- **Section error boundaries** — one crash never blanks the whole page
- **Konami code easter egg** — `↑↑↓↓←→←→BA` triggers matrix rain overlay

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chatbot API (Groq, rate-limited, streamed)
│   │   └── contact/route.ts       # Contact form API (MongoDB + SMTP)
│   ├── resume/page.tsx            # Standalone resume route
│   ├── manifest.ts                # PWA web manifest
│   ├── sitemap.ts                 # Dynamic sitemap
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── portfolio/
│       ├── HeroSection.tsx        # Word-swap headline + interactive terminal
│       ├── AboutSection.tsx       # Bio, highlights, tech marquee, GitHub graph
│       ├── SkillsSection.tsx      # 3D sphere + grid skills with brand icons
│       ├── ExperienceSection.tsx  # Cards / Timeline toggle
│       ├── ProjectsSection.tsx    # Projects with NDA / WIP / hideCode flags
│       ├── ContactSection.tsx     # Form with confetti + dual-service backend
│       ├── Navbar.tsx             # Responsive navbar (lg: breakpoint)
│       ├── GitHubGraph.tsx        # Live rolling-year contribution heatmap
│       ├── CommandPalette.tsx     # ⌘K command palette
│       ├── ChatBot.tsx            # AI chatbot widget (Groq streaming)
│       ├── LoadingScreen.tsx      # Cinematic terminal boot sequence
│       ├── BrainGame.tsx          # "Jay's Brain" interactive skill explorer
│       ├── AccentPicker.tsx       # Desktop accent colour popover
│       ├── ShortcutsOverlay.tsx   # Keyboard shortcuts modal
│       ├── ScrollProgressBar.tsx  # Top-of-page scroll indicator
│       ├── BackToTop.tsx          # Back-to-top FAB (bottom-left)
│       ├── CursorSpotlight.tsx    # Mouse-follow radial gradient
│       ├── KonamiEasterEgg.tsx    # Matrix rain easter egg
│       └── ...                    # Other feature components
│   └── ui/                        # shadcn/ui primitives
├── hooks/
│   ├── use-accent.ts              # Accent colour state + CSS var injection
│   ├── use-active-section.ts      # IntersectionObserver section tracking
│   ├── use-count-up.ts            # Scroll-triggered number counter
│   ├── use-scroll-progress.ts     # Page scroll percentage
│   └── use-theme.tsx              # Dark/light theme context
├── lib/
│   ├── accent-colors.ts           # Accent preset definitions
│   ├── resume-data.ts             # Experience, education, skills data
│   ├── site-config.ts             # Single source of truth for all personal info
│   └── utils.ts                   # cn(), getExperienceLabel()
└── public/
    ├── icons/                     # PWA icons (replace before deploy)
    └── robots.txt
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file at the project root.

```env
# ── Groq AI — required for the chatbot
# Get your free key at https://console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Base URL — used in sitemap.xml
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# ── MongoDB — contact form message storage (optional)
MONGODB_URI=mongodb+srv://...

# ── SMTP — contact form email notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
SMTP_FROM=your@email.com
CONTACT_NOTIFY_TO=your@email.com
```

`GROQ_API_KEY` is the only new required variable. All others are optional — the contact form degrades gracefully if either service is unconfigured.

See `.env.example` for reference.

---

## Customisation

All personal information lives in one file: **`lib/site-config.ts`**

```ts
export const siteConfig = {
  fullName:        "Jay Patel",
  email:           "...",
  github:          "...",
  githubUsername:  "jaypatel364",  // drives GitHub activity graph
  linkedin:        "...",
  location:        "Ahmedabad, India",
  resumeUrl:       "...",
  bookingUrl:      "...",
  careerStartDate: "2022-12",      // drives experience label automatically
  projectCount:    10,

  headlineWords: ["clean UIs", "scalable apps", ...],

  // ── Feature flags ─────────────────────────────────────────────────────────
  showTerminalHero:  true,   // interactive terminal in Hero section
  showLoadingScreen: true,   // cinematic boot sequence on first visit
  showBrainGame:     true,   // "Jay's Brain" skill explorer game in Skills

  // ── Skills section preview counts ─────────────────────────────────────────
  // Controls how many skills show in the "All" grid per category.
  // The 3D sphere (single-category view) always shows every skill.
  skillPreviewCounts: {
    Frontend:         8,
    Backend:          8,
    "Tools & DevOps": 8,
  },

  // ── About section marquee ─────────────────────────────────────────────────
  dailyStack: [
    { name: "React",      icon: "⚛️" },
    { name: "Next.js",    icon: "▲"  },
    // ... comment out the whole array to hide the marquee
  ],

  currentlyBuilding: null,   // or { name, description, url }
  currentlyLearning: [],     // or [{ name, icon }, ...]
};
```

### Adding / removing skills

Edit `SKILL_GROUPS` in `components/portfolio/SkillsSection.tsx`:

```ts
{ name: "Redis", icon: SiRedis, lightColor: "#D32E22", darkColor: "#FF4438" }
```

- The 3D sphere shows **all** skills in the single-category view regardless of count.
- `skillPreviewCounts` in `site-config` controls how many appear in the "All" grid (extras show as a "+N more" badge).
- Icons come from `react-icons/si` — browse [simpleicons.org](https://simpleicons.org) for names and brand colours.

### Adding projects

Edit `PROJECTS` in `components/portfolio/ProjectsSection.tsx`:

```ts
{
  title:     "My Project",
  tagline:   "One-line description",
  desc:      "What it does.",
  tags:      ["React", "Node.js"],
  category:  "fullstack",           // fullstack | frontend | backend
  color:     "from-violet-500/20 to-purple-500/20",
  iconColor: "oklch(0.6 0.2 295)",
  codeUrl:   "https://github.com/...",
  demoUrl:   "https://...",
  // hideCode: true,                 // hide Code link, keep Demo
  // nda: true,                      // hide both links, show NDA badge
  // wip: true,                      // show "In Progress" pulsing badge
}
```

### Updating the AI chatbot persona

The chatbot's knowledge and personality live in the `SYSTEM_PROMPT` constant in `app/api/chat/route.ts`. Update the facts there to match any changes to your experience, stack, or contact details. Keep it concise — the prompt is compressed to ~180 tokens to stay well within Groq's free-tier 6,000 TPM limit.

### Updating the loading screen boot lines

Edit `BOOT_LINES` in `components/portfolio/LoadingScreen.tsx`. Each line has:

```ts
{ text: "Loading React · Next.js · TypeScript", preDelay: 140, suffix: "✓", speed: 22 }
```

- `preDelay` — ms to wait before this line starts typing
- `speed` — ms per character (lower = faster)
- `suffix` — text shown after the line finishes (e.g. `"✓"`, `"☕ ✓"`)
- `comment: true` — renders the line dimmer and italic (for `// comment` style lines)

### Updating Jay's Brain facts

Edit `SKILL_NODES` in `components/portfolio/BrainGame.tsx`. Each node has `id`, `label`, `Icon` (from `react-icons/si`), `color` (brand hex), and `fact` (the fun fact shown on unlock).

---

## PWA Icons

Replace the placeholder icons in `public/icons/` before deploying.

---

## Deployment

```bash
npm run build
npm run start
```

Deploys to Vercel automatically on push. The service worker is disabled in development and only activates in production builds.
