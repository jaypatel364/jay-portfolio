import type { Service } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA } from "../shared";

export const mvpDevelopment: Service = {
  slug: "mvp-development",
  title: "MVP Development",
  shortDescription:
    "Focused MVP development that ships essential features, validates product ideas, and avoids overbuilding the first release.",
  cardCapabilities: [
    "Scope & milestone planning",
    "Core workflow implementation",
    "Auth, data & deployment",
    "Launch-ready documentation",
  ],
  categoryLabels: ["MVP", "Next.js", "Node.js", "Startup"],
  icon: "rocket",
  order: 3,
  seoBrief: {
    primaryKeyword: "MVP development",
    searchIntent: "Commercial — founders seeking MVP build partners",
    secondaryKeywords: [
      "MVP development services",
      "minimum viable product development",
      "startup MVP development",
      "MVP software development",
      "build an MVP",
    ],
    longTailQuestions: [
      "How long does it take to build an MVP?",
      "How much does MVP development cost?",
      "MVP vs prototype — what is the difference?",
      "What should be included in an MVP?",
      "What tech stack is best for an MVP?",
    ],
    relatedEntities: [
      "product validation",
      "user feedback",
      "lean startup",
      "scope cutting",
      "Next.js",
      "Node.js",
      "wireframes",
      "analytics",
    ],
    conversionIntent: "Scope an MVP build",
  },
  hero: {
    heading: "MVP Development Services",
    description:
      "I help founders and product teams build focused MVPs — the smallest useful version of your product — with enough technical quality to learn from real users instead of throwing away prototype code after launch.",
    primaryCta: { label: "Scope your MVP", href: "/contact/" },
    secondaryCta: SERVICE_CONTACT_CTA,
    trustIndicators: ["Shipped MVPs & v1 platforms", "Pragmatic scope — no feature bloat"],
    technologies: ["Next.js", "React", "Node.js", "PostgreSQL", "Supabase"],
  },
  overview:
    "An MVP should answer a specific product question: will users complete this workflow, pay for this outcome, or prefer this approach over alternatives? MVP development fails when teams treat it as a mini version of every future feature, or when engineers build throwaway code that cannot evolve.\n\nI focus on ruthless scope clarity, vertical feature slices, and architecture that is intentionally simple but not reckless. You get a deployed product with auth, core data flows, and analytics hooks — enough to run experiments, onboard design partners, or support an early fundraising narrative without committing to six months of speculative work.",
  whatWeDo: {
    heading: "MVP development — what you get",
    paragraphs: [
      "MVP work starts with defining the hypothesis: what must be true for this product to deserve more investment? We translate that into a feature list with explicit in-scope and out-of-scope boundaries. Nice-to-haves are documented for phase two rather than smuggled into v1.",
      "Implementation prioritizes the path from signup to the core value moment. Secondary screens, admin polish, and edge-case automation wait until you have signal. I still apply sensible defaults for security, data validation, and deployment because learning from users is useless if the app leaks data or breaks on every deploy.",
      "MVP development fits pre-seed and seed-stage founders, corporate innovation teams testing a new line of business, and SaaS companies validating a new module before committing a full squad.",
    ],
  },
  capabilities: [
    {
      title: "Scope definition & roadmap",
      description:
        "Workshop requirements into milestones with clear success metrics and cut lines when timelines tighten.",
    },
    {
      title: "Core workflow implementation",
      description:
        "Build the one or two flows that prove value — not every settings screen you might need someday.",
    },
    {
      title: "Authentication & accounts",
      description:
        "Email/password or OAuth sign-up so you can identify users and iterate based on cohort behavior.",
    },
    {
      title: "Data model for v1",
      description:
        "Schemas that support the MVP without pretending to solve every enterprise edge case upfront.",
    },
    {
      title: "Basic admin or ops views",
      description: "Lightweight tools to inspect data and help early users when things go wrong.",
    },
    {
      title: "Deployment & environments",
      description: "Staging and production setups so demos and pilots use stable URLs.",
    },
    {
      title: "Analytics hooks",
      description:
        "Event tracking or integration points for PostHog, Mixpanel, or similar tools you choose.",
    },
    {
      title: "Handoff to v2",
      description:
        "Document technical debt consciously taken and the recommended next architectural steps.",
      relatedServiceSlug: "full-stack-product-development",
    },
  ],
  problems: [
    {
      title: "MVP scope creep",
      description:
        "Founders adding features because competitors have them — delaying learning and burning budget.",
    },
    {
      title: "Prototype code in production",
      description:
        "No tests, no migrations, hard-coded secrets — fine for a demo, dangerous for paying pilots.",
    },
    {
      title: "No clear success metric",
      description: "Teams ship without defining what user behavior would justify phase two.",
    },
    {
      title: "Over-engineered v1",
      description: "Microservices and multi-region setups before anyone has used the product.",
    },
    {
      title: "Founder bottleneck",
      description:
        "Non-technical founders blocked because no engineer can translate vision into a build plan.",
    },
    {
      title: "Agency mismatch",
      description: "Large shops quoting six-month builds when you need a six-week learning cycle.",
    },
  ],
  process: [
    {
      title: "Hypothesis & scope workshop",
      description: "Define users, core workflow, metrics, and explicit non-goals for v1.",
    },
    {
      title: "UX alignment",
      description: "Confirm wireframes or low-fi flows for the critical path only.",
    },
    {
      title: "Technical spike",
      description: "Validate risky integrations or algorithms before committing the full timeline.",
    },
    {
      title: "Architecture lite",
      description:
        "Choose a stack and data model simple enough to ship fast, with a clear path to harden later.",
    },
    {
      title: "Sprint-based build",
      description: "Weekly demos of working software — not slide decks.",
    },
    {
      title: "Pilot hardening",
      description: "Fix show-stoppers, add basic monitoring, and prepare support playbooks.",
    },
    {
      title: "Launch & feedback loop",
      description: "Deploy, instrument, and review data with you to decide v2 priorities.",
    },
    {
      title: "v2 roadmap handoff",
      description:
        "Document what to keep, what to refactor, and which features earned a place in the next release.",
    },
  ],
  technologies: [
    {
      category: "Fast iteration stacks",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    { category: "Backend", items: ["Node.js", "Express.js", "Server Actions", "REST"] },
    { category: "Data", items: ["PostgreSQL", "Supabase", "MongoDB", "PlanetScale"] },
    { category: "Auth & payments", items: ["Clerk", "NextAuth", "Stripe Checkout"] },
    { category: "Deploy", items: ["Vercel", "Railway", "Render"] },
  ],
  useCases: [
    {
      title: "SaaS MVP",
      description:
        "Subscription product testing one vertical workflow before full platform investment.",
    },
    {
      title: "Marketplace pilot",
      description:
        "Supply-and-demand test with manual ops filling gaps automation will handle later.",
    },
    {
      title: "Internal tool MVP",
      description: "Department software proving ROI before enterprise rollout.",
    },
    {
      title: "Mobile-web MVP",
      description: "Responsive web first to validate usage before native app spend.",
    },
    {
      title: "AI feature MVP",
      description:
        "Thin wrapper around an LLM API with guardrails and human review where quality matters.",
    },
    {
      title: "Fundraising demo product",
      description:
        "A credible, deployed product narrative for design partners or investor conversations — not a throwaway prototype.",
    },
  ],
  audiences: [
    {
      title: "Startup founders",
      description:
        "First-time or repeat founders who need a builder partner, not a 20-person agency.",
    },
    {
      title: "Product managers",
      description:
        "PMs with research and designs who need engineering execution on a fixed MVP scope.",
    },
    {
      title: "SaaS teams testing modules",
      description:
        "Existing companies piloting a new product line with isolated codebase or feature flags.",
    },
    {
      title: "Innovation labs",
      description: "Corporate teams running time-boxed experiments with clear kill criteria.",
    },
  ],
  deliverables: [
    { title: "Scoped MVP specification", description: "In/out list, milestones, and metrics." },
    { title: "Deployed MVP application", description: "Production URL with core workflows live." },
    { title: "Source repository", description: "Documented setup for your team or future hires." },
    { title: "Basic test coverage", description: "Tests on auth and critical mutations." },
    {
      title: "Analytics instrumentation",
      description: "Events or hooks for measuring activation.",
    },
    {
      title: "v2 recommendation memo",
      description: "Technical and product next steps based on launch learnings.",
    },
  ],
  benefits: [
    {
      title: "Faster learning cycles",
      description: "Ship in weeks, not quarters, with scope that matches your runway.",
    },
    {
      title: "Capital-efficient builds",
      description: "Pay for proof, not premature platform complexity.",
    },
    {
      title: "Evolution-ready code",
      description: "Conscious trade-offs documented so v2 is a roadmap, not a rescue mission.",
    },
    {
      title: "Clear go/no-go signals",
      description: "Metrics and instrumentation baked in from the start.",
    },
    {
      title: "Direct senior ownership",
      description: "No account managers — you work with the engineer building the product.",
    },
  ],
  caseStudySlugs: ["spendly-personal-expense-tracker", "real-time-chat-application"],
  faqs: [
    {
      question: "How long does it take to build an MVP?",
      answer:
        "Many MVPs land in four to ten weeks depending on workflow complexity and design readiness. Integrations, compliance, or novel algorithms extend that range. Timeline is fixed after scope workshop, not guessed from a landing page description.",
    },
    {
      question: "How much does MVP development cost?",
      answer:
        "Cost tracks scope and risk. A single-workflow MVP with standard auth and CRUD is materially cheaper than a multi-sided marketplace with payments. I quote milestone-based fixed scopes or time-boxed engagements after discovery.",
    },
    {
      question: "What is the difference between an MVP and a prototype?",
      answer:
        "A prototype demonstrates UX — often disposable. An MVP is deployed software real users can adopt, with enough quality to measure retention, revenue, or workflow completion. I build MVPs, not clickable Figma-only demos.",
    },
    {
      question: "What should be included in an MVP?",
      answer:
        "Sign-up, the core value workflow, minimal settings, deployment, and measurement. Exclude nice dashboards, exhaustive admin, and every integration unless they are on the critical path to your hypothesis.",
    },
    {
      question: "What tech stack is best for an MVP?",
      answer:
        "Next.js plus a managed database (Supabase or PostgreSQL) is a common choice for speed and hiring flexibility. Stack should match what your future team can maintain after I hand off.",
    },
    {
      question: "Can an MVP evolve into a full product?",
      answer:
        "That is the goal. I avoid reckless shortcuts on auth and data modeling while deferring gold-plating. When traction appears, we extend into full-stack or SaaS development engagements.",
    },
    {
      question: "Do you help prioritize MVP features?",
      answer:
        "Yes. Scope workshops are part of the process — I push back on features that do not serve the current hypothesis so budget stays focused.",
    },
  ],
  relatedServiceSlugs: [
    "saas-development",
    "full-stack-product-development",
    "frontend-development",
    "api-backend-engineering",
  ],
  relatedPosts: [
    { title: "MVP Development Process", slug: "mvp-development-process" },
    { title: "MVP vs Prototype", slug: "mvp-vs-prototype" },
    { title: "How to Validate an MVP", slug: "how-to-validate-mvp" },
    { title: "MVP Development Cost", slug: "mvp-development-cost" },
  ],
  seo: {
    title: "MVP Development Services | Startup & Product MVPs | Jay Patel",
    description:
      "MVP development for startups and product teams — focused scope, deployed software, and architecture that can evolve into a full product without a rewrite.",
    focusKeyword: "MVP development",
    keywords: [
      "MVP development",
      "MVP development services",
      "minimum viable product development",
      "startup MVP development",
      "build an MVP",
    ],
  },
  updatedAt: "2026-08-27",
};
