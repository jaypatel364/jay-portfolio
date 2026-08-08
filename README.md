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
- **Smooth progress bar** — RAF-driven ease-out fill always reaches 100% within the 6-second budget, never gets stuck mid-way
- **6-second hard cap** — loader always completes within budget even on slow machines
- **ESC to skip** — keyboard shortcut works from the very first render (no delay)
- **Skip button** — visible after 1.5 s with ESC hint for impatient visitors
- **Cinematic reveal** — three-layer exit: left/right curtain panels slide out, glowing seam pulses, radial iris bloom expands from centre
- **Fully theme-aware** — uses CSS variables so it matches light, dark, and every accent colour
- **Toggle in `site-config`**: `showLoadingScreen: true | false`

### AI Chatbot

- **Floating FAB** — bottom-right, pulse ring, unread badge
- **"Chat with Jay" label** — animated pill appears ~2.8 s after load
- **Streaming responses** — word-by-word reveal with blinking caret
- **14 pre-built instant answers** — intro, tech stack, experience, location, rates, hire, freelance, contact, resume, portfolio build, coolest feature, learning, tools, GitHub/LinkedIn — zero Groq tokens for these
- **Pricing chip** — "💰 What are your hourly rates?" quick chip added to group 3
- **Hourly rates in system prompt** — Small $15–30/hr · Medium $25–50/hr · Complex $35–80/hr, always negotiable
- **Quick chip suggestions** — 3 rotating groups of 4 chips on welcome screen + scrollable bar during conversation
- **Inline markdown** — `**bold**`, `` `code` ``, URLs as friendly pill links
- **Conversation limit** — 10 messages then "start fresh" banner
- **Security**: per-IP rate limiting (6 req/min, 30 req/hr), Zod validation, prompt injection guard, off-topic guard, token budget enforcer (3,500-token ceiling), history trimmed to 4 exchanges

### Jay's Brain Game

- **20 floating skill nodes** with real `react-icons/si` icons and physics drift
- **Click to unlock** — each node reveals a real fact about Jay's experience
- **All 20 unlocked → full celebration screen**:
  - Floating trophy with pulsing glow halo and 5 orbiting sparkle dots
  - "You cracked Jay's Brain! 🧠" headline with personalised subtext
  - Stat pills: skills unlocked · 200+ IQ certified · 🏆 Explorer badge
  - **"Now let's build something together →"** CTA — closes the game and scrolls to the Contact section
  - "Keep exploring ↩" secondary button to dismiss and continue
  - Confetti fires behind the overlay
- **Keyboard**: `Space` = random unlock, `Escape` = close
- **Toggle in `site-config`**: `showBrainGame: true | false`

### Skills Section — View Toggle

- **Grid / 3D Sphere toggle** — always visible next to the filter tabs (desktop only)
- **Sphere is the default** — premium experience shown first
- **All filter + Sphere** — all 24 skills from every category in a single globe
- **Category filter + Sphere** — only that category's 8 skills on the globe
- **Grid view** — original pill layout (All → 3-col CategoryCard, single category → OverflowPill list)
- **Momentum physics fix** — velocity capped at `MAX_VEL = 0.012`, friction increased to `0.92`, dt spike clamped to 24 ms — fast flicks now decelerate smoothly instead of spinning wildly
- **Mobile** — always pill grid regardless of toggle (sphere is desktop-only)

### 3D Skill Sphere

- **Fibonacci lattice** — most uniform point distribution on a sphere surface
- **Quadratic depth curve** — back nodes smaller/dimmer, theme-aware opacity floors
- **Rotating latitude rings** — 3 SVG rings projected through the same 3D math
- **Drag to spin** with Pointer Events API + `setPointerCapture`
- **Smooth momentum** — velocity capped + friction decay, auto-spin resumes when coasted to stop
- **Hover tooltip** — floating name card above each node in brand colour

### Brand Mark

- `JAY` in Space Grotesk Black with animated gradient text
- **Shimmer underline** — 2.5 px bar with a sweep animation on 2.4 s loop
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
- **Scroll progress badge** — section + page % after hero (desktop)
- **Mobile accent picker** in hamburger menu

### Projects Section

- Filter tabs: All / Fullstack / Frontend / Backend
- States: default · `hideCode: true` · `nda: true` (NDA ribbon) · `wip: true` (pulsing badge)

### Experience Section

- Cards and Timeline views with animated transitions

### Contact Form

- Saves to MongoDB + sends SMTP email independently
- Confetti on success, rate limiting (3 req/min), honeypot

### Personalization

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
│       ├── ContactSection.tsx     # Form with confetti + dual backend
│       ├── Navbar.tsx             # Responsive (lg breakpoint)
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
│   ├── use-active-section.ts
│   ├── use-count-up.ts
│   ├── use-scroll-progress.ts
│   └── use-theme.tsx
├── lib/
│   ├── accent-colors.ts
│   ├── resume-data.ts
│   ├── site-config.ts             # Single source of truth for all personal info
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
# Groq AI — required for the chatbot
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Base URL — used in sitemap
NEXT_PUBLIC_BASE_URL=https://your-domain.com

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

`GROQ_API_KEY` is the only required variable. Contact form degrades gracefully if MongoDB or SMTP is unconfigured.

---

## Customisation

All personal info lives in **`lib/site-config.ts`**:

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
  careerStartDate: "2022-12",   // drives experience label everywhere
  projectCount:    10,

  headlineWords: ["clean UIs", "scalable apps", ...],

  // Feature flags
  showTerminalHero:  true,
  showLoadingScreen: true,
  showBrainGame:     true,

  // Controls pills shown in "All" grid per category
  skillPreviewCounts: {
    Frontend:         8,
    Backend:          8,
    "Tools & DevOps": 8,
  },

  dailyStack: [...],          // comment out whole array to hide marquee
  currentlyBuilding: null,    // or { name, description, url }
  currentlyLearning: [],      // or [{ name, icon }]
};
```

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

- **Pre-built answers** (zero token cost): edit `CANNED_ANSWERS` in `app/api/chat/route.ts`
- **Hourly rates**: already in both `CANNED_ANSWERS` and `SYSTEM_PROMPT` — update both
- **Persona / facts**: edit `SYSTEM_PROMPT` in the same file

### Updating the loading screen

Edit `BOOT_LINES` in `components/portfolio/LoadingScreen.tsx`:

```ts
{ text: "Loading React · Next.js · TypeScript", preDelay: 140, suffix: "✓", speed: 22 }
```

- `preDelay` — ms before this line starts
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

Deploys to Vercel automatically on push. Service worker only activates in production.
