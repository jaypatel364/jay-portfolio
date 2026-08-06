// ── Explicit types for optional callout fields ────────────────────────────────

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

  // ── Daily stack marquee ───────────────────────────────────────────────────
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
};

export type SiteConfig = typeof siteConfig;
