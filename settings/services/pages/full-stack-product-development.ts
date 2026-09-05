import type { Service } from "@/lib/services/types";
import { SERVICE_CONSULTATION_CTA } from "../shared";

export const fullStackProductDevelopment: Service = {
  slug: "full-stack-development",
  title: "Full-Stack Development",
  shortDescription:
    "End-to-end web product development across frontend, backend, databases, APIs, integrations, and deployment.",
  cardCapabilities: [
    "Product architecture & planning",
    "React / Next.js frontends",
    "Node.js APIs & data layers",
    "Auth, integrations & DevOps",
  ],
  categoryLabels: ["React", "Next.js", "Node.js", "TypeScript"],
  icon: "layout",
  order: 1,
  seoBrief: {
    primaryKeyword: "full stack development services",
    searchIntent: "Commercial — hiring a developer or team for end-to-end product builds",
    secondaryKeywords: [
      "full stack web developer",
      "React Node.js development",
      "full stack web application development",
      "full stack software development",
    ],
    longTailQuestions: [
      "What does full stack product development include?",
      "How long does it take to build a full stack web application?",
      "What is the best stack for a new web product?",
      "Should I hire a full stack developer for my MVP?",
    ],
    relatedEntities: [
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "REST API",
      "authentication",
      "CI/CD",
      "MVP",
      "SaaS",
    ],
    conversionIntent: "Book a consultation to scope a full product build",
  },
  hero: {
    heading: "Full Stack Development Services",
    headlineLines: ["Build complete products", "without fragile", "handoffs between layers."],
    description:
      "I build complete web products — user-facing interfaces, application logic, APIs, data models, third-party integrations, and deployment pipelines — so your team gets working software, not a collection of disconnected pieces.",
    primaryCta: { label: "Discuss your product", href: "/contact/" },
    secondaryCta: SERVICE_CONSULTATION_CTA,
    trustIndicators: [
      "Production MERN & TypeScript builds",
      "Real-time & form-heavy platforms shipped",
    ],
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "MongoDB"],
  },
  editorialIntro: {
    statement:
      "Full-stack product development is not a buzzword — it is ownership across every layer that affects what users experience and what your team can maintain next quarter.",
    supporting:
      "When frontend, backend, data, and deployment are designed together, you avoid the slow drift that happens when separate vendors optimize locally and break the system globally.",
    pullQuote: "Ship vertical slices, not disconnected decks.",
  },
  whatWeBuild: [
    "Production web applications",
    "Customer-facing dashboards",
    "Admin & operations tooling",
    "REST & GraphQL APIs",
    "Auth & role systems",
    "Database architectures",
    "Third-party integrations",
    "CI/CD pipelines",
  ],
  industries: ["SaaS & Technology", "Professional Services", "E-commerce", "Education"],
  overview:
    "Full-stack product development means owning the product across every technical layer that affects what users experience and what your team can maintain afterward. That includes frontend architecture, backend services, database design, authentication, integrations with payment or identity providers, and the deployment setup that keeps releases predictable.\n\nMost product teams do not need a large agency roster — they need one engineer who can translate requirements into a coherent system, make pragmatic trade-offs, and ship incrementally without accumulating fragile shortcuts. That is the work I focus on: turning product goals into production-ready applications that your team can extend after launch.",
  whatWeDo: {
    heading: "Full stack web development with React and Node.js",
    paragraphs: [
      "When I take on a full-stack product engagement, I work from defined product requirements through working software in production. That usually starts with clarifying scope: who uses the product, what workflows matter on day one, and which parts can wait for a later release. From there I design the technical architecture — how the frontend talks to APIs, how data is modeled, where authentication lives, and what infrastructure fits the expected load.",
      "Development happens in vertical slices rather than long frontend-only or backend-only phases. A typical slice might include a user flow in the interface, the API endpoints it depends on, persistence, validation, and basic tests. This keeps feedback loops short and reduces the risk of discovering integration problems late in the project.",
      "Full-stack product development is a strong fit when you have a product vision but lack engineering capacity to execute across layers, when an existing MVP needs to evolve into a maintainable platform, or when a fragmented codebase needs someone who can work across frontend and backend without handoffs slowing every decision.",
    ],
  },
  capabilities: [
    {
      title: "Frontend development",
      description:
        "Responsive interfaces with React and Next.js — component structure, routing, forms, client and server rendering patterns, and accessibility fundamentals.",
      relatedServiceSlug: "frontend-development",
    },
    {
      title: "Backend development",
      description:
        "Node.js services with clear API contracts, validation, error handling, and business logic that stays testable as features grow.",
      relatedServiceSlug: "backend-development",
    },
    {
      title: "API design",
      description:
        "REST (and GraphQL where appropriate) endpoints documented clearly enough that frontend and future integrations do not depend on tribal knowledge.",
      relatedServiceSlug: "backend-development",
    },
    {
      title: "Database architecture",
      description:
        "Schema design in PostgreSQL or MongoDB matched to query patterns, reporting needs, and the product’s consistency requirements.",
    },
    {
      title: "Third-party integrations",
      description:
        "Payments, email, webhooks, CRM, analytics, and other external services wired with retries, idempotency, and logging where failures would affect revenue or trust.",
    },
    {
      title: "Cloud infrastructure & DevOps",
      description:
        "Hosting on Vercel, AWS, or similar platforms with environment separation, secrets management, and CI/CD that makes releases repeatable.",
    },
    {
      title: "Testing",
      description:
        "Targeted unit and integration tests on critical paths — auth, payments, data mutations — rather than coverage metrics that do not reflect risk.",
    },
    {
      title: "Performance & security review",
      description:
        "Baseline checks on Core Web Vitals, query efficiency, and common security gaps before launch.",
      relatedServiceSlug: "performance-optimization",
    },
    {
      title: "Monitoring & deployment",
      description:
        "Error tracking, health checks, and deployment runbooks so the first production issue does not become a blind panic.",
    },
  ],
  problems: [
    {
      title: "Fragmented vendors or handoffs",
      description:
        "Separate frontend and backend teams often slow decisions and produce mismatched contracts. Full-stack ownership keeps the product coherent.",
    },
    {
      title: "MVP code that cannot scale",
      description:
        "Early shortcuts in data modeling or API design become expensive later. I refactor toward maintainable patterns as the product proves traction.",
    },
    {
      title: "Missing engineering capacity",
      description:
        "Founders and product managers with a clear roadmap but no senior engineer to execute across layers.",
    },
    {
      title: "Legacy application limitations",
      description:
        "Older stacks that block new features or make every release risky — incremental modernization without a full rewrite when possible.",
    },
    {
      title: "Difficult integrations",
      description:
        "Products that need reliable connections to payments, identity verification, or partner APIs without brittle one-off scripts.",
    },
    {
      title: "Unclear technical direction",
      description:
        "Teams stuck choosing stacks or architecture patterns — I help pick approaches that match timeline, team skills, and product constraints.",
    },
  ],
  process: [
    {
      title: "Discovery & requirements",
      description:
        "Map users, core workflows, constraints, and success criteria. Identify what belongs in v1 versus later phases.",
    },
    {
      title: "Technical planning",
      description:
        "Choose stack, define milestones, and document assumptions about traffic, roles, and integrations.",
    },
    {
      title: "Architecture",
      description:
        "Data models, API boundaries, auth model, and deployment topology — enough structure to build in parallel slices.",
    },
    {
      title: "UX/UI collaboration",
      description:
        "Implement from your designs or wireframes; flag feasibility issues early when interaction complexity affects backend work.",
    },
    {
      title: "Iterative development",
      description:
        "Ship vertical features with reviews at each milestone. Keep staging environments aligned with production configuration.",
    },
    {
      title: "Testing & hardening",
      description:
        "Exercise critical flows, fix edge cases, and add automated checks where regressions would be costly.",
    },
    {
      title: "Performance & security review",
      description:
        "Tune slow queries and rendering paths; address auth, input validation, and dependency risks before launch.",
    },
    {
      title: "Deployment & handoff",
      description:
        "Production deploy, documentation, and walkthrough so your team understands how to operate and extend the system — with optional post-launch support for bugs and monitoring.",
    },
  ],
  technologies: [
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "Express.js", "NestJS", "REST", "GraphQL"] },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] },
    { category: "Cloud & DevOps", items: ["Vercel", "AWS", "Docker", "GitHub Actions", "CI/CD"] },
  ],
  useCases: [
    {
      title: "SaaS products",
      description:
        "Multi-tenant or single-tenant SaaS with billing hooks, admin tools, and user-facing dashboards.",
    },
    {
      title: "B2B platforms",
      description:
        "Internal or customer portals with role-based workflows, approvals, and reporting.",
    },
    {
      title: "Marketplace platforms",
      description: "Two-sided flows with listings, transactions, and moderation tooling.",
    },
    {
      title: "Customer portals",
      description:
        "Self-service accounts, document uploads, and status tracking tied to backend operations.",
    },
    {
      title: "AI-powered applications",
      description:
        "Products that wrap LLM or automation APIs with sensible UX, rate limits, and audit trails.",
    },
    {
      title: "Internal operations tools",
      description:
        "Admin dashboards and workflow systems that replace spreadsheets with role-aware, auditable software.",
    },
  ],
  audiences: [
    {
      title: "Startups",
      description:
        "Teams validating product-market fit who need a senior engineer to ship v1 without overbuilding.",
    },
    {
      title: "SaaS companies",
      description:
        "Growing products that need new modules, billing integrations, or platform hardening.",
    },
    {
      title: "Agencies & product studios",
      description:
        "Partners who need reliable full-stack capacity on client builds with clear communication.",
    },
    {
      title: "Enterprises modernizing legacy apps",
      description:
        "Incremental migration from monoliths or outdated stacks toward API-first, component-based frontends.",
    },
  ],
  deliverables: [
    {
      title: "Technical architecture",
      description: "Documented stack, data model, and integration map.",
    },
    {
      title: "Production-ready application",
      description: "Deployed frontend and backend with environment configuration.",
    },
    {
      title: "API layer",
      description: "Versioned endpoints with validation and error conventions.",
    },
    { title: "Database schema", description: "Migrations or seed scripts where applicable." },
    { title: "Automated tests", description: "Tests on high-risk paths agreed during planning." },
    { title: "CI/CD pipeline", description: "Repeatable build, test, and deploy workflow." },
    {
      title: "Documentation",
      description: "Setup, deployment, and extension notes for your team.",
    },
    { title: "Monitoring hooks", description: "Error tracking and basic health checks." },
  ],
  benefits: [
    {
      title: "Faster time to market",
      description:
        "One owner across layers reduces coordination overhead and keeps milestones realistic.",
    },
    {
      title: "Coherent architecture",
      description:
        "Frontend, API, and data layers designed together — fewer surprise refactors mid-project.",
    },
    {
      title: "Easier maintainability",
      description:
        "Readable code, consistent patterns, and documentation that outlive the initial build.",
    },
    {
      title: "Lower integration risk",
      description:
        "Third-party services wired with proper error handling instead of last-minute glue code.",
    },
    {
      title: "Better scalability path",
      description: "Foundations that support more users and features without immediate rewrites.",
    },
  ],
  caseStudySlugs: [
    "real-time-chat-application",
    "pms-hr-management-system",
    "minilist-headless-cms",
    "spendly-personal-expense-tracker",
  ],
  faqs: [
    {
      question: "What does full-stack product development include?",
      answer:
        "It covers the full technical surface area of a web product: frontend UI, backend services, databases, authentication, integrations, testing, deployment, and the documentation needed to operate the system. The exact scope is defined during discovery so you pay for what the product actually needs.",
    },
    {
      question: "How long does a full-stack product take to build?",
      answer:
        "Timeline depends on scope. A focused MVP with a handful of core workflows might take several weeks to a few months. Larger platforms with multiple roles, integrations, and compliance needs take longer. I provide milestone-based estimates after requirements are clear rather than a single vague number upfront.",
    },
    {
      question: "What technology stack do you use for full-stack products?",
      answer:
        "Most often React or Next.js on the frontend with Node.js APIs and PostgreSQL or MongoDB for data. The stack is chosen based on your team’s skills, hosting constraints, and product requirements — not a fixed template applied to every project.",
    },
    {
      question: "Can you work with an existing codebase?",
      answer:
        "Yes. Many engagements start with an MVP or inherited codebase that needs refactoring, new features, or production hardening. I assess architecture and test coverage before committing to a roadmap.",
    },
    {
      question: "Do you provide design services?",
      answer:
        "I implement from your designs or collaborate with your designer. I can suggest UX improvements when technical constraints or accessibility issues appear, but visual design is usually provided by your team or a design partner.",
    },
    {
      question: "How do you handle ongoing work after launch?",
      answer:
        "Post-launch support can be arranged for bug fixes, monitoring, and incremental features. Handoff documentation and code structure are designed so your in-house team can take over when ready.",
    },
    {
      question: "Is full-stack development the same as hiring a dev agency?",
      answer:
        "The scope can overlap, but this is senior individual contributor work with direct communication — not a large account team. It suits products that need deep technical ownership rather than a broad marketing and design agency roster.",
    },
  ],
  relatedServiceSlugs: [
    "saas-development",
    "mvp-development",
    "backend-development",
    "frontend-development",
  ],
  relatedPosts: [
    {
      title: "How to Choose a Tech Stack for a New Web Product",
      slug: "choosing-tech-stack-web-product",
      description: "Practical criteria for stack decisions beyond hype cycles.",
    },
    {
      title: "MVP vs Full Product: What to Build First",
      slug: "mvp-vs-full-product",
      description: "Scoping trade-offs before committing engineering time.",
    },
  ],
  seo: {
    title: "Full-Stack Development Services | React & Node.js | Jay Patel",
    description:
      "End-to-end full-stack product development with React, Next.js, Node.js, and TypeScript — architecture, APIs, databases, integrations, and deployment for startups and product teams.",
    focusKeyword: "full stack development services",
    keywords: [
      "full stack development services",
      "full stack web developer",
      "React Node.js development",
      "full stack web application development",
      "hire full stack developer",
    ],
  },
  updatedAt: "2026-08-27",
};
