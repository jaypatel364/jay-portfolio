import type { Service } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA } from "../shared";

export const apiBackendEngineering: Service = {
  slug: "backend-development",
  title: "Backend Development",
  shortDescription:
    "Backend development services with Node.js development, REST API development, and scalable backend development for web and mobile products.",
  cardCapabilities: ["Node.js Development", "REST API Development", "Scalable Backend Development"],
  categoryLabels: ["Node.js", "API", "PostgreSQL", "Redis"],
  icon: "server",
  order: 4,
  published: true,
  seoBrief: {
    primaryKeyword: "backend development",
    searchIntent: "Commercial: teams needing backend/API engineering",
    secondaryKeywords: [
      "backend development services",
      "backend developer",
      "backend web development",
      "hire backend developer",
      "freelance backend developer",
      "custom backend development",
      "server-side development",
      "scalable backend development",
      "backend engineering services",
      "Node.js development",
      "Node.js development services",
      "Node.js developer",
      "Node.js backend development",
      "Node.js API development",
      "Express.js development",
      "REST API development",
      "GraphQL development",
      "API development",
      "PostgreSQL development",
      "MongoDB development",
      "backend architecture",
    ],
    longTailQuestions: [
      "How do you design a scalable REST API?",
      "REST vs GraphQL for my product?",
      "How do you secure a backend API?",
      "Can you refactor an existing backend?",
    ],
    relatedEntities: [
      "REST",
      "GraphQL",
      "OpenAPI",
      "JWT",
      "PostgreSQL",
      "Redis",
      "webhooks",
      "rate limiting",
      "microservices",
    ],
    conversionIntent: "Discuss backend/API requirements",
  },
  hero: {
    heading: "Backend Development Services",
    headlineLines: ["APIs your frontend,", "mobile clients, and", "partners can rely on."],
    description:
      "Backend development services for products that need stable APIs and clean data layers: Node.js development, REST API development, and server-side development your frontend and partners can depend on.",
    primaryCta: { label: "Hire a backend developer", href: "/contact/" },
    secondaryCta: SERVICE_CONTACT_CTA,
    trustIndicators: ["Social API & real-time backends shipped", "Production Node.js services"],
    technologies: ["Node.js", "Express.js", "PostgreSQL", "MongoDB", "Redis", "GraphQL"],
  },
  editorialIntro: {
    statement:
      "Backend development is where your product rules live: who can access what, how data stays correct, and how integrations fail without breaking trust.",
    supporting:
      "Weak backend development shows up as frontend bugs and partner integrations nobody wants to touch. Strong backend engineering services make every client faster to ship.",
    pullQuote: "Document the API before you scale the team.",
  },
  whatWeBuild: [
    "REST & GraphQL APIs",
    "Authentication services",
    "Webhook processors",
    "Background job systems",
    "Database layers",
    "Partner integration endpoints",
    "Real-time backends",
    "API documentation",
  ],
  industries: ["SaaS & Technology", "FinTech", "Logistics", "Marketplaces"],
  overview:
    "Backend development services for products that depend on stable APIs and data. I deliver Node.js development, REST API development, and scalable backend development, from Express.js development and PostgreSQL development to authentication development your frontend and partners can trust.",
  whatWeDo: {
    heading: "Backend development services with Node.js and APIs",
    paragraphs: [
      "Backend development starts with who calls your API and what they need from it. As a backend developer and Node.js developer, I design server-side development that fits web apps, mobile clients, and partner tools. My backend development services cover REST API development, GraphQL development, database development, and real-time backend development when your product needs live updates.",
      "Node.js development is at the core of most engagements, Node.js backend development, Node.js API development, and Node.js web development with Express.js development or NestJS development. I also handle PostgreSQL development, MongoDB development, Prisma development, authentication development, and authorization development so permissions stay consistent across routes.",
      "Hire a backend developer when your frontend team is blocked on API work, when you need a freelance backend developer for a greenfield service, or when an existing backend needs senior ownership. Whether you search for a backend development company or a Node.js developer for hire, you get documented contracts, tested paths, and scalable APIs built for production load.",
    ],
  },
  capabilities: [
    {
      title: "Node.js development services",
      description:
        "Node.js development and Node.js web development with clear module boundaries, error handling, and deployment setup.",
    },
    {
      title: "Node.js API development & REST API development",
      description:
        "REST API development with pagination, filtering, versioning, and docs your frontend team can follow.",
    },
    {
      title: "Express.js & NestJS development",
      description:
        "Express.js development for speed, NestJS development when structure and DI help larger teams.",
    },
    {
      title: "GraphQL development & API development",
      description:
        "GraphQL development and API development when clients need flexible queries and you can invest in performance monitoring.",
    },
    {
      title: "Database development",
      description:
        "PostgreSQL development, MongoDB development, and Prisma development with indexes matched to real query patterns.",
    },
    {
      title: "Authentication & authorization development",
      description:
        "Authentication development and authorization development with JWT, OAuth, API keys, and role checks on sensitive routes.",
    },
    {
      title: "Caching & performance",
      description:
        "Redis caching, query tuning, and connection pooling where metrics show benefit.",
      relatedServiceSlug: "performance-optimization",
    },
    {
      title: "Real-time backends",
      description: "WebSockets or SSE for chat, notifications, and live dashboards.",
    },
    {
      title: "Testing & observability",
      description:
        "Integration tests on API contracts, structured logs, and tracing hooks for production debugging.",
    },
  ],
  problems: [
    {
      title: "Undocumented APIs",
      description: "Frontends guessing field meanings and error codes, slowing every release.",
    },
    {
      title: "N+1 queries and slow endpoints",
      description: "Endpoints that work in dev but timeout when data grows.",
    },
    {
      title: "Fragile integrations",
      description:
        "Payment or CRM sync failing silently because webhooks were bolted on without idempotency.",
    },
    {
      title: "Auth logic scattered everywhere",
      description: "Permission checks copy-pasted across routes instead of centralized policy.",
    },
    {
      title: "Monolith tangled beyond safe change",
      description: "Teams afraid to ship because regression risk is unknown.",
    },
    {
      title: "Missing backend capacity",
      description: "Strong frontend team blocked waiting for API work.",
    },
  ],
  process: [
    {
      title: "API consumer analysis",
      description:
        "Identify web, mobile, partner, and internal clients plus their latency and consistency needs.",
    },
    {
      title: "Contract design",
      description:
        "Draft endpoints, payloads, error shapes, and auth requirements before heavy coding.",
    },
    {
      title: "Data layer implementation",
      description:
        "Migrations, repositories, and transaction boundaries aligned with business rules.",
    },
    {
      title: "Endpoint delivery in slices",
      description: "Ship complete vertical API features with integration tests per slice.",
    },
    {
      title: "Integration hardening",
      description: "Exercise third-party failure modes and add circuit breakers where needed.",
    },
    {
      title: "Performance profiling",
      description: "Load critical paths, add indexes or caching based on evidence.",
    },
    {
      title: "Security & auth review",
      description:
        "Validate tokens, scopes, rate limits, and input handling on sensitive routes before release.",
    },
    {
      title: "Documentation & handoff",
      description: "Publish API docs, runbooks, and onboarding notes for client teams.",
    },
  ],
  technologies: [
    { category: "Runtime & frameworks", items: ["Node.js", "Express.js", "NestJS", "Fastify"] },
    { category: "API styles", items: ["REST", "GraphQL", "WebSockets", "SSE"] },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] },
    { category: "Tooling", items: ["Zod", "OpenAPI", "Prisma", "Drizzle", "BullMQ"] },
    { category: "Infrastructure", items: ["Docker", "AWS", "Railway", "GitHub Actions"] },
  ],
  useCases: [
    {
      title: "Mobile app backends",
      description:
        "Stable JSON APIs with auth refresh flows and pagination tuned for cellular networks.",
    },
    {
      title: "B2B partner integrations",
      description: "API keys, webhooks, and sandbox environments for external developers.",
    },
    {
      title: "Headless CMS & content APIs",
      description: "Structured content delivery to marketing sites and apps.",
    },
    {
      title: "Fintech & payments",
      description:
        "Ledger-like operations with strict validation, paired with compliance review when required.",
    },
    {
      title: "Real-time collaboration",
      description:
        "Presence, messaging, and live updates backed by WebSockets and durable storage.",
    },
    {
      title: "Event-driven services",
      description:
        "Background jobs, webhooks, and queue workers that keep product flows reliable under load.",
    },
  ],
  audiences: [
    {
      title: "Frontend-heavy teams",
      description: "Teams that need a backend specialist without hiring full-time immediately.",
    },
    {
      title: "SaaS platforms",
      description: "Products exposing APIs to customers or building integration marketplaces.",
    },
    {
      title: "Agencies",
      description: "Delivery partners needing senior Node.js API work on client projects.",
    },
    {
      title: "CTOs modernizing legacy APIs",
      description:
        "Leaders replacing PHP or monolithic endpoints with documented Node services incrementally.",
    },
  ],
  deliverables: [
    { title: "API specification", description: "Endpoints, schemas, auth, and error conventions." },
    {
      title: "Implemented backend service",
      description: "Deployed code with environment configuration.",
    },
    { title: "Database migrations", description: "Versioned schema history." },
    { title: "Integration modules", description: "Third-party connectors as scoped." },
    { title: "Automated API tests", description: "Contract tests on critical routes." },
    {
      title: "Operational logging",
      description: "Structured logs and error reporting integration.",
    },
  ],
  benefits: [
    {
      kind: "benefit",
      title: "Predictable client integrations",
      description: "Frontends and partners integrate once against stable contracts.",
    },
    {
      kind: "benefit",
      title: "Easier hiring and onboarding",
      description: "Documented APIs help the next backend hire contribute faster.",
    },
    {
      kind: "benefit",
      title: "Security baseline",
      description: "Auth and input handling addressed systematically, not per endpoint.",
    },
    {
      kind: "outcome",
      title: "Fewer production incidents",
      description: "Validation, idempotency, and logging reduce mystery outages.",
    },
    {
      kind: "outcome",
      title: "Performance headroom",
      description: "Indexes and caching applied where measurements justify them.",
    },
    {
      kind: "outcome",
      title: "Faster partner integrations",
      description:
        "Consistent API patterns and versioning reduce time-to-ship for new client surfaces.",
    },
  ],
  whyHire: {
    roleTitle: "Backend Developer",
    intro:
      "You get a backend developer and Node.js developer who ships documented APIs, solid database development, and backend architecture your team can extend, with observability when production issues appear.",
    reasons: [
      {
        tag: "Contracts",
        title: "APIs teams can trust",
        description:
          "Documented endpoints with consistent validation, error shapes, and versioning, so frontend and partner integrations do not depend on tribal knowledge.",
      },
      {
        tag: "Reliability",
        title: "Production-grade patterns",
        description:
          "Auth, idempotency, retries, and webhook handling where revenue and trust depend on systems behaving correctly under failure.",
      },
      {
        tag: "Observability",
        title: "Diagnosable in production",
        description:
          "Structured logging, error tracking, and health checks so the first incident is fixable in hours, not days of blind debugging.",
      },
      {
        tag: "Data",
        title: "Schema matched to access patterns",
        description:
          "PostgreSQL or MongoDB designed for how your product actually queries and reports, not a generic template that breaks under load.",
      },
    ],
    highlights: [
      { label: "Stack", value: "Node.js · Express · NestJS · PostgreSQL" },
      { label: "Focus", value: "REST, GraphQL & real-time APIs" },
      { label: "Approach", value: "Documented contracts, tested paths" },
    ],
  },
  caseStudySlugs: [
    "social-media-backend-api",
    "real-time-chat-application",
    "verify-360-kyc-platform",
  ],
  faqs: [
    {
      question: "What is backend development?",
      answer:
        "Backend development is building the server-side parts of a web product, APIs, databases, auth, background jobs, and integrations. A backend developer writes the code that stores data and enforces business rules.",
    },
    {
      question: "What do backend development services include?",
      answer:
        "They include API design, Node.js development, database development, authentication development, webhooks, testing, deployment, and documentation. Exact scope depends on greenfield vs existing codebase work.",
    },
    {
      question: "How do I hire a Node.js developer?",
      answer:
        "Share your API consumers, data model, and timeline. I scope Node.js development services in milestones with staging endpoints early so frontend work is not blocked.",
    },
    {
      question: "REST or GraphQL: which do you recommend?",
      answer:
        "REST API development is the default for most products. GraphQL development helps when many client types need different field sets. I recommend based on your clients and team, not trends.",
    },
    {
      question: "Do you build real-time backends?",
      answer:
        "Yes, WebSocket development and real-time backend development for chat, notifications, and live dashboards, with attention to connection scaling.",
    },
    {
      question: "Can you refactor an existing backend?",
      answer:
        "Yes. Typical work adds tests on critical paths, documents endpoints, fixes slow queries, and untangles auth logic before larger rewrites.",
    },
  ],
  relatedServiceSlugs: [
    "full-stack-development",
    "saas-development",
    "performance-optimization",
    "mvp-development",
  ],
  relatedPosts: [
    "nestjs-vs-express-js-2026",
    "rest-api-design-best-practices",
    "nodejs-backend-architecture",
    "webhook-integration-patterns",
  ],
  readTimeMinutes: 10,
  coverImage: {
    title: "Backend Development Services | Node.js APIs and Databases",
    alt: "Backend development diagram showing Node.js API gateway connected to PostgreSQL database and external integrations",
  },
  seo: {
    title: "Backend Development Services | Node.js, APIs & Databases",
    description:
      "Backend development services with Node.js, REST APIs, and databases. Hire a backend developer or Node.js developer for scalable backend development, API development, and server-side development.",
    focusKeyword: "backend development",
    keywords: [
      "backend development",
      "backend development services",
      "backend developer",
      "Node.js development",
      "Node.js developer",
      "REST API development",
      "hire backend developer",
      "scalable backend development",
      "Express.js development",
      "API development",
      "PostgreSQL development",
      "backend engineering services",
    ],
    ogTitle: "Backend Development Services | Node.js, APIs & Databases",
    ogDescription:
      "Hire a backend developer for Node.js development, REST API development, and database work. Backend development services for web and mobile products.",
  },
  updatedAt: "2026-09-07",
};
