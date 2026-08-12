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

### Loading Screen

- **Cinematic terminal boot sequence** — plays once per browser session (`sessionStorage` flag)
- **Typewriter effect** — 8 lines type one at a time with realistic per-character delays
- **macOS-style terminal window** — traffic light buttons, username@portfolio title bar
- **Aurora glow orbs** — three layered radial blobs animated independently behind the terminal
- **Smooth progress bar** — RAF-driven ease-out fill always reaches 100% within the 6-second budget
- **6-second hard cap** — loader always completes within budget even on slow machines
- **ESC to skip** — keyboard shortcut works from the very first render
- **Skip button** — visible after 1.5 s with ESC hint
- **Cinematic reveal** — three-layer exit: left/right curtain panels, glowing seam, radial iris bloom
- **Fully theme-aware** — uses CSS variables so it matches light, dark, and every accent colour
- **Toggle in `site-config`**: `showLoadingScreen: true | false`

### AI Chatbot

- **Floating FAB** — bottom-right, pulse ring, unread badge
- **"Chat with Jay" label** — animated pill appears ~2.8 s after load
- **Streaming responses** — word-by-word reveal with blinking caret
- **14 pre-built instant answers** — intro, tech stack, experience, location, rates, hire, freelance, contact, resume, portfolio build, coolest feature, learning, tools, GitHub/LinkedIn — zero Groq tokens for these
- **Quick chip suggestions** — 3 rotating groups of 4 chips on welcome screen + scrollable bar during conversation
- **Inline markdown** — `**bold**`, `` `code` ``, URLs as friendly pill links
- **Conversation limit** — 10 messages then "start fresh" banner
- **Security** — per-IP rate limiting (6 req/min, 30 req/hr), Zod validation, prompt injection guard, off-topic guard, token budget enforcer (3,500-token ceiling), history trimmed to 4 exchanges

### Jay's Brain Game

- **20 floating skill nodes** with real `react-icons/si` icons and physics drift
- **Click to unlock** — each node reveals a real fact about Jay's experience
- **All 20 unlocked → full celebration screen** with trophy, stat pills, confetti, and CTA to Contact
- **Keyboard** — `Space` = random unlock, `Escape` = close
- **Toggle in `site-config`**: `showBrainGame: true | false`

### FAQ Section

- **"Ask Me Anything" accordion** — honest answers to the questions Jay gets asked most
- **Category filter bar + segment progress dots** — all in one unified toolbar:
  - Filter pills: All / Work / Tech / Personal / Process — spring `layoutId` animated underlay
  - Segment dots (`■ ■ ■ □ □ □`) — one dot per question, fills as the user explores; pulses with a glow burst when all are read
  - `N/T` fraction beside the dots, turns primary colour at 100%
- **"All read" celebration banner** — slides in below the toolbar when every question has been opened: shimmer sweep, wobbling party-popper icon, inline "say hi →" button that scrolls to Contact
- **Per-category colour accents** — each category has its own colour (teal · blue · violet · amber) used on the left border, radial ink-blob glow, badge, and chevron
- **IDE line-number gutter** — `01`, `02`, … prefix on every question, coloured on open
- **Floating background blobs** — three blurred blobs drift independently (pure CSS, zero JS)
- **Fully accessible** — `aria-expanded`, `aria-controls`, keyboard Enter/Space, visible focus rings, respects `prefers-reduced-motion`
- **Toggle in `site-config`**: `showFAQ: true | false` — hides the section and removes the nav link everywhere

### Skills Section — View Toggle

- **Grid / 3D Sphere toggle** — always visible next to the filter tabs (desktop only)
- **Sphere is the default** — premium experience shown first
- **All filter + Sphere** — all 24 skills from every category in a single globe
- **Category filter + Sphere** — only that category's skills on the globe
- **Grid view** — original pill layout
- **Mobile** — always pill grid regardless of toggle

### 3D Skill Sphere

- **Fibonacci lattice** — most uniform point distribution on a sphere surface
- **Quadratic depth curve** — back nodes smaller/dimmer, theme-aware opacity floors
- **Rotating latitude rings** — 3 SVG rings projected through the same 3D math
- **Drag to spin** with Pointer Events API + `setPointerCapture`
- **Smooth momentum** — velocity capped + friction decay, auto-spin resumes when coasted to stop
- **Hover tooltip** — floating name card above each node in brand colour

### Brand Mark

- `JAY` in Space Grotesk Black with animated gradient text
- **Shimmer underline** — 2.5 px bar with a sweep animation on a 2.4 s loop
- **`.dev` floating pill** — monospace, rotated -1.5°, glow shadow, accent-aware border
- Fully accent-colour reactive — changes automatically with theme/accent

### GitHub Activity Graph

- **Rolling 12-month window** — always the trailing year from today
- **No horizontal scroll** — cells use `flex-1` + `ResizeObserver`
- **Correct month labels** — placed at the exact week where the 1st of each month falls
- **Local date arithmetic** — avoids UTC off-by-one in UTC+ timezones

### Hero Section

- **Word-swap headline** — configurable words with slot-machine slide animation
- **Interactive terminal** (`showTerminalHero: true`) — `zsh`-style, accepts `whoami`, `skills`, `experience`, `projects`, `contact`, `status`, `clear`, `help`; ↑↓ history, `Ctrl+C`, `Ctrl+L`

### Navigation

- **Command palette** (`⌘K`) — search, theme, accent, resume, social links
- **Keyboard shortcuts overlay** (`?`)
- **Global shortcuts** — `G+H/A/S/E/C/P` sections, `T` theme
- **Scroll progress badge** — section name + page % after hero (desktop)
- **Mobile accent picker** in hamburger menu
- FAQ nav link appears / disappears automatically based on `showFAQ`

### Projects Section

- Filter tabs: All / Fullstack / Frontend / Backend
- States: default · `hideCode: true` · `nda: true` (NDA ribbon) · `wip: true` (pulsing badge)

### Experience Section

- Cards and Timeline views with animated transitions

### Contact Form

- Saves to MongoDB + sends SMTP email independently
- Confetti on success, rate limiting (3 req/min), honeypot

### Personalisation

- **6 accent colour presets** persisted in `localStorage`
- **Dark / light mode** — respects `prefers-color-scheme`

### Performance & Technical

- Scroll progress bar, cursor spotlight, back-to-top FAB
- Section error boundaries, PWA (production only)
- Konami code easter egg — `↑↑↓↓←→←→BA`

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chatbot (Groq, rate-limited, streamed, pre-built answers)
│   │   └── contact/route.ts       # Contact form (MongoDB + SMTP)
│   ├── resume/page.tsx
│   ├── manifest.ts
│   ├── sitemap.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── portfolio/
│       ├── HeroSection.tsx        # Word-swap headline + interactive terminal
│       ├── AboutSection.tsx       # Bio, tech marquee, GitHub graph
│       ├── SkillsSection.tsx      # Grid/Sphere toggle, 3D globe, filter tabs
│       ├── ExperienceSection.tsx  # Cards / Timeline toggle
│       ├── ProjectsSection.tsx    # NDA / WIP / hideCode flags
│       ├── FAQSection.tsx         # Accordion, category filters, segment progress dots
│       ├── ContactSection.tsx     # Form with confetti + dual backend
│       ├── Navbar.tsx             # Responsive, FAQ-aware nav items
│       ├── GitHubGraph.tsx        # Rolling-year heatmap
│       ├── CommandPalette.tsx     # ⌘K palette
│       ├── ChatBot.tsx            # AI chatbot widget (streaming + pre-built)
│       ├── LoadingScreen.tsx      # Terminal boot sequence + cinematic reveal
│       ├── BrainGame.tsx          # Skill explorer + celebration screen
│       ├── AccentPicker.tsx
│       ├── ShortcutsOverlay.tsx
│       └── ...
│   └── ui/
│       ├── Brand.tsx              # JAY·dev logo mark with shimmer underline
│       └── ...                    # shadcn/ui primitives
├── hooks/
│   ├── use-accent.ts
│   ├── use-active-section.tsx     # IntersectionObserver — watches all section IDs
│   ├── use-count-up.ts
│   ├── use-scroll-progress.ts
│   └── use-theme.tsx
├── lib/
│   ├── accent-colors.ts
│   ├── resume-data.ts             # Work experience, education, skills (shared by sections + /resume)
│   ├── site-config.ts             # Single source of truth — all personal info + feature flags
│   └── utils.ts
└── public/
    ├── icons/
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

Create `.env.local` at the project root:

```env
# Site URL — used for canonical URLs and sitemap (required in production)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Groq AI — required for the chatbot
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# MongoDB — contact form storage (optional)
MONGODB_URI=mongodb+srv://...

# SMTP — contact form email notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
SMTP_FROM=your@email.com
CONTACT_NOTIFY_TO=your@email.com
```

`GROQ_API_KEY` is required for the chatbot. `NEXT_PUBLIC_SITE_URL` should be set to your real domain before going live. All other variables are optional — the site degrades gracefully without them.

---

## Customisation

All personal info and feature flags live in **`lib/site-config.ts`**:

```ts
export const siteConfig = {
  fullName:        "Jay Patel",
  email:           "...",
  github:          "...",
  githubUsername:  "jaypatel364",
  linkedin:        "...",
  location:        "Ahmedabad, India",
  resumeUrl:       "...",
  bookingUrl:      "...",
  careerStartDate: "2022-12",   // drives the experience label everywhere

  headlineWords: ["clean UIs", "scalable apps", ...],

  // ── Feature flags ─────────────────────────────────────────────────────────
  showTerminalHero:  true,   // interactive zsh terminal in Hero
  showLoadingScreen: true,   // cinematic boot sequence (once per session)
  showBrainGame:     true,   // floating skill-node game in Skills
  showFAQ:           true,   // FAQ section + nav link (false = hidden everywhere)

  // ── FAQ content ───────────────────────────────────────────────────────────
  faqItems: [
    {
      category: "work",     // "work" | "tech" | "personal" | "process"
      question: "...",
      answer:   "...",
    },
    // add or remove items freely
  ],

  // ── Skills grid preview counts ────────────────────────────────────────────
  skillPreviewCounts: {
    Frontend:         8,
    Backend:          8,
    "Tools & DevOps": 8,
  },

  dailyStack:         [...],   // comment out whole array to hide the marquee
  currentlyBuilding:  null,    // or { name, description, url }
  currentlyLearning:  [],      // or [{ name, icon }]
};
```

### Toggling the FAQ section

```ts
// lib/site-config.ts
showFAQ: false; // hides the section, removes the nav link, done
```

Editing FAQ questions and answers is also done entirely in `faqItems` — no other file needs to change.

### Adding skills

Edit `SKILL_GROUPS` in `components/portfolio/SkillsSection.tsx`:

```ts
{ name: "Redis", icon: SiRedis, lightColor: "#D32E22", darkColor: "#FF4438" }
```

Icons from `react-icons/si` — browse [simpleicons.org](https://simpleicons.org).

### Adding projects

Edit `PROJECTS` in `components/portfolio/ProjectsSection.tsx`:

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
- **Hourly rates** — update both `CANNED_ANSWERS` and `SYSTEM_PROMPT` in the same file
- **Persona / facts** — edit `SYSTEM_PROMPT` in the same file

### Updating the loading screen

Edit `BOOT_LINES` in `components/portfolio/LoadingScreen.tsx`:

```ts
{ text: "Loading React · Next.js · TypeScript", preDelay: 140, suffix: "✓", speed: 22 }
```

- `preDelay` — ms before this line starts typing
- `speed` — ms per character (lower = faster)
- `comment: true` — italic dimmed style for `// comment` lines

### Updating Brain Game facts

Edit `SKILL_NODES` in `components/portfolio/BrainGame.tsx` — each node has `id`, `label`, `Icon`, `color`, and `fact`.

---

## PWA Icons

Replace placeholder icons in `public/icons/` before deploying.

---

## Deployment

```bash
npm run build
npm run start
```

Deploys to Vercel automatically on push. Service worker only activates in production. Set `NEXT_PUBLIC_SITE_URL` to your real domain in Vercel environment variables before going live.
