/**
 * Content — copy and static lists that power UI sections.
 * FAQ, headline words, marquee stack, learning badges, etc.
 */

import { getExperienceLabel } from "@/lib/utils";
import { identity } from "./identity";
import type { BuildingItem, FAQItem, LearningItem } from "./types";

const expLabel = getExperienceLabel(identity.careerStartDate);

export const content = {
  /**
   * Home hero banner — the SEO-critical block. Every string here renders in the
   * initial HTML. `lead` is segmented so keyword phrases can be wrapped in
   * <strong> without putting markup in this file.
   */
  hero: {
    availability: "Available for freelance work",
    availabilityCta: "Book a call",
    headline: "I'm a Full Stack Developer Specializing in the MERN Stack",
    lead: [
      { text: "I build custom web applications with " },
      { text: "JavaScript, React, Next.js and Node.js", strong: true },
      {
        text:
          ", focusing on scalable architecture, reliable backend systems and great user " +
          "experiences. I work across the frontend, backend and database to turn product ideas into software that is ready for real users.",
      },
    ] as { text: string; strong?: boolean }[],
    /** Proof strip under the CTAs. Keep to 4 short pairs. */
    highlights: [
      { value: `${expLabel} years`, label: "Production experience" },
      { value: `${identity.projectCount}+ projects`, label: "Delivered end to end" },
      { value: "MERN · TypeScript", label: "Core stack" },
      { value: `${identity.location} · Remote`, label: "Available worldwide" },
    ] as { value: string; label: string }[],
  },

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
      category: "tech" as const,
      question: "What does Jay Patel specialize in as a Full Stack Developer?",
      answer:
        "Jay Patel specializes in full-stack web development using React, Next.js, Node.js, " +
        "TypeScript and the MERN stack. His experience includes building scalable web applications, " +
        "REST and GraphQL APIs, real-time features, enterprise systems, SaaS platforms, complex " +
        "forms and backend services using technologies such as MongoDB and PostgreSQL.",
    },
    {
      category: "tech" as const,
      question: "What technologies does Jay Patel use for full-stack development?",
      answer:
        "Jay Patel works primarily with React, Next.js, JavaScript, TypeScript, Node.js, " +
        "Express.js, NestJS, MongoDB and PostgreSQL. His broader toolkit also includes REST APIs, " +
        "GraphQL, Prisma, WebSockets, Docker, AWS, Git and modern testing tools such as Jest and Vitest.",
    },
    {
      category: "tech" as const,
      question: "Does Jay Patel work with the MERN stack?",
      answer:
        "Yes, Jay Patel specializes in MERN stack development using MongoDB, Express.js, React " +
        "and Node.js to build modern full-stack web applications. He also works with TypeScript, " +
        "Next.js, PostgreSQL and other technologies when a project's architecture or requirements " +
        "call for them.",
    },
    {
      category: "work" as const,
      question: "Can Jay Patel build a full-stack web application from scratch?",
      answer:
        "Yes, Jay Patel can work across the full application lifecycle, from frontend development " +
        "and backend architecture to APIs, databases and deployment. His portfolio demonstrates " +
        "experience building complete applications with React, Next.js, Node.js, TypeScript, " +
        "MongoDB, PostgreSQL and related technologies.",
    },
    {
      category: "work" as const,
      question: "What types of web applications has Jay Patel built?",
      answer:
        "Jay Patel has worked on real-time chat applications, social media backend systems, " +
        "headless CMS platforms, HR and business management systems, configurable form systems " +
        "and identity-verification solutions. His projects cover frontend applications, backend " +
        "APIs, real-time functionality, data management and integrations with external services.",
    },
    {
      category: "tech" as const,
      question: "Can Jay Patel build real-time web applications?",
      answer:
        "Yes, Jay Patel has experience building real-time web applications using WebSockets and " +
        "Node.js. His portfolio includes a real-time group chat application with instant messaging, " +
        "chat rooms, typing indicators and seen status, demonstrating practical experience with " +
        "real-time communication rather than only conventional request-and-response applications.",
    },
    {
      category: "process" as const,
      question: "How does Jay Patel approach a new full-stack development project?",
      answer:
        "Jay Patel approaches a new project by first understanding the product requirements, " +
        "technical goals and expected user experience, then translating them into an appropriate " +
        "application architecture and development plan. His work spans frontend, backend, APIs, " +
        "databases and deployment, allowing him to consider the complete system rather than only " +
        "one layer.",
    },
    {
      category: "tech" as const,
      question: "Can Jay Patel develop scalable APIs and backend systems?",
      answer:
        "Yes, Jay Patel has professional experience developing backend systems and APIs with " +
        "Node.js, Express.js and NestJS, including REST and GraphQL APIs. His portfolio also " +
        "includes MongoDB, PostgreSQL, Prisma and authentication-related work, giving him " +
        "experience across application logic, data management and backend architecture.",
    },
    {
      category: "work" as const,
      question: "What experience does Jay Patel have as a Full Stack Developer?",
      answer:
        `Jay Patel has ${expLabel} years of professional experience in web development, working ` +
        "across frontend and backend systems. His experience includes React and Node.js " +
        "development, API integrations, enterprise applications, configurable forms, mentoring " +
        "developers and performance improvements, alongside independent projects involving " +
        "Next.js, TypeScript, WebSockets and modern backend technologies.",
    },
    {
      category: "work" as const,
      question: "Can I hire Jay Patel for freelance full-stack development?",
      answer:
        "Yes, Jay Patel is available for freelance projects and collaboration. He can contribute " +
        "to new web applications, MVPs, feature development and existing codebases, with " +
        "experience across React, Next.js, Node.js, TypeScript and the MERN stack. Visitors can " +
        "use the contact page to discuss their project requirements and determine whether the " +
        "collaboration is a good fit.",
    },
  ] as FAQItem[],

  /**
   * About page — “Who I am” (post-hero). Distinct from the home About strip:
   * personal framing, principles, and snapshot — not a copy of home highlights.
   */
  whoAmI: {
    label: "Who I am",
    title: "Full Stack Developer who owns the product path",
    lead: "I'm Jay Patel, a Full Stack Developer based in India. I care about how a product feels and whether the systems behind it hold up. Most of my work involves React, Next.js, Node.js, TypeScript, MongoDB and PostgreSQL.",
    body: [
      "I started professionally in 2022. Since then, I've worked on production systems including " +
        "real-time chat, configurable form platforms with 100+ flows, HR and KYC tools, and have mentored junior developers working on the same codebases.",
      "I prefer work where the hard part stays invisible, latency that disappears, forms that don't fight the user, " +
        "deployments that don't create unnecessary problems. Reliability over demos.",
    ],
    principles: [
      {
        title: "Understand before building",
        description:
          "Requirements, users, and constraints first. Code comes after the problem is clear.",
      },
      {
        title: "Own the whole path",
        description:
          "One person accountable for architecture, UI, API, and deployment from sketch to production.",
      },
      {
        title: "Build in honest slices",
        description:
          "Small vertical releases, clear scope, and no surprise quality cuts when deadlines move.",
      },
    ],
    snapshot: [
      { label: "Based in", value: "India" },
      { label: "Focus", value: "React · Next.js · Node.js · MERN" },
      { label: "Known for", value: "Real-time systems & complex forms" },
      { label: "Open to", value: "Freelance & collaboration" },
    ],
  },

  /** Why Choose section — about page proof points + CTA. */
  whyChoose: {
    label: "$ whyme",
    title: "Why Hire Jay?",
    intro:
      "I build production web applications across the frontend, backend, and deployment layers, " +
      "with experience in MERN applications, real-time features, complex form workflows, and performance-focused interfaces.",
    points: [
      { icon: "briefcase", text: "Production full-stack experience since 2022" },
      { icon: "rocket", text: "MERN applications built end-to-end" },
      { icon: "shield", text: "TypeScript-first, tested, maintainable code" },
      { icon: "layers", text: "Owns architecture, API, UI, and deployment" },
      { icon: "users", text: "Clear updates, scope, risks, and trade-offs named early" },
      { icon: "globe", text: "Based in India · open to remote collaboration" },
      { icon: "graduation", text: "Mentored junior developers on production codebases" },
      { icon: "clock", text: "Clear scope, milestones, and delivery expectations" },
    ] as { icon: string; text: string }[],
    visualCaption:
      "From sketch to production — products that feel fast, stay reliable, and don't surprise you at deployment time.",
    cta: {
      title: "Ready to discuss",
      titleHighlight: "your next project",
      titleSuffix: "or collaboration?",
      description:
        "Have a project in mind? Send a short brief or book an intro call. I'll get back to you within 24 hours.",
      button: "Contact Jay",
    },
  },

  /**
   * Services / capabilities grid — skills page.
   * Titles + copy are keyword-aware for SEO; keep descriptions concise.
   */
  services: {
    label: "Services",

    title: "Full Stack Development Services for Product Teams",

    intro:
      "I help startups, SaaS companies, agencies, and product teams build production web applications from the first feature through deployment. My work covers product development, frontend and backend engineering, real-time systems, complex workflows, and ongoing improvements.",

    items: [
      {
        icon: "layout",
        title: "Full Stack Product Development",
        description:
          "Build complete web products across the frontend, backend, database, APIs, and deployment. I work with React, Next.js, TypeScript, Node.js, and modern databases to turn product requirements into working software.",
      },

      {
        icon: "monitor",
        title: "SaaS & Web Application Development",
        description:
          "Build customer-facing SaaS products and web applications with a strong focus on usability, maintainability, and a solid technical foundation. I handle the interface, application logic, data layer, and core product workflows.",
      },

      {
        icon: "rocket",
        title: "MVP Development & Launch",
        description:
          "Turn a defined product idea into a focused MVP with the essential features, backend, data model, and deployment in place. The goal is to get a useful product into users' hands without overbuilding the first release.",
      },

      {
        icon: "server",
        title: "Scalable API & Backend Engineering",
        description:
          "Design and build structured backend systems with Node.js, Express.js, REST, GraphQL, and modern data layers. I focus on clear API contracts, authentication, validation, data modeling, and backend code that is easier to extend.",
      },

      {
        icon: "zap",
        title: "Real Time Application Development",
        description:
          "Build applications that need live communication, instant updates, presence, or messaging. WebSockets, Node.js, React, and Redis can be combined to create responsive real time experiences.",
      },

      {
        icon: "forms",
        title: "Workflow & Form Platform Development",
        description:
          "Build complex forms, configurable workflows, multi step processes, and administrative tools for products with detailed business rules. My experience includes platforms supporting more than 100 configurable form flows.",
      },

      {
        icon: "plug",
        title: "Third Party API Integrations",
        description:
          "Connect your application with external APIs and services using reliable authentication, validation, error handling, and data flows. The focus is on integrations that are maintainable as the product evolves.",
      },

      {
        icon: "gauge",
        title: "Performance & Frontend Optimization",
        description:
          "Improve React and Next.js applications that need better performance, accessibility, or frontend maintainability. I work with rendering patterns, Core Web Vitals, semantic HTML, component structure, and technical SEO fundamentals.",
      },

      {
        icon: "wrench",
        title: "Product Maintenance & Modernization",
        description:
          "Improve existing applications through bug fixes, refactoring, performance work, documentation, and incremental feature development. The goal is to make an existing codebase easier to maintain and safer to extend.",
      },
    ] as { icon: string; title: string; description: string }[],
  },

  /** Global pre-footer CTA — all pages except contact. On home this block is #contact. */
  globalCta: {
    label: "Start a project",
    availability: "Open to freelance & collaboration",
    responseTime: "Usually replies within 24 hours",
    intents: [
      {
        id: "collab",
        label: "Collaboration",
        emoji: "🤝",
        headlineBefore: "Let's Build",
        highlight: "Something Great",
        headlineAfter: "Together",
        description:
          "Have a project, product idea or development challenge? Let's discuss how I can help turn it into a reliable, scalable web application.",
        command: "jay collab --stack=mern --mode=remote",
        primaryCta: "Discuss a collaboration",
        primaryHref: "/contact/",
      },
      {
        id: "freelance",
        label: "Freelance",
        emoji: "🚀",
        headlineBefore: "Let's Build",
        highlight: "Something Great",
        headlineAfter: "Together",
        description:
          "Need help building a new product, adding a feature, or improving an existing codebase? Send me the scope and I'll help you plan the next step.",
        command: "jay ship --mode=freelance --deadline=asap",
        primaryCta: "Discuss a project",
        primaryHref: "/contact/",
      },
      {
        id: "call",
        label: "Intro call",
        emoji: "📞",
        headlineBefore: "Let's talk for",
        highlight: "15 minutes",
        headlineAfter: "about your project",
        description:
          "Tell me what you're building, what you're trying to solve, and where you need help. I'll give you an honest assessment of how I can contribute.",
        command: "calendly book --with=jay --duration=15m",
        primaryCta: "Book a call",
        primaryHref: "booking",
      },
    ] as {
      id: string;
      label: string;
      emoji: string;
      headlineBefore: string;
      highlight: string;
      headlineAfter: string;
      description: string;
      command: string;
      primaryCta: string;
      primaryHref: string;
    }[],
    actions: {
      book: { label: "Book a call", hint: "15 min intro" },
      email: { label: "Copy email", hint: "Direct line" },
      message: { label: "Contact Jay", hint: "Send a message" },
    },
  },

  /** Dedicated /contact page — quick panel + form intro. */
  contactPage: {
    intro:
      "Tell me what you're building, what you need help with, or where you're stuck. " +
      "A short overview is enough to start the conversation.",
    quickContactTitle: "Quick contact",
    profilesTitle: "Connect with Jay",
    profilesIntro:
      "You can also find me on LinkedIn or GitHub, or book a short intro call if you'd rather talk.",
    formTitle: "Start the conversation",
    formIntro:
      "Tell me a little about the project, your goals, and what you need help with. " +
      "I'll get back to you with the next step.",
    availability: [
      { icon: "clock", text: "Replies within 24 hours" },
      { icon: "globe", text: "Based in India · open to remote work" },
      { icon: "briefcase", text: "Available for freelance & collaboration" },
    ] as { icon: string; text: string }[],
    trust: {
      label: "Background",
      title: "Built in real production environments",
      intro:
        "My experience comes from building and maintaining real products, including " +
        "MERN applications, real-time systems, workflow platforms, and API-driven products.",
    },
    explore: {
      label: "Before you reach out",
      title: "Want to see more of my work?",
      intro:
        "Take a look at my projects, technical skills, or background before starting a conversation.",

      items: [
        {
          page: "work",
          description:
            "See selected projects, including real-time applications, APIs, CMS platforms, and production systems.",
        },
        {
          page: "skills",
          description:
            "Explore the technologies I use, the services I offer, and how I approach building software.",
        },
        {
          page: "about",
          description: "Learn about my experience, education, and how I work with product teams.",
        },
      ] as { page: "work" | "skills" | "about"; description: string }[],
    },
  },

  /** Skills page — full catalog copy (SEO). Homepage keeps the interactive preview. */
  skillsPage: {
    catalogLabel: "Tech Stack",
    catalogTitle: "Full Tech Stack — Frontend, Backend & DevOps",
    catalogIntro:
      "Tools I've used in production, grouped by layer: React and Next.js on the client, " +
      "Node.js APIs, MongoDB or PostgreSQL, Redis when latency matters, Docker and AWS for deploy.",
    /** Short pipeline labels — how a request moves through the stack. */
    pipeline: [
      { id: "client", label: "Interface", detail: "React · Next.js" },
      { id: "api", label: "API", detail: "Node · Express" },
      { id: "data", label: "Database", detail: "Mongo · Postgres · Redis" },
      { id: "ship", label: "Deployment", detail: "Docker · AWS · CI" },
    ] as { id: string; label: string; detail: string }[],
    /** Per-layer narrative: SEO body + user / builder / shipping angles. */
    layers: {
      Frontend: {
        summary:
          "React and Next.js with TypeScript for responsive, maintainable interfaces, using App Router, server rendering where appropriate, and Tailwind for consistent UI systems.",

        userLens:
          "Interfaces should feel clear and responsive, whether the user is working through a form, managing a dashboard, or using a real-time feature.",

        builderLens:
          "I use component-driven React, typed props, and clear application structure so new features can be added without rewriting unrelated parts of the interface.",

        shippingLens:
          "Accessibility, semantic HTML, rendering behavior, and Core Web Vitals are considered as part of frontend implementation rather than treated as separate cleanup work.",

        highlights: [
          "React · Next.js · TypeScript",
          "App Router & server rendering",
          "Tailwind CSS & component systems",
        ],
      },
      Backend: {
        summary:
          "Node.js with Express.js or NestJS for structured backend services, including REST APIs, GraphQL, WebSockets, authentication, and data access.",

        userLens:
          "The backend should make product behavior predictable: requests are validated, failures are handled clearly, and important operations produce the expected result.",

        builderLens:
          "I define API contracts, validation, business logic, and data models around the product requirements, using MongoDB or PostgreSQL based on the problem.",

        shippingLens:
          "Authentication, authorization, logging, error handling, and integration failures are treated as part of the backend design rather than added after the main functionality is finished.",

        highlights: [
          "Node.js · Express.js · NestJS",
          "REST · GraphQL · WebSockets",
          "MongoDB · PostgreSQL · Redis",
        ],
      },
      "Tools & DevOps": {
        summary:
          "Docker, AWS, GitHub, CI workflows, and testing practices that keep development, testing, and deployment consistent.",

        userLens:
          "The application should be straightforward to test, deploy, update, and hand over without depending on undocumented steps.",

        builderLens:
          "I use Dockerized environments, Git-based workflows, automated checks, and tests around important application paths to keep development predictable.",

        shippingLens:
          "Deployment is treated as part of the application lifecycle. The goal is a repeatable process with clear configuration, useful logs, and enough documentation for the next developer.",

        highlights: ["Docker · AWS · Vercel", "Git · GitHub · CI", "Jest · Vitest · Testing"],
      },
    } as Record<
      string,
      {
        summary: string;
        userLens: string;
        builderLens: string;
        shippingLens: string;
        highlights: string[];
      }
    >,
    /** Always-visible principles — crawlable + trust. */
    approach: {
      title: "How I Build Software",
      items: [
        {
          title: "Product first, tools second",
          description:
            "I start with the product requirements, users, constraints, and expected behavior. The technology comes after the problem is clear.",
        },
        {
          title: "Keep architecture simple",
          description:
            "I prefer straightforward architecture that solves the current problem well. I add complexity when the product actually needs it.",
        },
        {
          title: "Design the system together",
          description:
            "The interface, API, business logic, and database should support the same product model. I design these parts together instead of treating them as separate layers.",
        },
        {
          title: "Build for production",
          description:
            "Validation, authentication, error handling, testing, and deployment are part of the feature, not tasks left until the end.",
        },
      ] as { title: string; description: string }[],
    },
    featureProcess: {
      title: "How I build a feature",
      intro:
        "A feature is more than a UI component. I work through the user behavior, application logic, data model, and production requirements together.",

      steps: [
        {
          title: "Understand the requirement",
          description:
            "Clarify the user, expected behavior, constraints, edge cases, and what success looks like before implementation begins.",
        },
        {
          title: "Design the interface",
          description:
            "Define the user flow and interface states, including loading, validation, empty, error, and success states.",
        },
        {
          title: "Define the application contract",
          description:
            "Decide how the frontend, API, business logic, and database need to communicate before writing the implementation.",
        },
        {
          title: "Build the data and business logic",
          description:
            "Create the data model, validation, authorization, and application logic required to support the feature correctly.",
        },
        {
          title: "Connect and test",
          description:
            "Integrate the frontend and backend, test important paths, and verify failure cases instead of testing only the happy path.",
        },
        {
          title: "Deploy and observe",
          description:
            "Deploy the feature through the existing workflow, check its behavior in the real environment, and use feedback or measurements to improve it.",
        },
      ] as { title: string; description: string }[],
    },
    workStrip: {
      label: "Selected work",
      title: "Projects built with this stack",
      intro:
        "A selection of full-stack projects that show how I apply these technologies to real product features, backend systems, and user workflows.",
    },
  },

  /** Process page — delivery process. */
  process: {
    label: "Process",
    title: "How I build a feature",
    intro:
      "A feature is more than a UI component. I work through the user behavior, application logic, data model, and production requirements together.",

    steps: [
      {
        icon: "compass",
        title: "Discover",
        description:
          "We clarify the product requirements, users, constraints, priorities, and edge cases before development begins.",
      },

      {
        icon: "layers",
        title: "Plan",
        description:
          "I define the main user flows, data model, API structure, and technical approach so the implementation has a clear direction.",
      },

      {
        icon: "rocket",
        title: "Build & Deploy",
        description:
          "I develop the product in focused increments, test important paths, review the results, and deploy working features as they are completed.",
      },

      {
        icon: "life-buoy",
        title: "Improve",
        description:
          "After deployment, I use feedback, real usage, and technical findings to fix issues, refine features, and keep the product maintainable.",
      },
    ] as { icon: string; title: string; description: string }[],
  },

  /** Work page — stats bar labels + catalog + stack link strip. */
  workPage: {
    statsLabel: "Overview",
    catalog: {
      label: "Selected work",
      title: "Projects I've Built",
      intro:
        "A selection of full-stack applications, backend systems, and production work. Filter by full-stack, frontend, or backend to explore the projects in more detail.",
    },
    stackLinks: {
      label: "Tech stack",
      title: "Technologies Used Across My Work",
      intro:
        "These technologies appear across the projects above, depending on the product requirements and technical constraints.",
      cta: "Explore the full stack",
      hint: "Click a technology",
      usedIn: "Used in",
      idle: "Pick a technology on the left to see where it shipped.",
    },
    comingSoon: {
      label: "Project info",
      badge: "Coming soon",
      headline: "Full project write-up coming soon",
      body: "I am preparing a developer-focused breakdown — stack choices, architecture, and what shipped. Until then, you can view the available demo or project summary.",
      back: "Back to all work",
      statusSteps: ["Planning", "Writing", "Publishing"],
      activeStep: 2,
    },
    detail: {
      moreProjects: "Related Projects",
      ndaLabel: "NDA protected",
    },
  },
};
