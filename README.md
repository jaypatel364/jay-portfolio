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
| Database        | MongoDB (contact form storage)                                |
| Email           | Nodemailer (SMTP contact notifications)                       |
| Toast           | Sonner                                                        |
| Command Palette | cmdk                                                          |
| PWA             | @ducanh2912/next-pwa                                          |
| Deployment      | Vercel                                                        |

---

## Features

### Hero Section

- **Inline word-swap headline** — cycles through configurable words with a slot-machine slide animation
- **Interactive terminal** (`showTerminalHero: true` in `siteConfig`) — a fully interactive `zsh`-style terminal card that accepts real commands: `whoami`, `skills`, `experience`, `projects`, `contact`, `status`, `clear`, `help`. Supports ↑↓ command history, `Ctrl+C`, `Ctrl+L`. Each command in `help` is clickable. Boot sequence types in automatically on mount.
- **Two-column layout when terminal is on** — text left, terminal right on desktop (`lg:`+). Both columns collapse to centered single column on mobile and tablet.
- **Availability badge** — links to booking URL, configurable in `siteConfig`

### Navigation

- **Responsive breakpoint** — full desktop navbar at ≥ 1024px (`lg:`), mobile hamburger menu at ≤ 1023px
- **Command palette** (`⌘K` / `Ctrl+K`) — search sections, toggle theme, change accent, open resume, navigate to social links
- **Keyboard shortcuts overlay** (`?`) — full shortcut reference modal
- **Global keyboard shortcuts** — `G+H/A/S/E/C/P` (and `G+O`) to jump sections, `T` to toggle theme
- **Scroll progress badge** — shows current section + page % after scrolling past the hero (desktop only)
- **Active section indicator** — spring-animated pill in desktop nav
- **Mobile menu** — slide-in drawer with all nav items + Appearance row (accent picker + theme toggle)
- **Mobile accent picker** — full color swatch popover inside the mobile menu, same options as desktop

### About Section

- **Daily stack marquee** — two-row infinite scrolling strip of tech icons using official brand SVGs from Simple Icons (`react-icons/si`). Two rows scroll in opposite directions. Toggle by commenting out `dailyStack` in `siteConfig`. Icons show brand colours at rest; hover adds a colour wash and border tint.
- **GitHub activity graph** — live contribution heatmap for the past year fetched from a public proxy API (no token required). Shows total contributions, longest streak, and peak day. Cells animate in column-by-column on scroll. Hover tooltip shows exact date and count. Fully accent-colour-aware.
- **Currently building badge** — driven from `siteConfig.currentlyBuilding`, hides when `null`
- **What I'm learning badge** — driven from `siteConfig.currentlyLearning`, hides when empty

### Skills Section

- **Filter tabs** — All / Frontend / Backend / Tools with spring-animated active pill (original style)
- **All view** — three category cards, each with a fluid `flex-wrap` icon grid. Add any number of skills — the layout never breaks.
- **Single category — orbital view** (desktop) — skills orbit around a central hub icon in a continuously rotating ring. Inner ring rotates clockwise, nodes counter-rotate to stay upright. Hover fires a sonar-pulse ripple in brand colour + glow. Center hub pulses with a breathing animation.
- **Overflow handling** — max 8 skills on the orbital ring. 9th and 10th skills render as compact `OverflowPill` badges below the canvas, animated in with a spring.
- **Mobile fallback** — orbital collapses to a centred pill grid on screens below `md`
- **Brand icons always visible** — all skill icons use `react-icons/si` with official brand colours shown at rest (not just on hover). Theme-aware: dark-on-light icons (Next.js, GitHub, etc.) switch to dark grey in light mode.
- **Animated stat counters** — numbers count up on scroll into view
- **Dynamic experience label** — auto-calculated from `careerStartDate` in `siteConfig`

### Projects Section

- **Filter tabs** — All / Fullstack / Frontend / Backend
- **Three project states:**
  - Default — shows Code + Demo links
  - `hideCode: true` — hides Code link, Demo still shows (private/closed-source repos)
  - `nda: true` — hides both links, shows lock badge + "NDA" ribbon, muted card style
  - `wip: true` — pulsing "In Progress" badge, primary-tinted border, hammer icon in footer
- **Explicit URLs** — `codeUrl` and `demoUrl` fields per project, replace `#` with real links
- **NDA footnote** — auto-appears when any NDA project is visible in the current filter
- **Scroll + filter animations** — `whileInView` entrance + `AnimatePresence` filter transitions

### Experience Section

- **View toggle** — switch between Cards and Timeline views with animated transitions
- **Timeline view** — alternating left/right layout with year markers and role chips

### Contact Form

- **Dual-service architecture** — saves to MongoDB and sends SMTP email independently; both optional and non-fatal
- **Confetti on success** — canvas-based particle burst
- **Toast notifications** — success/error feedback via Sonner
- **Copy email** — click email address anywhere to copy to clipboard
- **Rate limiting** — in-memory per-IP limiter (3 requests/minute)
- **Honeypot** — bot detection field

### Personalization

- **Accent color picker** — 5 presets (Amber, Violet, Cyan, Emerald, Rose) stored in `localStorage`. Available on both desktop (navbar) and mobile (hamburger menu).
- **Dark / light mode** — persists across sessions, respects `prefers-color-scheme`
- **Accent synced to resume page** — `ResumeThemeSync` applies saved theme + accent on `/resume`

### Performance & Technical

- **Scroll progress bar** — spring-animated fill bar at the top of the page
- **Cursor spotlight** — radial gradient following the mouse with lerp smoothing (desktop only)
- **Back to top button** — appears after 400px scroll
- **Page entrance animation** — staggered fade-in on load
- **PWA** — installable, offline-capable via service worker (production only)
- **Error boundaries** — each section wrapped in `SectionErrorBoundary`; one crash never blanks the page
- **`robots.txt`** — allows all bots, blocks `/api/`
- **`sitemap.xml`** — dynamic Next.js route using `NEXT_PUBLIC_BASE_URL`

### Easter Egg

- **Konami code** (`↑↑↓↓←→←→BA`) — triggers a full-screen matrix rain canvas overlay

### Resume Route (`/resume`)

- Standalone page with data from `lib/resume-data.ts`
- Accent + dark/light theme synced from `localStorage`
- Download button links to configurable Google Drive PDF

---

## Project Structure

```
├── app/
│   ├── api/contact/route.ts   # Contact form API (MongoDB + SMTP)
│   ├── resume/page.tsx        # Standalone resume route
│   ├── manifest.ts            # PWA web manifest
│   ├── sitemap.ts             # Dynamic sitemap
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── portfolio/
│       ├── HeroSection.tsx        # Word-swap headline + interactive terminal
│       ├── AboutSection.tsx       # Bio, highlights, tech marquee, GitHub graph
│       ├── SkillsSection.tsx      # Orbital + grid skills with brand icons
│       ├── ExperienceSection.tsx  # Cards / Timeline toggle
│       ├── ProjectsSection.tsx    # Projects with NDA / WIP / hideCode flags
│       ├── ContactSection.tsx     # Form with confetti + dual-service backend
│       ├── Navbar.tsx             # Responsive navbar (lg: breakpoint)
│       ├── TechMarquee.tsx        # Infinite scrolling brand icon strip
│       ├── GitHubGraph.tsx        # Live contribution heatmap
│       ├── CommandPalette.tsx     # ⌘K command palette
│       ├── AccentPicker.tsx       # Desktop accent color popover
│       ├── ShortcutsOverlay.tsx   # Keyboard shortcuts modal
│       └── ...                    # Other feature components
│   └── ui/                    # shadcn/ui primitives
├── hooks/
│   ├── use-accent.ts          # Accent color state + CSS var injection
│   ├── use-active-section.ts  # IntersectionObserver section tracking
│   ├── use-count-up.ts        # Scroll-triggered number counter
│   ├── use-scroll-progress.ts # Page scroll percentage
│   └── use-theme.tsx          # Dark/light theme context
├── lib/
│   ├── accent-colors.ts       # Accent preset definitions
│   ├── resume-data.ts         # Experience, education, skills data
│   ├── site-config.ts         # Single source of truth for all personal info
│   └── utils.ts               # cn(), getExperienceLabel()
└── public/
    ├── icons/                 # PWA icons (replace before deploy)
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

Create a `.env.local` file at the project root. All variables are optional — the contact form degrades gracefully if either service is unconfigured.

```env
# Base URL — used in sitemap.xml
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# MongoDB — contact form message storage (optional)
MONGODB_URI=mongodb+srv://...

# SMTP — contact form email notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
SMTP_FROM=your@email.com
CONTACT_NOTIFY_TO=your@email.com
```

See `.env.example` for reference.

---

## Customisation

All personal information lives in one file: **`lib/site-config.ts`**

```ts
export const siteConfig = {
  fullName: "Jay Patel",
  email: "...",
  github: "...",
  githubUsername: "jaypatel364",   // drives the GitHub activity graph
  linkedin: "...",
  location: "Ahmedabad, India",
  resumeUrl: "...",
  bookingUrl: "...",
  careerStartDate: "2022-12",      // drives experience label automatically
  projectCount: 10,

  headlineWords: ["clean UIs", "scalable apps", ...],

  // Interactive terminal in Hero (set true to enable two-column layout)
  showTerminalHero: false,

  // About section — scrolling brand icon strip
  // Comment out the array entirely to hide the marquee
  dailyStack: [
    { name: "React",      icon: "⚛️" },
    { name: "Next.js",    icon: "▲"  },
    { name: "TypeScript", icon: "🔷" },
    // ... add any name that matches ICON_MAP in TechMarquee.tsx
  ],

  currentlyBuilding: null,    // or { name, description, url }
  currentlyLearning: [],      // or [{ name, icon }, ...]
};
```

### Adding / removing skills

Open `components/portfolio/SkillsSection.tsx` and edit the `SKILL_GROUPS` array. Each skill needs:

```ts
{ name: "Redis", icon: SiRedis, lightColor: "#D32E22", darkColor: "#FF4438" }
```

- Max 8 skills per category show on the orbital ring. The 9th and 10th appear as pill badges below.
- Add the `Si*` icon from `react-icons/si` — browse [simpleicons.org](https://simpleicons.org) for names.
- `lightColor` / `darkColor` — official brand hex from [simpleicons.org](https://simpleicons.org).

### Adding projects

Open `components/portfolio/ProjectsSection.tsx` and add an entry to `PROJECTS`:

```ts
{
  title: "My Project",
  tagline: "What it is",
  desc: "What it does.",
  tags: ["React", "Node.js"],
  category: "fullstack",          // fullstack | frontend | backend
  color: "from-violet-500/20 to-purple-500/20",
  iconColor: "oklch(0.6 0.2 295)",
  codeUrl: "https://github.com/...",
  demoUrl: "https://...",
  // hideCode: true,               // hide Code link, keep Demo
  // nda: true,                    // hide both links, show NDA badge
  // wip: true,                    // show "In Progress" pulsing badge
}
```

### Toggling the terminal hero

In `lib/site-config.ts`:

```ts
showTerminalHero: true; // enables two-column hero with interactive terminal
showTerminalHero: false; // standard centered single-column hero (default)
```

To update the terminal commands or boot lines, edit `BOOT_LINES` and `buildOutput()` in `components/portfolio/HeroSection.tsx`.

---

## PWA Icons

Replace the placeholder icons in `public/icons/` before deploying. See `public/icons/README.md` for instructions.

---

## Deployment

```bash
npm run build
npm run start
```

Deploys to Vercel automatically on push. The service worker is disabled in development and only activates in production builds.
