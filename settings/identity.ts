/**
 * Identity — who you are, where you are, how to reach you.
 * Edit this when personal details or links change.
 */

import type { ProfileLink } from "./types";

export const identity = {
  name: "Jay",
  fullName: "Jay Patel",
  title: "Jay.dev",
  description:
    "Full-stack developer in India. React, Next.js, and Node.js — real-time apps, form platforms, and production MERN products.",

  email: "pjay99909@gmail.com",
  /** E.164 or readable format — shown on contact page when set. */
  phone: null as string | null,
  github: "https://github.com/jaypatel364",
  githubUsername: "jaypatel364",
  linkedin: "https://www.linkedin.com/in/jaypatelfullstack",

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
      tagline: "Professional network & recommendations",
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/jaypatel364",
      tagline: "Open source & project code",
    },
    {
      id: "upwork",
      label: "Upwork",
      href: null,
      tagline: "Freelance MERN projects",
    },
    {
      id: "freelancer",
      label: "Freelancer",
      href: null,
      tagline: "Fixed-price & hourly builds",
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
  projectCount: 5,

  /**
   * Profile photo — path from site root (NOT /public/…).
   * File lives at public/images/jay-patel.png → use "/images/jay-patel.png"
   * null = styled placeholder until you add a real photo.
   */
  // profileImage: "/images/jay-patel.png",
  profileImage: null as string | null,
} as const;
