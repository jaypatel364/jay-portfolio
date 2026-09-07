import type { Service } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA } from "../shared";

export const frontendDevelopment: Service = {
  slug: "frontend-development",
  title: "Frontend Development",
  shortDescription:
    "Frontend development services with React development, TypeScript development, and responsive web development for modern product teams.",
  cardCapabilities: [
    "React Development Services",
    "Responsive Frontend Development",
    "Custom React Development",
  ],
  categoryLabels: ["React", "Next.js", "TypeScript", "Frontend"],
  icon: "monitor",
  order: 6,
  published: true,
  seoBrief: {
    primaryKeyword: "frontend development",
    searchIntent: "Commercial: hiring frontend/React/Next.js developers",
    secondaryKeywords: [
      "frontend development services",
      "front end development",
      "frontend developer",
      "front end developer",
      "frontend web development",
      "hire frontend developer",
      "freelance frontend developer",
      "custom frontend development",
      "web frontend development",
      "responsive frontend development",
      "React development",
      "React development services",
      "React developer",
      "hire React developer",
      "React frontend development",
      "TypeScript development",
      "JavaScript development",
      "responsive web development",
      "modern frontend development",
      "Tailwind CSS development",
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
    heading: "Frontend Development Services",
    headlineLines: ["Interfaces that feel", "intentional, not", "assembled from templates."],
    description:
      "Frontend development services for React and TypeScript products: responsive web applications, custom React development, and modern UI that loads fast and works on every device.",
    primaryCta: { label: "Hire a frontend developer", href: "/contact/" },
    secondaryCta: SERVICE_CONTACT_CTA,
    trustIndicators: ["Production React & Next.js UIs", "Accessibility & semantic HTML focus"],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  editorialIntro: {
    statement:
      "Frontend development is what users see first, if the UI is slow or confusing, nothing else on your roadmap matters.",
    supporting:
      "I build responsive frontend development and React frontend development that matches your designs, passes accessibility basics, and gives your team a component-based development foundation they can extend.",
    pullQuote: "Good frontend web development earns trust on the first screen.",
  },
  whatWeBuild: [
    "React web development projects",
    "Interactive web applications",
    "Responsive web applications",
    "SaaS dashboards",
    "Custom React development",
    "SEO-friendly public pages",
    "Component-based development libraries",
    "API-connected product UIs",
  ],
  industries: ["SaaS & Technology", "E-commerce", "Education", "Professional Services"],
  overview:
    "Frontend development services for teams that need fast, clean interfaces. I handle React development, TypeScript development, and responsive web development, building interactive web applications and modern frontend development that works across devices and stays maintainable for your team.",
  whatWeDo: {
    heading: "Frontend development services for React and TypeScript teams",
    paragraphs: [
      "Frontend development covers everything users click, read, and type. As a React developer and freelance frontend developer, I turn designs into production UI with React development services that include routing, forms, data fetching, and responsive web development. Whether you need web frontend development for a SaaS dashboard or a marketing site, the focus is the same: clear layout, fast load, and code your team can read.",
      "I offer custom frontend development and custom React development for startups, agencies, and product teams. That includes React.js development, React web development, React frontend development, and UI development with Tailwind CSS development where it fits. I also handle frontend architecture, how components are organized, how state flows, and how the app talks to your API.",
      "Hire a frontend developer when your backend is ready but UI quality lags, when you need a React developer to implement Figma files, or when an existing app needs frontend performance optimization and better component-based development. Front end development should not block your release schedule, and with the right frontend development company partner, it won't.",
    ],
  },
  capabilities: [
    {
      title: "React development services",
      description:
        "React application development with hooks, routing, and testing, from SPAs to hybrid apps with clear component boundaries.",
    },
    {
      title: "React.js development & React web development",
      description:
        "Custom React development and React frontend development built to match your design system and API contracts.",
    },
    {
      title: "Responsive frontend development",
      description:
        "Responsive web development and responsive web application layouts that work on mobile, tablet, and desktop.",
    },
    {
      title: "TypeScript & JavaScript development",
      description:
        "TypeScript development and JavaScript development for safer refactors and clearer props across large UI codebases.",
    },
    {
      title: "UI development & component-based development",
      description:
        "Reusable primitives and modern frontend development patterns so teams stop copying buttons every sprint.",
    },
    {
      title: "Tailwind CSS development",
      description:
        "Utility-first styling for fast iteration without sacrificing consistent spacing, color, and typography.",
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
        "Gap between Figma and shipped UI erodes trust. I implement with responsive and state detail.",
    },
    {
      title: "Inaccessible interfaces",
      description:
        "Products that fail keyboard users and screen readers, creating legal and UX risk.",
    },
    {
      title: "Unmaintainable component soup",
      description:
        "Copy-paste components with slightly different props, refactored toward a coherent system.",
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
        "Backends ready but UI backlog blocking releases, need senior implementation capacity.",
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
      description: "Loading, empty, error, and success states, not only the happy path.",
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
      kind: "benefit",
      title: "Interfaces users trust",
      description:
        "Polished, consistent UI increases confidence especially in B2B and fintech contexts.",
    },
    {
      kind: "benefit",
      title: "Maintainable codebase",
      description: "Component patterns that scale with team size instead of fracturing.",
    },
    {
      kind: "benefit",
      title: "Faster feature delivery after setup",
      description: "Solid foundations let your team ship screens without reinventing primitives.",
    },
    {
      kind: "outcome",
      title: "Better accessibility compliance",
      description:
        "Reduced risk and broader audience reach through inclusive design implementation.",
    },
    {
      kind: "outcome",
      title: "SEO-ready public pages",
      description: "Server rendering and metadata done correctly from launch, not bolted on later.",
    },
    {
      kind: "outcome",
      title: "Less design-to-dev rework",
      description:
        "Clear component specs and responsive behavior reduce back-and-forth after handoff.",
    },
  ],
  whyHire: {
    roleTitle: "Frontend Developer",
    intro:
      "You get a frontend developer and React developer who ships responsive frontend development that matches your designs, with frontend architecture your team can build on after handoff.",
    reasons: [
      {
        tag: "Precision",
        title: "Pixel-accurate implementation",
        description:
          "Designs translated to production UI without drift, responsive breakpoints, interaction states, and edge cases handled before handoff.",
      },
      {
        tag: "Performance",
        title: "Fast, responsive interfaces",
        description:
          "Core Web Vitals, bundle discipline, and interaction polish built in, not bolted on after users complain about sluggish screens.",
      },
      {
        tag: "Accessibility",
        title: "Inclusive by default",
        description:
          "Semantic markup, keyboard navigation, and screen reader fundamentals so your product reaches more users and reduces compliance risk.",
      },
      {
        tag: "Maintainability",
        title: "Component systems that scale",
        description:
          "Clear component boundaries and patterns your team can build on, not a one-off codebase that fractures after the first few features.",
      },
    ],
    highlights: [
      { label: "Stack", value: "React · Next.js · TypeScript · Tailwind" },
      { label: "Strength", value: "Forms, dashboards & design systems" },
      { label: "Delivery", value: "Figma-to-production, no rework loops" },
    ],
  },
  caseStudySlugs: [
    "spendly-personal-expense-tracker",
    "minilist-headless-cms",
    "real-time-chat-application",
  ],
  faqs: [
    {
      question: "What is frontend development?",
      answer:
        "Frontend development is building the part of a web product users see and interact with, layouts, forms, navigation, and client-side logic. A frontend developer works in HTML, CSS, JavaScript or TypeScript, usually with frameworks like React.",
    },
    {
      question: "What do frontend development services include?",
      answer:
        "They include UI implementation from designs, React development, responsive web development, API integration, accessibility basics, and frontend performance optimization. Scope depends on whether you need a full app shell or specific screens.",
    },
    {
      question: "How do I hire a React developer?",
      answer:
        "Share your designs, timeline, and tech stack. I scope React development services in milestones. You work directly with the React developer building your UI, useful when you need a freelance React developer without agency overhead.",
    },
    {
      question: "React or Next.js: which should I use?",
      answer:
        "Next.js when you need SEO and server rendering. Plain React when you embed UI inside an existing app. I recommend based on your product, not preference alone.",
    },
    {
      question: "Do you work from Figma designs?",
      answer:
        "Yes. I implement from Figma or similar tools and flag responsive gaps or missing states before development starts.",
    },
    {
      question: "What is the difference between frontend developer and full stack developer?",
      answer:
        "A frontend developer focuses on UI and client-side code. A full stack developer also builds APIs and databases. I offer both, frontend-only or full stack engagements.",
    },
  ],
  relatedServiceSlugs: [
    "full-stack-development",
    "performance-optimization",
    "mvp-development",
    "saas-development",
  ],
  relatedPosts: [
    "react-vs-nextjs-product-teams",
    "accessible-react-components",
    "nextjs-seo-fundamentals",
  ],
  readTimeMinutes: 10,
  coverImage: {
    title: "Frontend Development Services | React and TypeScript UI",
    alt: "Frontend development illustration showing React components, responsive layout, and TypeScript code for a modern web application interface",
  },
  seo: {
    title: "Frontend Development Services | React & TypeScript Developer",
    description:
      "Frontend development services with React and TypeScript. Hire a frontend developer or React developer for custom frontend development, responsive web applications, and UI that ships on time.",
    focusKeyword: "frontend development",
    keywords: [
      "frontend development",
      "frontend development services",
      "frontend developer",
      "React development",
      "React developer",
      "hire React developer",
      "custom frontend development",
      "responsive web development",
      "React frontend development",
      "freelance frontend developer",
      "TypeScript development",
      "modern frontend development",
    ],
    ogTitle: "Frontend Development Services | React & TypeScript Developer",
    ogDescription:
      "Hire a frontend developer for React development, responsive web applications, and custom frontend development. Frontend development services for startups and product teams.",
  },
  updatedAt: "2026-09-07",
};
