import type { Service } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA } from "../shared";

export const frontendDevelopment: Service = {
  slug: "frontend-development",
  title: "Frontend Development",
  shortDescription:
    "Modern frontend development with React and Next.js — accessible UI, strong UX, component architecture, and SEO-friendly rendering.",
  cardCapabilities: [
    "React & Next.js applications",
    "Component systems & design implementation",
    "Accessibility & semantic HTML",
    "SEO-friendly rendering patterns",
  ],
  categoryLabels: ["React", "Next.js", "TypeScript", "Frontend"],
  icon: "monitor",
  order: 6,
  seoBrief: {
    primaryKeyword: "React & Next.js development services",
    searchIntent: "Commercial — hiring frontend/React/Next.js developers",
    secondaryKeywords: [
      "frontend development",
      "React developer",
      "React development services",
      "Next.js development",
      "frontend web development",
    ],
    longTailQuestions: [
      "React vs Next.js for my product?",
      "How do you build accessible React apps?",
      "Can you implement from Figma designs?",
      "How do you structure a large React codebase?",
    ],
    relatedEntities: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "accessibility",
      "SSR",
      "design systems",
      "Core Web Vitals",
    ],
    conversionIntent: "Discuss frontend/UI requirements",
  },
  hero: {
    heading: "React & Next.js Development Services",
    headlineLines: ["Interfaces that feel", "intentional — not", "assembled from templates."],
    description:
      "I build fast, accessible frontends with React and Next.js — from marketing sites and dashboards to complex interactive products — with component architecture that stays maintainable as your team grows.",
    primaryCta: { label: "Discuss your frontend", href: "/contact/" },
    secondaryCta: SERVICE_CONTACT_CTA,
    trustIndicators: ["Production React & Next.js UIs", "Accessibility & semantic HTML focus"],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
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
  overview:
    "Frontend development is what users actually experience: load time, clarity of interface, keyboard navigation, form validation feedback, and whether the product feels trustworthy on mobile. Strong backends still fail when the UI is confusing, inaccessible, or so slow that users leave before value appears.\n\nI implement designs with attention to semantic HTML, state management appropriate to the problem, and rendering choices that balance SEO, interactivity, and bundle size. Whether you need a new Next.js marketing site, a SaaS dashboard, or help untangling a React codebase grown over years, the focus is interfaces that ship reliably and that other developers can extend.",
  whatWeDo: {
    heading: "Frontend development for React product teams",
    paragraphs: [
      "Frontend work spans implementation from design files or wireframes, building reusable component libraries, wiring data from your APIs, and ensuring responsive behavior across breakpoints. I use TypeScript throughout for safer refactors and clearer contracts between UI and data layers.",
      "Rendering strategy matters from the start. Marketing and content-heavy pages often benefit from static or server rendering for SEO and first paint. Authenticated app shells may lean client-side with careful code splitting. I choose patterns based on crawl requirements, interactivity needs, and your hosting platform — not a default of client-only SPAs.",
      "Frontend development is ideal when you have backend capacity but need senior UI implementation, when designers have finished visuals that need a production-grade build, or when an existing React app needs refactoring for performance, accessibility, or developer experience.",
    ],
  },
  capabilities: [
    {
      title: "React application development",
      description:
        "SPAs and hybrid apps with thoughtful state boundaries, error boundaries, and testing on critical components.",
    },
    {
      title: "Next.js sites & applications",
      description:
        "App Router projects with SSR, SSG, ISR, and server components where they reduce client JavaScript.",
    },
    {
      title: "Design implementation",
      description:
        "Pixel-faithful builds from Figma with responsive behavior and interaction states designers expect.",
    },
    {
      title: "Component architecture",
      description:
        "Shared primitives, composition patterns, and documentation so teams do not fork buttons every sprint.",
    },
    {
      title: "Forms & validation",
      description:
        "Complex multi-step forms with accessible errors, async validation, and optimistic UI where appropriate.",
    },
    {
      title: "Accessibility (a11y)",
      description:
        "Semantic landmarks, focus management, ARIA where needed, and keyboard paths through primary flows.",
    },
    {
      title: "Frontend performance",
      description:
        "Bundle optimization, lazy loading, and rendering fixes tied to Core Web Vitals.",
      relatedServiceSlug: "performance-optimization",
    },
    {
      title: "Technical SEO foundations",
      description:
        "Metadata, heading hierarchy, structured data hooks, and crawlable links on content pages.",
    },
    {
      title: "API integration",
      description:
        "Typed clients, loading and error states, and cache strategies aligned with your backend.",
      relatedServiceSlug: "backend-development",
    },
  ],
  problems: [
    {
      title: "Designs that never match production",
      description:
        "Gap between Figma and shipped UI erodes trust — I implement with responsive and state detail.",
    },
    {
      title: "Inaccessible interfaces",
      description:
        "Products that fail keyboard users and screen readers, creating legal and UX risk.",
    },
    {
      title: "Unmaintainable component soup",
      description:
        "Copy-paste components with slightly different props — refactored toward a coherent system.",
    },
    {
      title: "SEO-invisible React SPAs",
      description:
        "Marketing pages that search engines struggle to index without server rendering or prerendering.",
    },
    {
      title: "Slow interaction and jank",
      description:
        "Heavy re-renders, unvirtualized lists, and blocking scripts hurting INP scores.",
    },
    {
      title: "Frontend team bottleneck",
      description:
        "Backends ready but UI backlog blocking releases — need senior implementation capacity.",
    },
  ],
  process: [
    {
      title: "Design & requirement review",
      description:
        "Audit designs for responsive gaps, edge states, and API dependencies before sprinting.",
    },
    {
      title: "Architecture setup",
      description:
        "Folder structure, styling approach, and shared primitives agreed with your team.",
    },
    {
      title: "Component build-out",
      description:
        "Implement pages in priority order with Storybook or staging previews if useful.",
    },
    {
      title: "API wiring & states",
      description: "Loading, empty, error, and success states — not only the happy path.",
    },
    {
      title: "Interaction polish",
      description:
        "Forms, validation, and motion refined so the UI feels intentional on desktop and mobile.",
    },
    {
      title: "Accessibility & QA pass",
      description:
        "Keyboard testing, axe checks, and cross-browser verification on critical flows.",
    },
    {
      title: "Performance polish",
      description: "Image, font, and bundle passes before launch or handoff.",
    },
    {
      title: "Documentation & handoff",
      description: "Component usage notes and patterns for in-house frontend developers.",
    },
  ],
  technologies: [
    { category: "Core stack", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { category: "UI & motion", items: ["Radix UI", "shadcn/ui", "Framer Motion"] },
    { category: "Forms & data", items: ["React Hook Form", "Zod", "TanStack Query"] },
    { category: "Testing & quality", items: ["Vitest", "Playwright", "axe-core"] },
    { category: "Tooling", items: ["ESLint", "Prettier", "Storybook"] },
  ],
  useCases: [
    {
      title: "SaaS dashboards",
      description: "Data tables, filters, settings, and onboarding flows for B2B products.",
    },
    {
      title: "Marketing & content sites",
      description: "SEO-oriented Next.js sites with fast LCP and clear information architecture.",
    },
    {
      title: "Customer portals",
      description: "Authenticated areas for documents, billing, and support tickets.",
    },
    {
      title: "E-commerce storefronts",
      description: "Product browsing, cart, and checkout UX tied to commerce APIs.",
    },
    {
      title: "Design system rollout",
      description:
        "Implementing or extending component libraries across multiple product surfaces.",
    },
    {
      title: "Product marketing sites",
      description:
        "Launch and campaign pages with strong typography, motion restraint, and SEO-friendly rendering.",
    },
  ],
  audiences: [
    {
      title: "Startups with designs ready",
      description: "Founders who need engineering to turn high-fidelity mocks into production UI.",
    },
    {
      title: "Backend-heavy teams",
      description: "Teams with APIs shipped but frontend lagging on implementation quality.",
    },
    {
      title: "Design agencies",
      description:
        "Partners needing a developer who respects design detail and communicates blockers early.",
    },
    {
      title: "Companies migrating to React",
      description:
        "Organizations moving off jQuery or legacy templates toward component-based frontends.",
    },
  ],
  deliverables: [
    {
      title: "Production frontend codebase",
      description: "Implemented UI in your repository with CI passing.",
    },
    {
      title: "Component library (as scoped)",
      description: "Shared primitives documented for reuse.",
    },
    {
      title: "Responsive implementations",
      description: "Mobile, tablet, and desktop behavior per designs.",
    },
    {
      title: "Accessibility baseline",
      description: "Keyboard navigable primary flows with semantic HTML.",
    },
    {
      title: "SEO metadata integration",
      description: "Titles, descriptions, and OG tags on public routes.",
    },
    {
      title: "Handoff documentation",
      description: "Setup, conventions, and extension guidelines.",
    },
  ],
  benefits: [
    {
      title: "Interfaces users trust",
      description:
        "Polished, consistent UI increases confidence especially in B2B and fintech contexts.",
    },
    {
      title: "Better accessibility compliance",
      description:
        "Reduced risk and broader audience reach through inclusive design implementation.",
    },
    {
      title: "SEO-ready public pages",
      description: "Server rendering and metadata done correctly from launch, not bolted on later.",
    },
    {
      title: "Maintainable codebase",
      description: "Component patterns that scale with team size instead of fracturing.",
    },
    {
      title: "Faster feature delivery after setup",
      description: "Solid foundations let your team ship screens without reinventing primitives.",
    },
  ],
  caseStudySlugs: [
    "spendly-personal-expense-tracker",
    "minilist-headless-cms",
    "real-time-chat-application",
  ],
  faqs: [
    {
      question: "Do you work from Figma or other design tools?",
      answer:
        "Yes. I implement from Figma, Penpot, or similar sources and flag gaps in responsive specs or interaction states early.",
    },
    {
      question: "React or Next.js — which should I use?",
      answer:
        "Next.js when you need SEO, file-based routing, and server rendering out of the box. Plain React when you are embedding UI inside an existing app shell or have specialized bundler needs. I recommend based on product type, not preference alone.",
    },
    {
      question: "How do you handle accessibility?",
      answer:
        "Semantic HTML first, keyboard testing on primary flows, focus management in modals and wizards, and automated axe checks in CI where feasible. WCAG AA is the usual target unless you specify otherwise.",
    },
    {
      question: "Can you join an existing frontend codebase?",
      answer:
        "Yes. I follow your conventions, improve where agreed, and avoid drive-by rewrites unless technical debt blocks the roadmap.",
    },
    {
      question: "Do you build design systems?",
      answer:
        "I build component libraries and primitives that function as a lightweight design system. Full design ops programs usually involve your design team owning tokens and brand evolution.",
    },
    {
      question: "Is frontend work separate from backend?",
      answer:
        "It can be. I often integrate with your APIs. Full-stack engagements cover both when you want single ownership.",
    },
  ],
  relatedServiceSlugs: [
    "full-stack-development",
    "performance-optimization",
    "mvp-development",
    "saas-development",
  ],
  relatedPosts: [
    { title: "React vs Next.js for Product Teams", slug: "react-vs-nextjs-product-teams" },
    { title: "Accessible React Components", slug: "accessible-react-components" },
    { title: "Next.js SEO Fundamentals", slug: "nextjs-seo-fundamentals" },
  ],
  seo: {
    title: "React & Next.js Development Services | Frontend Developer | Jay Patel",
    description:
      "Frontend development with React and Next.js — accessible UI, component architecture, SEO-friendly rendering, and production dashboards for startups and product teams.",
    focusKeyword: "React & Next.js development services",
    keywords: [
      "React & Next.js development services",
      "frontend development",
      "React developer",
      "React development services",
      "Next.js development",
    ],
  },
  updatedAt: "2026-08-27",
};
