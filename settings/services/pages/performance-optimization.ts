import type { Service } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA } from "../shared";

export const performanceOptimization: Service = {
  slug: "performance-optimization",
  title: "Performance Optimization",
  shortDescription:
    "Application performance optimization for React, Next.js, and Node.js — Core Web Vitals, rendering, queries, and infrastructure tuning.",
  cardCapabilities: [
    "Core Web Vitals audits",
    "React & Next.js rendering",
    "API & database tuning",
    "Caching & bundle analysis",
  ],
  categoryLabels: ["Performance", "Next.js", "React", "Core Web Vitals"],
  icon: "gauge",
  order: 5,
  seoBrief: {
    primaryKeyword: "web application performance optimization",
    searchIntent: "Commercial / investigative — teams with slow apps seeking help",
    secondaryKeywords: [
      "React performance optimization",
      "Next.js performance optimization",
      "Core Web Vitals improvement",
      "frontend performance audit",
      "website speed optimization",
    ],
    longTailQuestions: [
      "Why is my Next.js app slow?",
      "How do I improve Core Web Vitals?",
      "How do you optimize React rendering?",
      "When should I add caching to my API?",
    ],
    relatedEntities: [
      "LCP",
      "INP",
      "CLS",
      "lazy loading",
      "code splitting",
      "SSR",
      "ISR",
      "Redis",
      "database indexes",
    ],
    conversionIntent: "Request a performance audit",
  },
  hero: {
    heading: "Performance Optimization Services",
    description:
      "I diagnose and fix slow web applications — from Core Web Vitals and React rendering to API latency and database queries — using measurements first, not guesswork and premature caching.",
    primaryCta: { label: "Request a performance audit", href: "/contact/" },
    secondaryCta: SERVICE_CONTACT_CTA,
    trustIndicators: ["Core Web Vitals & SEO fundamentals", "Production React/Next.js experience"],
    technologies: ["Next.js", "React", "Lighthouse", "PostgreSQL", "Redis"],
  },
  overview:
    "Performance problems rarely have a single cause. Users complain about slow pages when the real issue is an unbounded API query, an oversized JavaScript bundle, layout shift from late-loading fonts, or database locks under concurrent writes. Optimization work that skips measurement usually trades one bottleneck for another.\n\nI start with real user metrics and profiling — Lighthouse and lab tests, bundle analysis, server timing, query plans — then prioritize fixes by user impact and implementation cost. The goal is faster experiences, better search signals where performance affects rankings, and infrastructure bills that match actual load instead of over-provisioned defaults.",
  whatWeDo: {
    heading: "What performance optimization includes",
    paragraphs: [
      "Performance engagements begin with establishing baselines: which pages or API routes hurt most, what Core Web Vitals look like in the field when analytics exist, and where time is spent in the critical path. Without that, optimization becomes a checklist of best practices that may not touch your actual pain.",
      "Frontend work targets rendering strategy (SSR, SSG, ISR, client components), bundle size, image delivery, font loading, and interaction responsiveness. Backend work targets N+1 queries, missing indexes, synchronous external calls, and queue-worthy background tasks. Infrastructure changes — CDN, caching layers, connection pooling — come after code-level wins unless ops issues are clearly dominant.",
      "This service suits marketing sites that lost traffic after a redesign, SaaS dashboards that choke on large datasets, e-commerce flows with cart abandonment tied to latency, and teams preparing for traffic spikes or SEO-critical launches.",
    ],
  },
  capabilities: [
    {
      title: "Core Web Vitals audit",
      description:
        "Measure LCP, INP, and CLS with field and lab data; map each metric to concrete code or asset changes.",
    },
    {
      title: "React & Next.js rendering optimization",
      description:
        "Server vs client boundaries, streaming, partial prerendering patterns, and elimination of unnecessary re-renders.",
      relatedServiceSlug: "frontend-development",
    },
    {
      title: "JavaScript bundle analysis",
      description:
        "Find heavy dependencies, enable code splitting, and defer non-critical scripts.",
    },
    {
      title: "Image & font optimization",
      description:
        "Modern formats, responsive sizes, priority hints, and font subsetting to reduce layout shift.",
    },
    {
      title: "API & backend latency reduction",
      description:
        "Profile endpoints, parallelize safe operations, and move slow work to background jobs.",
      relatedServiceSlug: "api-backend-engineering",
    },
    {
      title: "Database query tuning",
      description:
        "Explain plans, indexes, pagination fixes, and denormalization only when justified.",
    },
    {
      title: "Caching strategy",
      description:
        "HTTP caches, CDN rules, Redis application cache, and invalidation that will not serve stale critical data.",
    },
    {
      title: "Technical SEO performance fixes",
      description:
        "Crawlability, semantic HTML, and speed factors that affect search visibility — paired with content work elsewhere.",
    },
    {
      title: "Monitoring & regression guards",
      description:
        "Budgets in CI or synthetic checks so performance does not drift release over release.",
    },
  ],
  problems: [
    {
      title: "Poor Core Web Vitals scores",
      description:
        "Search and conversion suffer when LCP, INP, or CLS fail thresholds — often from fixable frontend patterns.",
    },
    {
      title: "Slow SaaS dashboards",
      description:
        "Tables and charts that load entire datasets instead of paginated, indexed queries.",
    },
    {
      title: "Bloated JavaScript bundles",
      description:
        "Client-heavy Next.js apps shipping hundreds of kilobytes before interaction is possible.",
    },
    {
      title: "API timeouts under load",
      description:
        "Endpoints that degrade when concurrent users increase — missing pools, locks, or caches.",
    },
    {
      title: "Layout shift and janky UX",
      description: "Fonts, ads, or dynamic inserts moving content after first paint.",
    },
    {
      title: "Mystery slowness after launch",
      description:
        "Teams without profiling culture guessing at fixes — burning sprints on low-impact tweaks.",
    },
  ],
  process: [
    {
      title: "Baseline measurement",
      description:
        "Collect lab scores, traces, and — when available — real user monitoring on critical URLs.",
    },
    {
      title: "Bottleneck prioritization",
      description: "Rank issues by user impact, confidence, and effort; agree on a fix roadmap.",
    },
    {
      title: "Quick wins delivery",
      description: "Ship high-confidence improvements first — images, fonts, obvious query fixes.",
    },
    {
      title: "Frontend rendering fixes",
      description:
        "Address client/server boundaries, hydration cost, and unnecessary re-renders on key pages.",
    },
    {
      title: "Structural improvements",
      description:
        "Caching layers, schema/index work, or architecture changes that take longer but stick.",
    },
    {
      title: "Verification & monitoring",
      description: "Re-measure, document before/after, and add guards against regressions.",
    },
    {
      title: "Team recommendations",
      description:
        "Practices and tooling so your engineers maintain performance after the engagement.",
    },
    {
      title: "Handoff & regression budget",
      description: "Define budgets for LCP/INP and a lightweight checklist for future releases.",
    },
  ],
  technologies: [
    {
      category: "Frontend profiling",
      items: ["Lighthouse", "Chrome DevTools", "WebPageTest", "next/bundle-analyzer"],
    },
    { category: "Frameworks", items: ["Next.js", "React", "TypeScript"] },
    { category: "Backend", items: ["Node.js", "PostgreSQL", "MongoDB", "Redis"] },
    {
      category: "Infrastructure",
      items: ["Vercel", "Cloudflare", "AWS CloudFront", "CDN caching"],
    },
  ],
  useCases: [
    {
      title: "Marketing & content sites",
      description: "SEO-sensitive pages where speed affects rankings and bounce rate.",
    },
    {
      title: "SaaS analytics dashboards",
      description: "Data-heavy views needing pagination, virtualization, and query optimization.",
    },
    {
      title: "E-commerce checkout flows",
      description: "Latency-sensitive paths where seconds correlate with lost revenue.",
    },
    {
      title: "Public API products",
      description: "SLA-driven APIs needing latency budgets and rate-aware architecture.",
    },
    {
      title: "Post-redesign recovery",
      description: "Sites that regressed after a visual refresh or framework migration.",
    },
    {
      title: "High-traffic landing pages",
      description:
        "Campaign or product pages where conversion and Core Web Vitals need to hold under spike traffic.",
    },
  ],
  audiences: [
    {
      title: "Product teams with user complaints",
      description: "Support tickets mentioning slowness — need diagnosis, not generic advice.",
    },
    {
      title: "SEO-focused businesses",
      description:
        "Organizations where Core Web Vitals and crawl efficiency matter for acquisition.",
    },
    {
      title: "Engineering leads",
      description: "Leads who want an external senior review before a high-traffic launch.",
    },
    {
      title: "Agencies handing off builds",
      description: "Studios wanting a performance pass before client sign-off.",
    },
  ],
  deliverables: [
    {
      title: "Performance audit report",
      description: "Baselines, prioritized findings, and recommended fixes.",
    },
    {
      title: "Implemented optimizations",
      description: "Code and configuration changes as scoped.",
    },
    { title: "Before/after metrics", description: "Documented improvements on agreed KPIs." },
    { title: "Monitoring setup", description: "Synthetic checks or CI budgets where applicable." },
    {
      title: "Maintenance guide",
      description: "How to avoid regressions when shipping new features.",
    },
  ],
  benefits: [
    {
      title: "Better user experience",
      description: "Faster interactions reduce frustration and abandonment on critical flows.",
    },
    {
      title: "Improved search signals",
      description:
        "Core Web Vitals and crawl efficiency support organic visibility where speed is a factor.",
    },
    {
      title: "Lower infrastructure waste",
      description: "Fix inefficient code before scaling servers linearly with traffic.",
    },
    {
      title: "Data-driven decisions",
      description: "Measurements replace debates about which framework feature to try next.",
    },
    {
      title: "Sustainable performance culture",
      description: "Regression guards and documentation help teams maintain gains.",
    },
  ],
  caseStudySlugs: ["spendly-personal-expense-tracker", "real-time-chat-application"],
  faqs: [
    {
      question: "How do you measure performance improvements?",
      answer:
        "I align on KPIs upfront — Core Web Vitals, TTFB, API p95 latency, or custom business metrics. Lab tools plus staging/production measurements show before and after, not anecdotal feel.",
    },
    {
      question: "Can you optimize an app you did not build?",
      answer:
        "Yes. Most audits are on existing codebases. I need repository access, staging environments, and representative traffic patterns or synthetic scenarios.",
    },
    {
      question: "Will optimization break existing features?",
      answer:
        "Changes ship incrementally with tests on critical paths. Caching and rendering changes receive extra verification because they affect data freshness and SEO.",
    },
    {
      question: "How is this different from a Lighthouse score chase?",
      answer:
        "Lighthouse is one input. I prioritize real user paths and business-critical APIs, not only green lab scores on pages nobody visits.",
    },
    {
      question: "Do you optimize mobile performance separately?",
      answer:
        "Mobile constraints — CPU, network, viewport — are part of every audit. Responsive images, JS budgets, and touch interaction latency are evaluated explicitly.",
    },
    {
      question: "Can performance work include backend-only issues?",
      answer:
        "Yes. Many slow apps need database and API fixes more than frontend tweaks. Engagements can be backend-heavy when profiling shows that is where time goes.",
    },
  ],
  relatedServiceSlugs: [
    "frontend-development",
    "api-backend-engineering",
    "full-stack-product-development",
  ],
  relatedPosts: [
    { title: "Core Web Vitals Guide for Developers", slug: "core-web-vitals-guide" },
    { title: "Next.js Performance Checklist", slug: "nextjs-performance-checklist" },
    { title: "React Rendering Optimization", slug: "react-rendering-optimization" },
  ],
  seo: {
    title: "Web Application Performance Optimization | React & Next.js | Jay Patel",
    description:
      "Performance optimization for React, Next.js, and Node.js apps — Core Web Vitals, rendering, API latency, database tuning, and caching with measurement-driven fixes.",
    focusKeyword: "web application performance optimization",
    keywords: [
      "web application performance optimization",
      "React performance optimization",
      "Next.js performance optimization",
      "Core Web Vitals improvement",
      "frontend performance audit",
    ],
  },
  updatedAt: "2026-08-27",
};
