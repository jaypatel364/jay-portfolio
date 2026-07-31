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
| Icons           | Lucide React                                                  |
| Fonts           | Space Grotesk (headings), Inter (body), JetBrains Mono (code) |
| Database        | MongoDB (contact form storage)                                |
| Email           | Nodemailer (SMTP contact notifications)                       |
| Toast           | Sonner                                                        |
| Command Palette | cmdk                                                          |
| PWA             | @ducanh2912/next-pwa                                          |
| Deployment      | Vercel                                                        |

---

## Features

### UI & Experience

- **Inline word-swap hero** — headline cycles through words with a slot-machine slide animation
- **Scroll progress bar** — spring-animated fill bar at the top of the page
- **Cursor spotlight** — radial gradient that follows the mouse with lerp smoothing (desktop only)
- **Page entrance animation** — staggered fade-in of navbar, content, and footer on load
- **Back to top button** — appears after 400px scroll with spring animation

### Navigation

- **Command palette** (`⌘K` / `Ctrl+K`) — search sections, toggle theme, change accent, open resume, navigate to social links
- **Keyboard shortcuts overlay** (`?`) — full shortcut reference modal
- **Global keyboard shortcuts** — `G+H/A/S/E/C` to jump sections, `T` to toggle theme
- **Scroll progress badge** — navbar shows current section name + page % after scrolling past the hero
- **Active section indicator** — spring-animated pill in both desktop and mobile nav

### Skills Section

- **Filter tabs** — All / Frontend / Backend / Tools with animated active pill
- **Animated stat counters** — numbers count up when the section scrolls into view
- **Dynamic experience label** — auto-calculated from `careerStartDate` in `siteConfig`, increments every 6 months

### Experience Section

- **View toggle** — switch between Cards and Timeline views with animated transitions
- **Timeline view** — alternating left/right layout with year markers and role chips

### About Section

- **Currently building badge** — driven from `siteConfig.currentlyBuilding`, hides when `null`
- **What I'm learning badge** — driven from `siteConfig.currentlyLearning`, hides when empty

### Contact Form

- **Dual-service architecture** — saves to MongoDB and sends SMTP email independently; both are optional and non-fatal
- **Confetti on success** — canvas-based particle burst using portfolio brand colors
- **Toast notifications** — success/error feedback via Sonner
- **Copy email** — click email address anywhere to copy to clipboard
- **Rate limiting** — in-memory per-IP limiter (3 requests/minute)
- **Honeypot** — bot detection field

### Personalization

- **Theme color picker** — 5 accent presets (Amber, Violet, Cyan, Emerald, Rose) stored in `localStorage`
- **Dark / light mode** — persists across sessions, respects `prefers-color-scheme`
- **Accent synced to resume page** — `ResumeThemeSync` applies saved theme + accent on the `/resume` route

### Easter Egg

- **Konami code** (`↑↑↓↓←→←→BA`) — triggers a full-screen matrix rain canvas overlay

### Resume Route (`/resume`)

- Standalone page with all data sourced from `lib/resume-data.ts`
- Accent + dark/light theme synced from `localStorage`
- "Download Full Resume" button links to Google Drive PDF

### Performance & Technical

- **PWA** — installable, offline-capable via service worker (production only)
- **`next/image`** — configured with remote patterns and avif/webp auto-format
- **Error boundaries** — each section wrapped in `SectionErrorBoundary`; a crash in one section never blanks the page
- **`robots.txt`** — allows all bots, blocks `/api/`
- **`sitemap.xml`** — dynamic Next.js route, uses `NEXT_PUBLIC_BASE_URL` env var

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
│   ├── portfolio/             # All page sections and feature components
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
  linkedin: "...",
  resumeUrl: "...",
  bookingUrl: "...",
  careerStartDate: "2022-12",   // drives experience label automatically
  projectCount: 10,
  headlineWords: ["fast apps", "clean UIs", ...],
  currentlyBuilding: { name: "...", description: "...", url: null },
  currentlyLearning: [{ name: "Rust", icon: "🦀" }],
};
```

Experience, education, and skills data lives in **`lib/resume-data.ts`** — shared between the portfolio sections and the `/resume` route.

To change the default accent color, update `DEFAULT_ACCENT_ID` in **`lib/accent-colors.ts`**.

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
