import type { ServiceEditorialIntro } from "@/lib/services/types";

/** Per-service editorial + build lists — merged at runtime into service documents. */
export const SERVICE_PAGE_EXTRAS: Record<
  string,
  {
    editorialIntro: ServiceEditorialIntro;
    whatWeBuild: string[];
    industries?: string[];
    headlineLines?: string[];
  }
> = {
  "full-stack-product-development": {
    headlineLines: ["Build complete products", "without fragile", "handoffs between layers."],
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
  },
  "saas-development": {
    headlineLines: ["Turn subscription products", "into systems", "customers can trust."],
    editorialIntro: {
      statement:
        "SaaS development is not CRUD with a login form — it is billing, permissions, onboarding, and architecture that survives your second enterprise customer.",
      supporting:
        "The hardest SaaS problems show up after the demo: tenant isolation, webhook reliability, plan changes, and dashboards that stay fast when data grows.",
      pullQuote: "Build the platform skeleton before the feature sprawl.",
    },
    whatWeBuild: [
      "Multi-tenant SaaS platforms",
      "Subscription & billing flows",
      "Team & account management",
      "Customer portals",
      "Admin consoles",
      "Usage analytics views",
      "Webhook & API products",
      "B2B workflow tools",
    ],
    industries: ["SaaS & Technology", "FinTech", "Healthcare", "Professional Services"],
  },
  "mvp-development": {
    headlineLines: ["Validate the idea", "without throwing away", "the codebase."],
    editorialIntro: {
      statement:
        "An MVP should answer one product question — not preview every feature your roadmap might contain someday.",
      supporting:
        "The goal is deployed software real users can adopt, with enough quality to measure retention and revenue — not a throwaway prototype that forces a rewrite when traction appears.",
      pullQuote: "Learn fast. Ship honestly. Cut scope deliberately.",
    },
    whatWeBuild: [
      "Focused MVP applications",
      "Core workflow prototypes",
      "Pilot-ready web products",
      "Auth & account foundations",
      "Analytics instrumentation",
      "Staging & production environments",
      "Design-partner releases",
      "v2 roadmap foundations",
    ],
    industries: ["Startups", "SaaS & Technology", "E-commerce", "Internal innovation"],
  },
  "api-backend-engineering": {
    headlineLines: ["APIs your frontend,", "mobile clients, and", "partners can rely on."],
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
  },
  "performance-optimization": {
    headlineLines: ["Measure first.", "Fix what users", "actually feel."],
    editorialIntro: {
      statement:
        "Performance work without profiling is guesswork — swap one bottleneck for another and call it optimization.",
      supporting:
        "I start from real user paths, Core Web Vitals, and server timing — then prioritize fixes by impact and cost so speed improvements stick after the next release.",
      pullQuote: "Speed is a feature. Measure it like one.",
    },
    whatWeBuild: [
      "Core Web Vitals improvements",
      "React & Next.js rendering fixes",
      "Bundle & asset optimization",
      "API latency reduction",
      "Database query tuning",
      "Caching strategies",
      "Performance monitoring hooks",
      "Regression guardrails",
    ],
    industries: ["SaaS & Technology", "E-commerce", "Media & Content", "B2B platforms"],
  },
  "frontend-development": {
    headlineLines: ["Interfaces that feel", "intentional — not", "assembled from templates."],
    editorialIntro: {
      statement:
        "Frontend development is what users actually experience — load time, clarity, keyboard paths, and whether the product feels trustworthy on mobile.",
      supporting:
        "Strong backends still fail when the UI is confusing or slow. I implement designs with semantic HTML, sensible state boundaries, and rendering choices that balance SEO and interactivity.",
      pullQuote: "Design fidelity meets production discipline.",
    },
    whatWeBuild: [
      "React & Next.js applications",
      "SaaS dashboards",
      "Marketing & content sites",
      "Design system components",
      "Complex form flows",
      "Accessible interfaces",
      "SEO-friendly public pages",
      "API-connected product UIs",
    ],
    industries: ["SaaS & Technology", "E-commerce", "Education", "Professional Services"],
  },
};
