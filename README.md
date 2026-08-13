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

- Cinematic terminal boot sequence — plays once per browser session (`sessionStorage` flag)
- Typewriter effect — 8 lines type one at a time with realistic per-character delays
- macOS-style terminal window — traffic light buttons, username@portfolio title bar
- Smooth progress bar, 6-second hard cap, ESC to skip
- Three-layer cinematic reveal: left/right curtain panels, glowing seam, radial iris bloom
- Toggle: `showLoadingScreen: true | false`

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

Every game has an on/off flag in `lib/site-config.ts`. Setting it to `false` removes the game card entirely — no button, no modal.

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

Five canvas-based cursor effects. Set one value in `site-config.ts` — switching is instant.

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
- Contact form — saves to MongoDB + sends SMTP email; confetti on success, rate limiting, honeypot field
- 6 accent colour presets persisted in `localStorage`
- Dark / light mode — respects `prefers-color-scheme`
- Scroll progress bar, cursor spotlight, back-to-top FAB
- Section error boundaries, PWA (production only)
- Konami code easter egg — `↑↑↓↓←→←→BA`

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chatbot (Groq, streaming, rate-limited, pre-built answers)
│   │   └── contact/route.ts       # Contact form (MongoDB + SMTP)
│   ├── resume/page.tsx
│   ├── manifest.ts
│   ├── sitemap.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── portfolio/
│       ├── HeroSection.tsx         # Word-swap headline + interactive terminal
│       ├── AboutSection.tsx        # Bio, tech marquee, GitHub graph
│       ├── SkillsSection.tsx       # Grid/Sphere toggle, 3D globe, filter tabs
│       ├── ExperienceSection.tsx   # Cards / Timeline toggle
│       ├── ProjectsSection.tsx     # NDA / WIP / hideCode flags
│       ├── FAQSection.tsx          # Accordion, category filters, segment progress dots
│       ├── ContactSection.tsx      # Form with confetti + dual backend
│       ├── Navbar.tsx              # Responsive, FAQ-aware nav items
│       ├── GitHubGraph.tsx         # Rolling-year heatmap
│       ├── CommandPalette.tsx      # ⌘K palette
│       ├── ChatBot.tsx             # AI chatbot widget (streaming + pre-built)
│       ├── LoadingScreen.tsx       # Terminal boot sequence + cinematic reveal
│       │
│       ├── GameZone.tsx            # Game hub — scalable modal with category tabs
│       ├── BrainGame.tsx           # Jay's Brain — floating skill-node explorer
│       ├── CodeBreakerGame.tsx     # Code Breaker — Simon Says tile game
│       ├── TypingSpeedTest.tsx     # Typing Speed Test — type Jay's real code
│       ├── ReactionTimeTest.tsx    # Reaction Time Test — flash + click
│       ├── EmojiMemory.tsx         # Emoji Memory Flip — 4×4 card matching
│       ├── ColorMatch.tsx          # Color Match Blitz — swatch matching
│       ├── DotCollector.tsx        # Dot Collector — 30s click frenzy
│       ├── VibeCheck.tsx           # Vibe Check — dev personality quiz
│       ├── GravityOrbs.tsx         # Gravity Orbs — physics cursor game
│       ├── PixelDrawRace.tsx       # Pixel Draw Race — 8×8 pixel art recreation
│       ├── WordScramble.tsx        # Word Scramble — unscramble tech words
│       ├── StackBuild.tsx          # Stack & Build — block stacker (hidden)
│       ├── NumberNinja.tsx         # Number Ninja — math blitz (hidden)
│       │
│       ├── CatchTheBug.tsx         # Roaming bug easter egg (70/30 overlay/toast)
│       ├── CursorTrail.tsx         # 5 cursor effects (canvas RAF)
│       ├── CursorSpotlight.tsx     # Radial spotlight following cursor
│       ├── KonamiEasterEgg.tsx     # ↑↑↓↓←→←→BA easter egg
│       ├── AccentPicker.tsx        # 6 accent colour presets
│       ├── ShortcutsOverlay.tsx    # ? keyboard shortcuts panel
│       └── ...
│   └── ui/
│       ├── Brand.tsx               # JAY·dev logo mark with shimmer underline
│       └── ...                     # shadcn/ui primitives
├── hooks/
│   ├── use-accent.ts
│   ├── use-active-section.tsx      # IntersectionObserver — watches all section IDs
│   ├── use-count-up.ts
│   ├── use-scroll-progress.ts
│   └── use-theme.tsx
├── lib/
│   ├── accent-colors.ts
│   ├── resume-data.ts              # Work experience, education, skills
│   ├── site-config.ts              # Single source of truth — all personal info + feature flags
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

All personal info and feature flags live in **`lib/site-config.ts`**.

### Personal info

```ts
fullName:        "Jay Patel",
email:           "...",
github:          "...",
githubUsername:  "jaypatel364",
linkedin:        "...",
location:        "Ahmedabad, India",
resumeUrl:       "...",
bookingUrl:      "...",
careerStartDate: "2022-12",   // drives the experience label everywhere
headlineWords:   ["clean UIs", "scalable apps", ...],
```

### Feature flags

```ts
// Sections
showTerminalHero:  true,   // interactive zsh terminal in Hero
showLoadingScreen: true,   // cinematic boot sequence (once per session)
showFAQ:           true,   // FAQ section + nav link

// Game Zone hub
showGameZone:      true,   // entire hub on/off

// Individual games (only matter when showGameZone is true)
showBrainGame:     true,
showCodeBreaker:   true,
showTypingTest:    true,
showReactionTest:  true,
showEmojiMemory:   true,
showColorMatch:    true,
showDotCollector:  true,
showVibeCheck:     true,
showGravityOrbs:   true,
showPixelDraw:     true,
showWordScramble:  true,
showStackBuild:    false,  // hidden
showNumberNinja:   false,  // hidden

// Easter eggs & effects
showCatchTheBug:   true,
cursorEffect:      "magnetic",  // "none" | "particles" | "ripple" | "magnetic" | "lightning" | "pixelate"
```

### Adding a new game

1. Build your game component in `components/portfolio/YourGame.tsx` — export a `YourGame({ onClose })` function
2. Add a flag to `lib/site-config.ts`: `showYourGame: true`
3. Add an entry to the `GAMES` array in `GameZone.tsx`
4. Add the modal to the `AnimatePresence` block in `GameZoneHub`

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
- **Persona / facts** — edit `SYSTEM_PROMPT` in the same file

### Updating the loading screen

Edit `BOOT_LINES` in `components/portfolio/LoadingScreen.tsx`:

```ts
{ text: "Loading React · Next.js · TypeScript", preDelay: 140, suffix: "✓", speed: 22 }
```

### Updating Brain Game facts

Edit `SKILL_NODES` in `components/portfolio/BrainGame.tsx` — each node has `id`, `label`, `Icon`, `color`, and `fact`.

### Cursor effect

```ts
// lib/site-config.ts
cursorEffect: "lightning",
```

Change to any of: `"none"` `"particles"` `"ripple"` `"magnetic"` `"lightning"` `"pixelate"`

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
