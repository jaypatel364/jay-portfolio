// ── Explicit types for optional callout fields ────────────────────────────────

export type FAQCategory = "work" | "tech" | "personal" | "process";

export interface FAQItem {
  category: FAQCategory;
  question: string;
  answer: string;
}

export interface BuildingItem {
  name: string;
  description: string;
  /** Set a URL to make the badge a clickable link. null = non-clickable. */
  url: string | null;
}

export interface LearningItem {
  name: string;
  icon: string;
}

// ── Site config ───────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "Jay",
  fullName: "Jay Patel",
  title: "Jay.dev",
  description:
    "Full Stack Developer crafting performant, scalable web applications with the MERN stack.",

  // Contact & Social Links
  email: "pjay99909@gmail.com",
  github: "https://github.com/jaypatel364",
  githubUsername: "jaypatel364",
  linkedin: "https://www.linkedin.com/in/jaypatelfullstack",

  // Location
  location: "Ahmedabad, India",

  // Resume
  resumeUrl: "https://drive.google.com/file/d/1851jdeXSi_n8plN3oTTbjqzBwg0brHBI/view?usp=sharing",

  // Booking — replace with your actual Calendly / Cal.com link
  bookingUrl: "https://calendly.com/jaypatel-dev",

  // Career start date — drives the auto-calculated experience label everywhere.
  // Format: "YYYY-MM"
  careerStartDate: "2022-12",

  // Stats shown on the Skills section
  projectCount: 5,

  // Words that cycle inside the headline: "Jay — I build [word] for the web."
  // Keep them short — 1-3 words max looks best.
  headlineWords: ["clean UIs", "scalable apps", "robust APIs", "real products", "great UX"],

  // ── Terminal hero block ───────────────────────────────────────────────────
  // Set to true to show a $ whoami terminal card below the headline in the
  // Hero section. Set to false (or comment the line out and it defaults false)
  // to keep the standard layout.
  showTerminalHero: true,

  // ── Loading screen ────────────────────────────────────────────────────────
  // Cinematic terminal boot sequence shown once per session before the site
  // reveals. Set to false to disable entirely (visitors land directly on hero).
  showLoadingScreen: true,

  // ── Game Zone ─────────────────────────────────────────────────────────────
  // The Game Zone hub is a single glowing trigger in the Skills section that
  // opens a beautiful game-picker modal listing all available mini-games.
  // Set to false to hide the entire hub (no button, no modal).
  showGameZone: true,

  // Individual game flags — only matter when showGameZone is true.
  // Set any to false to remove that game card from the hub.
  showBrainGame: true, // Jay's Brain — floating skill-node explorer
  showCodeBreaker: true, // Code Breaker — Simon Says reflex tile game
  showTypingTest: true, // Typing Speed Test — type Jay's real code snippets
  showReactionTest: true, // Reaction Time Test — flash and click, ms timer
  showEmojiMemory: true, // Emoji Memory Flip — 4×4 card matching game
  showColorMatch: true, // Color Match Blitz — match the swatch under pressure
  showStackBuild: false, // Stack & Build — hidden (replaced soon)
  showDotCollector: true, // Dot Collector — 30s click frenzy
  showNumberNinja: false, // Number Ninja — hidden (replaced soon)
  showWordScramble: true, // Word Scramble — unscramble the jumbled tech word
  showVibeCheck: true, // Vibe Check — dev personality quiz with shareable result
  showGravityOrbs: true, // Gravity Orbs — physics orbs attracted to your cursor
  showPixelDraw: true, // Pixel Draw Race — recreate pixel art in 20s

  // ── Catch the Bug easter egg ──────────────────────────────────────────────
  // A tiny animated bug randomly crawls across the screen every few minutes.
  // 70 % chance: a full immersive easter-egg overlay appears on squash.
  // 30 % chance: just a toast notification reward.
  // Set to false to disable entirely — the bug will never appear.
  showCatchTheBug: true,

  // ── Cursor Effect ─────────────────────────────────────────────────────────
  // Choose one cursor effect. Set to "none" to disable entirely.
  // Touch devices and prefers-reduced-motion are always auto-skipped.
  //
  //  "none"       — no cursor effect
  //  "particles"  — hue-cycling glow orbs that drift and fade behind the cursor
  //  "ripple"     — expanding ring ripples on every move (water drop feel)
  //  "magnetic"   — 9 orbital dots that elastically chase the cursor like planets
  //  "lightning"  — electric arc bolts shoot from cursor to nearby points
  //  "pixelate"   — falling colored square pixels dissolve behind the cursor
  //
  cursorEffect: "none" as import("@/components/portfolio/CursorTrail").CursorEffectMode,

  // ── Skills section — "All" grid preview counts ───────────────────────────
  // How many skills to show per category in the "All" grid view.
  // The sphere (individual category view) always shows every skill.
  // Increase any value to show more pills in the "All" tab.
  skillPreviewCounts: {
    Frontend: 8, // show first 8 of however many Frontend skills you add
    Backend: 8,
    "Tools & DevOps": 8,
  } as Record<string, number>,
  // Scrolling strip of tech icons shown at the bottom of the About section.
  // Comment out the entire dailyStack array to hide the marquee completely.
  dailyStack: [
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "TypeScript", icon: "🔷" },
    { name: "Node.js", icon: "🟢" },
    { name: "Express", icon: "🚂" },
    { name: "MongoDB", icon: "🍃" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Redis", icon: "🔴" },
    { name: "Docker", icon: "🐳" },
    { name: "AWS", icon: "☁️" },
    { name: "Tailwind", icon: "🌊" },
    { name: "Git", icon: "🌿" },
  ] as { name: string; icon: string }[],
  // "Currently building" badge in About section.
  // Set to null to hide it entirely.
  currentlyBuilding: null as BuildingItem | null,
  // Example:
  // currentlyBuilding: {
  //   name: "Jay.dev Portfolio",
  //   description: "Personal portfolio with modern animations & features",
  //   url: null,
  // },

  // "What I'm learning" badge in About section.
  // Set to [] to hide it entirely.
  currentlyLearning: [] as LearningItem[],
  // Example:
  // currentlyLearning: [
  //   { name: "Rust",          icon: "🦀" },
  //   { name: "System Design", icon: "🏗️" },
  // ],

  // ── SEO indexing ─────────────────────────────────────────────────────────
  // Set to false while you're still building / testing and don't want Google
  // to crawl the site yet. Flip to true when you go live on your real domain.
  // When false: <meta name="robots" content="noindex, nofollow"> is injected
  // and the X-Robots-Tag header blocks all bots. JSON-LD is still rendered
  // (harmless when noindex is set) but the page won't appear in search results.
  allowIndexing: false,

  // ── FAQ section ───────────────────────────────────────────────────────────
  // Set to false to hide the FAQ section everywhere:
  //   • The section itself vanishes from the page
  //   • The "FAQ" nav link disappears from Navbar (desktop + mobile)
  //   • The FAQ JSON-LD structured data is still generated for SEO (Google
  //     can read it even when the visual section is hidden)
  showFAQ: true,

  // FAQ items — edit, add, or remove freely.
  // category: groups questions with a shared colour accent in the UI.
  //   Supported values: "work" | "tech" | "personal" | "process"
  faqItems: [
    {
      category: "work" as const,
      question: "Are you currently available for new opportunities?",
      answer:
        "Yes — I'm actively open to full-time roles and select freelance projects. " +
        "I'm looking for product teams that care about code quality, performance, and great UX. " +
        "Feel free to reach out directly through the contact form or book a call.",
    },
    {
      category: "tech" as const,
      question: "What is your primary tech stack right now?",
      answer:
        "My daily driver is React + Next.js with TypeScript on the frontend, " +
        "Node.js + Express.js on the backend, and MongoDB or PostgreSQL as the data layer. " +
        "I also reach for Tailwind CSS, Redux/Zustand for state, Docker for containers, " +
        "and AWS/Vercel for deployments.",
    },
    {
      category: "process" as const,
      question: "How do you approach a new project from scratch?",
      answer:
        "I start by understanding the problem deeply before writing a single line of code — " +
        "requirements, users, constraints. Then I sketch the data model and API contract, " +
        "set up the project scaffold with CI/CD from day one, build in small vertical slices, " +
        "and iterate fast with regular feedback loops.",
    },
    {
      category: "work" as const,
      question: "Do you work remotely or on-site?",
      answer:
        "Primarily remote — I've been working in a distributed team setup since 2022 and " +
        "thrive in async environments. I'm based in Ahmedabad, India, and open to hybrid " +
        "arrangements for the right opportunity.",
    },
    {
      category: "tech" as const,
      question: "How do you keep your skills sharp and stay current?",
      answer:
        "I build side projects to explore new tools hands-on, follow release notes for " +
        "frameworks I use daily (Next.js, Node.js), and read engineering blogs from teams " +
        "at Vercel, Linear, and Shopify. I learn best by shipping something real.",
    },
    {
      category: "personal" as const,
      question: "What kind of work genuinely excites you?",
      answer:
        "Problems at the intersection of performance and UX — making something complex feel " +
        "effortless to the end user. I love building systems where the architecture is " +
        "invisible and the experience is delightful. Dynamic form systems, real-time features, " +
        "and developer tooling are all in my sweet spot.",
    },
    {
      category: "process" as const,
      question: "How do you handle tight deadlines and shifting requirements?",
      answer:
        "Scope clarity upfront saves more time than any tool. When requirements shift mid-sprint " +
        "I re-evaluate priority, communicate trade-offs clearly, and cut scope rather than quality. " +
        "I've led projects under pressure and learned that over-communication is never a mistake.",
    },
    {
      category: "personal" as const,
      question: "What's something about you that isn't on your resume?",
      answer:
        "I'm genuinely obsessed with tiny details — the kind most people never notice but " +
        "everyone subconsciously feels. I'll spend an afternoon getting a hover transition " +
        "to feel exactly right. Also, I once built an internal HR tool that saved my team " +
        "hours of manual work every week, and that quiet impact felt better than any feature launch.",
    },
  ] as FAQItem[],
};

export type SiteConfig = typeof siteConfig;
