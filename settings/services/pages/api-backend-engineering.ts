import type { Service } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA } from "../shared";

export const apiBackendEngineering: Service = {
  slug: "backend-development",
  title: "Backend Development",
  shortDescription:
    "Scalable API and backend engineering — REST, GraphQL, data modeling, auth, integrations, and reliable server-side systems.",
  cardCapabilities: [
    "REST & GraphQL API design",
    "Database modeling & queries",
    "Auth, webhooks & jobs",
    "Third-party integrations",
  ],
  categoryLabels: ["Node.js", "API", "PostgreSQL", "Redis"],
  icon: "server",
  order: 4,
  seoBrief: {
    primaryKeyword: "backend development services",
    searchIntent: "Commercial — teams needing backend/API engineering",
    secondaryKeywords: [
      "Node.js development",
      "API development",
      "API development services",
      "Node.js backend development",
      "REST API development",
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
      "I design and build backend systems and APIs that frontend teams, mobile apps, and partners can depend on — clear contracts, predictable error behavior, and data layers that stay maintainable as features accumulate.",
    primaryCta: { label: "Discuss your API", href: "/contact/" },
    secondaryCta: SERVICE_CONTACT_CTA,
    trustIndicators: ["Social API & real-time backends shipped", "Production Node.js services"],
    technologies: ["Node.js", "Express.js", "PostgreSQL", "MongoDB", "Redis", "GraphQL"],
  },
  editorialIntro: {
    statement:
      "Backend engineering is where product rules live — who can access what, how data stays consistent, and how integrations fail without silent corruption.",
    supporting:
      "Weak APIs show up as frontend bugs, midnight pages, and partner integrations nobody trusts. Strong backends make every client faster to ship.",
    pullQuote: "Contracts first. Implementation second.",
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
    "Backend engineering is where product rules live: who can access what, how money moves, how data stays consistent when two users act at once, and how external services sync without silent failures. Weak backends show up as frontend bugs, midnight pages, and integrations that nobody trusts.\n\nI work on greenfield APIs, extensions to existing services, and refactors of tangled codebases where every change breaks something unexpected. The output is not just endpoints — it is a coherent server-side architecture with logging, validation, migrations, and documentation your team can extend.",
  whatWeDo: {
    heading: "Node.js and API development",
    paragraphs: [
      "Backend engagements typically start from consumer needs: which clients call the API, what latency they tolerate, and what consistency guarantees matter when writes collide. Those answers drive choices between monolith modules, separate services, sync vs async processing, and SQL vs document storage.",
      "I implement HTTP APIs (REST by default, GraphQL when query flexibility or mobile bandwidth genuinely justify it), background workers, webhook receivers, and integration adapters. Cross-cutting concerns — authentication, authorization, rate limits, input validation, structured logging — are established early so feature work does not reinvent them.",
      "This service fits products where the frontend is handled elsewhere but backend quality is the bottleneck, mobile clients need stable APIs, partner integrations require documented contracts, or an existing Node.js backend needs senior ownership to regain velocity.",
    ],
  },
  capabilities: [
    {
      title: "REST API design",
      description:
        "Resource-oriented routes, pagination, filtering, versioning, and OpenAPI-style documentation.",
    },
    {
      title: "GraphQL APIs",
      description:
        "Schema design, resolvers, and performance guardrails when clients need flexible queries.",
    },
    {
      title: "Database modeling",
      description:
        "Normalized schemas, indexes, and migration strategies in PostgreSQL or MongoDB.",
    },
    {
      title: "Authentication & authorization",
      description: "JWT, sessions, API keys, OAuth, and fine-grained permission checks.",
    },
    {
      title: "Third-party integrations",
      description:
        "Payment, email, CRM, and partner APIs with retries, idempotency keys, and dead-letter handling.",
    },
    {
      title: "Webhooks & event processing",
      description:
        "Inbound and outbound events with signature verification and replay-safe handlers.",
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
      description: "Frontends guessing field meanings and error codes — slowing every release.",
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
        "Ledger-like operations with strict validation — paired with compliance review when required.",
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
      title: "Predictable client integrations",
      description: "Frontends and partners integrate once against stable contracts.",
    },
    {
      title: "Fewer production incidents",
      description: "Validation, idempotency, and logging reduce mystery outages.",
    },
    {
      title: "Easier hiring and onboarding",
      description: "Documented APIs help the next backend hire contribute faster.",
    },
    {
      title: "Performance headroom",
      description: "Indexes and caching applied where measurements justify them.",
    },
    {
      title: "Security baseline",
      description: "Auth and input handling addressed systematically, not per endpoint.",
    },
  ],
  caseStudySlugs: [
    "social-media-backend-api",
    "real-time-chat-application",
    "verify-360-kyc-platform",
  ],
  faqs: [
    {
      question: "REST or GraphQL — which do you recommend?",
      answer:
        "REST is the default for most products — simpler caching, tooling, and onboarding. GraphQL helps when many client types need different field sets and you can invest in performance monitoring. I recommend based on client diversity and team familiarity, not ideology.",
    },
    {
      question: "Can you work alongside our frontend team?",
      answer:
        "Yes. I agree on API contracts upfront, deliver staging endpoints early, and maintain changelogs so frontend work is not blocked.",
    },
    {
      question: "Do you refactor existing backends?",
      answer:
        "Yes. Typical work includes extracting modules, adding tests on critical paths, documenting endpoints, and fixing the worst performance bottlenecks before larger rewrites.",
    },
    {
      question: "How do you secure APIs?",
      answer:
        "HTTPS, validated inputs, parameterized queries, least-privilege auth, rate limiting on sensitive routes, secrets in environment stores, and webhook signature verification. Threat modeling scales with data sensitivity.",
    },
    {
      question: "Can you build real-time features?",
      answer:
        "Yes — WebSockets or SSE for chat, notifications, and live updates, with attention to connection scaling and fallback behavior.",
    },
    {
      question: "What does API documentation include?",
      answer:
        "Endpoint list, request/response examples, auth instructions, error codes, and webhook payloads. Format depends on your toolchain — OpenAPI, Markdown, or Postman collections.",
    },
  ],
  relatedServiceSlugs: [
    "full-stack-development",
    "saas-development",
    "performance-optimization",
    "mvp-development",
  ],
  relatedPosts: [
    { title: "REST API Design Best Practices", slug: "rest-api-design-best-practices" },
    { title: "Node.js Backend Architecture", slug: "nodejs-backend-architecture" },
    { title: "Webhook Integration Patterns", slug: "webhook-integration-patterns" },
  ],
  seo: {
    title: "Backend Development Services | Node.js & API Development | Jay Patel",
    description:
      "API and backend engineering with Node.js — REST, GraphQL, databases, auth, webhooks, and integrations for web and mobile products.",
    focusKeyword: "backend development services",
    keywords: [
      "backend development services",
      "Node.js development",
      "API development",
      "REST API development",
      "Node.js backend development",
    ],
  },
  updatedAt: "2026-08-27",
};
