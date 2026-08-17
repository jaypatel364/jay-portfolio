/**
 * Content — copy and static lists that power UI sections.
 * FAQ, headline words, marquee stack, learning badges, etc.
 */

import type { BuildingItem, FAQItem, LearningItem } from "./types";

export const content = {
  /** Words that cycle in the hero headline. Keep short (1–3 words). */
  headlineWords: ["clean UIs", "scalable apps", "robust APIs", "real products", "great UX"],

  /** How many skills to show per category in the Skills "All" grid. */
  skillPreviewCounts: {
    Frontend: 8,
    Backend: 8,
    "Tools & DevOps": 8,
  } as Record<string, number>,

  /** About section tech marquee. Comment out / empty to hide. */
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

  /** About "Currently building" badge. null = hidden. */
  currentlyBuilding: null as BuildingItem | null,

  /** About "What I'm learning" badge. [] = hidden. */
  currentlyLearning: [
    // { name: "Distributed systems", icon: "⚡" },
    // { name: "LLM integrations", icon: "🤖" },
  ] as LearningItem[],

  /** FAQ accordion items. category: "work" | "tech" | "personal" | "process" */
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
