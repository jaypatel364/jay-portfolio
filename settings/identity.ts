/**
 * Identity — who you are, where you are, how to reach you.
 * Edit this when personal details or links change.
 */

import type { ProfileLink } from "./types";

/** Set your Instagram profile URL to show the Contact badge (e.g. https://www.instagram.com/yourhandle). */
const instagram = "https://www.instagram.com/jaypateldev";

export const identity = {
  name: "Jay",
  fullName: "Jay Patel",
  title: "Jay.dev",
  description:
    "Full-stack developer in India building production web applications with React, Next.js, and Node.js, including real-time apps, workflow platforms, and MERN products.",
  email: "pjay99909@gmail.com",
  /** E.164 or readable format — shown on contact page when set. */
  phone: null as string | null,
  github: "https://github.com/jaypatel364",
  githubUsername: "jaypatel364",
  linkedin: "https://www.linkedin.com/in/jaypatelfullstack",
  twitter: "https://x.com/PatelPjay99909",
  twitterUsername: "PatelPjay99909",
  instagram,

  location: "India",

  /**
   * Verified profiles & freelance marketplaces — add href to show the badge.
   * Feeds contact page UI and Person JSON-LD sameAs.
   */
  profileLinks: [
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jaypatelfullstack",
      tagline: "Network",
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/jaypatel364",
      tagline: "Code",
    },
    {
      id: "twitter",
      label: "X",
      href: "https://x.com/PatelPjay99909",
      tagline: "Posts",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: instagram,
      tagline: "Photos",
    },
    {
      id: "upwork",
      label: "Upwork",
      href: null,
      tagline: "Freelance",
    },
    {
      id: "freelancer",
      label: "Freelancer",
      href: null,
      tagline: "Gigs",
    },
  ] as ProfileLink[],

  /**
   * Hosted PDF in `public/`. Replace that file to update the resume —
   * there is no separate resume page (opens in an on-site viewer).
   */
  resumeUrl: "/jay-patel-resume.pdf",
  resumeFileName: "Jay-Patel-Resume.pdf",
  bookingUrl: "https://calendly.com/jaypatel-dev",

  /** Format: "YYYY-MM" — drives the auto-calculated experience label everywhere. */
  careerStartDate: "2022-12",

  /** Stats shown on the Skills section. */
  projectCount: 7,

  /**
   * Profile photo — path from site root (NOT /public/…).
   * Square avatar: public/images/avatar.png (512) — favicon + OG.
   * Portrait: public/images/jay-patel.png — About section (higher detail).
   */
  profileImage: "/images/jay-patel.png",
} as const;
