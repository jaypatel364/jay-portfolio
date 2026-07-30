export const siteConfig = {
  name: "Jay",
  title: "Jay.dev",
  description:
    "Full Stack Developer crafting performant, scalable web applications with the MERN stack.",

  // Contact & Social Links
  email: "pjay99909@gmail.com",
  github: "https://github.com/jaypatel364",
  linkedin: "https://www.linkedin.com/in/jaypatelfullstack",

  // Location
  location: "Ahmedabad, India",

  // Resume
  resumeUrl: "https://drive.google.com/file/d/1851jdeXSi_n8plN3oTTbjqzBwg0brHBI/view?usp=sharing",

  // Booking — replace with your actual Calendly / Cal.com link
  bookingUrl: "https://calendly.com/jaypatel-dev",

  // Career start date — used to auto-calculate experience label everywhere
  // Format: "YYYY-MM" (month when you started your first professional role)
  careerStartDate: "2022-12",

  // Stats shown on the Skills section and Hero
  projectCount: 10,

  // "Currently building" callout in About section.
  // Set to null to hide the badge entirely.
  currentlyBuilding: {
    name: "Jay.dev Portfolio",
    description: "Personal portfolio with modern animations & features",
    url: null as string | null, // set a URL to make it a link
  },

  // "What I'm learning" callout in About section.
  // List 1-3 items. Set to empty array [] to hide the badge.
  currentlyLearning: [
    { name: "Rust", icon: "🦀" },
    { name: "System Design", icon: "🏗️" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
