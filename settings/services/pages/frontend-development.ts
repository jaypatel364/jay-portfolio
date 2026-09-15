import type { Service } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA, SERVICE_WORK_CTA } from "../shared";

export const frontendDevelopment: Service = {
  slug: "frontend-development",
  title: "Frontend Development",
  shortDescription:
    "I provide frontend development services to startups, SaaS teams, and product companies. You get one developer who owns the interface. This covers everything from the first component to launch.",
  cardCapabilities: [
    "End-to-end frontend development, from component to production",
    "Responsive web development built in from day one",
    "Modern React and Next.js frontend architecture",
  ],
  categoryLabels: ["React", "Next.js", "TypeScript", "Frontend"],
  icon: "monitor",
  order: 3,
  published: true,
  seoBrief: {
    primaryKeyword: "frontend development services",
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
      "What Does a Frontend Development Service Include?",
      "How Much Does It Cost to Hire a Frontend Developer?",
      "How Long Does It Take to Build a Frontend?",
      "What Technologies Do You Use for Frontend Development?",
      "Do You Provide Custom Frontend Development?",
      "Do You Build Responsive Websites?",
      "Can You Optimize an Existing Frontend for Speed?",
      "Can You Improve or Modernize an Existing Frontend?",
      "Do You Provide Frontend Development Outsourcing?",
      "Do You Provide Frontend Maintenance and Support After Launch?",
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
  headingKeywords: {
    keyword: "Frontend Development",
    keywordVariant: "Modern Frontend Development",
    piecesKeyword: "Frontend Systems",
    roleKeyword: "Frontend Developer",
  },
  sectionSupport: {
    capabilities:
      "Here's the full range of frontend development work I take on. Broken down by what each part involves.",
    problems:
      "Most founders don't call a frontend developer before something breaks. They call right after. These are the problems I see most of the time.",
    process:
      "I follow the same process on every frontend project. It keeps timelines honest and makes sure nothing important gets missed.",
    technologies:
      "React, Next.js, JavaScript, TypeScript, Tailwind CSS and HTML5 make up my core frontend development stack. I don't reuse the same stack for every client, though. The right tools depend on your product, your users, and what your team can maintain after I'm gone.",
    piecesConnect:
      "A frontend that only looks good in a demo isn't built to last. I focus on how the system holds up months after launch, not just how it performs during the first walkthrough, and that approach shapes every decision I make.",
    useCases:
      "Frontend development shows up across many kinds of products. Here's where I've spent the most time building.",
    audiences:
      "Startups, growing companies, and established businesses all end up here for different reasons. Here's how that usually breaks down.",
    deliverables:
      "Every project includes more than code dropped into a repo. Here's what actually gets delivered.",
    benefits:
      "A frontend built right changes how users experience the entire product. Not just how it looks on a demo call.",
    whyHire:
      "You're hiring the person who actually writes the code. Not a project manager relaying updates from someone else. Here's what that gets you.",
    caseStudies: "A few real projects show how these choices play out, not just in theory.",
    faqs: "Here are the questions I get asked most about frontend development services and how I usually answer them.",
    relatedServices:
      "Frontend development rarely happens alone. These related pages cover the pieces that often come up alongside it.",
    relatedPosts: "A closer look at how frontend choices connect to the rest of the stack.",
  },
  hero: {
    heading: "Frontend Development Services",
    description:
      "I provide frontend development services to product companies, SaaS teams, and startups. I have expertise in the development of Next.js and React. Are you in search of frontend development for a new product? Or would you like to expand your team by employing front-end developers? Both of these are included in my frontend development services.",
    primaryCta: SERVICE_CONTACT_CTA,
    secondaryCta: SERVICE_WORK_CTA,
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  editorialIntro: {
    statement:
      "My frontend development services cover the full interface. UI design, components, responsiveness, performance, and support after launch. Nothing here is templated. Every frontend gets built around how your product actually works.",
    supporting:
      "Most frontend development services pass your project between different developers as people become free. I don't work that way. The person who plans your UI is the same person who builds it.",
  },
  whatWeBuild: [
    "End-to-end frontend development, from component to production",
    "Responsive web development built in from day one",
    "Modern React and Next.js frontend architecture",
  ],
  industries: [
    "SaaS Products",
    "eCommerce Platforms",
    "Dashboards & Portals",
    "Marketing & Business Websites",
  ],
  overview:
    "I provide frontend development services to startups, SaaS teams, and product companies. You get one developer who owns the interface. This covers everything from the first component to launch. I focus on React development, Next.js development, and TypeScript development.",
  whatWeDo: {
    heading: "What My Frontend Development Services Include",
    paragraphs: [
      "Every component I build stays modular and testable, so nothing needs reverse-engineering six months down the line. A button handles clicks. A form handles input. Nothing tries to juggle five responsibilities at once, which keeps bugs easy to trace back to their source. Every frontend I ship comes with documentation, because a system nobody understands eventually becomes a system nobody can safely touch. That documentation isn't an afterthought bolted on at the end. It gets written alongside the code, while the reasoning behind each decision is still fresh.",
      "State management gets the same careful treatment. I keep data flow predictable instead of scattering it across random files, and components, so when something eventually breaks, I can trace exactly where it started instead of guessing across the entire application. This is most important as a product grows, when a messy state setup will turn minor bugs into hours of debugging. I structure things so data moves in one clear direction, which keeps the whole codebase easier to reason about, even for someone seeing it for the first time.",
      "Naming conventions, and folder structure follow a clear, consistent pattern from day one, not something figured out halfway through the build. A new developer joining the project later can find what they need quickly, without digging through unrelated files first. This isn't just a nice extra either. It protects you long-term. If I'm ever unavailable for a future update, another developer can read the code, understand the structure and make sense of it fast, without needing me to explain it first.",
    ],
  },
  piecesConnectVisual: {
    type: "diagram",
    image: "/images/services/frontend/frontend_architecture_diagram.png",
    title: "Full Stack Architecture Diagram | Frontend, API, Database & Cloud",
    alt: "Full stack architecture diagram showing a user request flowing through the frontend, backend/API, and database layers on AWS, Docker, and CI/CD",
  },
  deliverablesVisual: {
    type: "illustration",
    image: "/images/services/frontend/what-you-get-with-every-frontend-project.png",
    title: "What You Get With Every Frontend Project | Deliverables",
    alt: "What you get with every Frontend project — eight deliverables from the complete application through post-launch support",
  },
  capabilities: [
    {
      title: "React & Next.js Development",
      description:
        "I build most interfaces with React and Next.js when a product needs server-side rendering, or better SEO. This combo handles complex, interactive UIs without turning into a mess of tangled code. It also holds up as you grow. A frontend built this way doesn't need a rewrite just because your product added ten new features overnight.",
    },
    {
      title: "JavaScript & TypeScript Development",
      description:
        "JavaScript powers the logic behind every interaction on your site. TypeScript adds structure on top of that, catching bugs before they ever reach a real user. I default to TypeScript for anything beyond a small project. It makes the codebase easier to maintain and easier for another developer to understand later without guessing.",
    },
    {
      title: "UI Development",
      description:
        "Good UI development isn't just about how something looks. It's about how easily a user can actually get things done on the page. Every screen gets designed around real user behavior, not just a design trend. Buttons, forms, and navigation all need to feel obvious the first time someone uses them.",
    },
    {
      title: "Component Architecture",
      description:
        "I build reusable UI components from the start, so a button or a form doesn't get rebuilt five different ways across your product. One component, used everywhere it's needed. This keeps your codebase small and predictable. Fixing a bug in one component fixes it everywhere that component gets used, instead of hunting through five copies of the same code.",
    },
    {
      title: "Styling & Design Systems",
      description:
        'I use Tailwind CSS for most projects, since it keeps styling consistent and fast to update. Custom CSS still gets used where a design needs something Tailwind doesn\'t handle well. A proper design system means colors, spacing and typography stay consistent across every page. Nobody has to guess which shade of blue is the "right" one anymore.',
    },
    {
      title: "PWA Development",
      description:
        "Progressive web apps let your product work more like a native app, right from the browser. Offline support, push notifications, and home screen installs all come with a well-built PWA. I build these for products that need app-like reliability without the cost, and delay of publishing to app stores.",
    },
    {
      title: "SPA Development",
      description:
        "Single-page applications load once, then update content instantly as users navigate, without a full page reload each time. This makes the experience feel fast and smooth. I build SPAs with React, handling routing, and state so the app stays fast as time goes on, and more screens and features are added.",
    },
    {
      title: "Micro Frontend Development",
      description:
        "Micro frontend development breaks a large application into smaller, independent pieces that different teams can build, and ship on their own schedule. This matters most for bigger products with multiple teams working on the same platform. Each piece is isolated so that a change by one team doesn’t accidentally break another team’s screen.",
    },
    {
      title: "Performance & Cross-Device Support",
      description:
        "A slow frontend loses users before they even see what you're offering. I optimize load times, image management and code splitting so pages load instantly, not slowly. Cross-device and cross-browser testing happens throughout the build, not at the end. A layout that breaks on one phone or browser is still broken, no matter how good it looks elsewhere.",
    },
  ],
  problems: [
    {
      title: "Slow-Loading Pages Under Real Traffic",
      description:
        "A page that loads fast on a fast connection can crawl on a slower one. I dig into bundle size, image loading, and rendering to find the real bottleneck. Not just patch the symptom.",
    },
    {
      title: "Inconsistent UI Across Devices and Browsers",
      description:
        "This happens more than people think. A layout looks fine on one screen size and breaks on another. I rebuild these with proper responsive rules, tested across real devices, not just a browser preview.",
    },
    {
      title: "Frontend Code With No Clear Structure",
      description:
        "Features get added over time with no real plan. Eventually nobody on the team understands how the components fit together. I map the whole interface first. Then I refactor it into something documented and easy to follow.",
    },
    {
      title: "Broken API Integrations",
      description:
        "The worst kind of bug fails quietly. Data doesn't load, and the screen just sits there blank with no error shown. I rebuild these with proper loading states and clear error handling.",
    },
    {
      title: "No In-House Frontend Expertise",
      description:
        "Plenty of founders don't need a full-time frontend team yet. They need a dedicated frontend developer for one specific build. I step in for exactly the scope you need. Nothing extra.",
    },
    {
      title: "Accessibility and Performance Gaps Found Too Late",
      description:
        "Most accessibility and performance issues aren't caused by carelessness. They happen because nobody had time to check properly. I test for both throughout the build, not after launch.",
    },
  ],
  process: [
    {
      title: "Discovery & Requirements",
      description:
        "Before I write any code, I need to understand your product, your users and how they'll actually use the interface. This step can feel slow. Skipping it usually causes bigger problems later.",
    },
    {
      title: "UI/UX Architecture & Planning",
      description:
        "I map out screens, user flows and how components will connect to each other. Nobody guesses mid-build what a page should look like.",
    },
    {
      title: "Component Design & Modeling",
      description:
        "Reusable components get planned here. Along with figuring out which pieces of the UI will get reused the most across the product.",
    },
    {
      title: "Core Frontend Development",
      description:
        "This is most of the work. Building out screens, wiring up components and making the interface actually function the way it's meant to.",
    },
    {
      title: "API Integration",
      description:
        "Whatever backend or third-party data your frontend depends on gets connected, and tested here, with proper loading and error states.",
    },
    {
      title: "Testing & Performance",
      description:
        "Before anything ships, I test across devices, browsers, and real network conditions. Not just a single happy-path demo on a fast connection.",
    },
    {
      title: "Deployment & CI/CD Pipeline",
      description:
        "Your frontend gets deployed to your preferred hosting platform. CI/CD gets set up so future updates roll out safely, on their own.",
    },
    {
      title: "Launch & Ongoing Support",
      description:
        "I stay involved after launch. Monitoring, bug fixes and updates continue as your product changes. A frontend is never really finished.",
    },
  ],
  technologies: [
    {
      category: "Frameworks & Libraries",
      items: ["React", "Next.js", "Vue.js"],
    },
    {
      category: "Languages",
      items: ["JavaScript", "TypeScript", "HTML5 development", "CSS3 development"],
    },
    {
      category: "Styling",
      items: [
        "Tailwind CSS",
        "Custom CSS",
        "Responsive CSS",
        "Shadcn UI",
        "Material UI",
        "Bootstrap",
      ],
    },
    {
      category: "Component Patterns",
      items: [
        "Frontend component development",
        "component-based development",
        "reusable UI components",
      ],
    },
  ],
  useCases: [
    {
      title: "SaaS Products",
      description:
        "SaaS UI development needs to stay clean and fast, even with dense data and multiple user roles running through the same screens.",
    },
    {
      title: "eCommerce Platforms",
      description:
        "Product pages, checkout flows, and search all need to load fast and feel simple. A slow checkout page costs real sales.",
    },
    {
      title: "Dashboards & Portals",
      description:
        "These live or die on clarity. I build a dashboard UI that stays readable even as the amount of data keeps growing.",
    },
    {
      title: "Marketing & Business Websites",
      description:
        "First impressions matter here. A fast, clean interface builds trust before a visitor reads a single word of content.",
    },
    {
      title: "Internal Tools",
      description:
        "Internal tools get overlooked a lot. But they still need an interface that's simple to use every single day. I keep these lean, without over-building them.",
    },
    {
      title: "Enterprise Web Applications",
      description:
        "Enterprise frontend applications need to handle more users, more roles, and more data than a typical product. I build these to stay stable and fast under that extra weight.",
    },
  ],
  audiences: [
    {
      title: "Startups Building Their First Interface",
      description:
        "If this is your first product interface, I help you ship something solid. Without over-engineering a version one that doesn't need every feature yet.",
    },
    {
      title: "Growing Businesses Outgrowing Template Websites",
      description:
        "At some point, a template site stops keeping up with real demand. I move you onto a custom frontend built for the traffic and features you actually need now.",
    },
    {
      title: "Enterprises Needing Reliable Interfaces",
      description:
        "Larger organizations need frontends that are tested well, accessible, and built to meet strict performance expectations across many users.",
    },
    {
      title: "Companies Looking to Hire Without a Full-Time Role",
      description:
        "If a full-time frontend team isn't realistic yet, I offer dedicated frontend development scoped to exactly what your project needs.",
    },
    {
      title: "Agencies Needing a Frontend Specialist",
      description:
        "Some agencies need an extra frontend developer for a single client project, without adding someone to their permanent team. I plug in as that specialist for as long as the project needs.",
    },
  ],
  deliverables: [
    {
      title: "Complete Frontend Application",
      description:
        "The full interface. Screens, components, and every core feature your product needs to actually work.",
    },
    {
      title: "UI Development & Component Architecture",
      description:
        "Reusable, well-structured components built once, and used consistently across your entire product.",
    },
    {
      title: "Responsive Design",
      description:
        "A layout that works cleanly across phones, tablets and desktops, not just the screen size used during testing.",
    },
    {
      title: "Frontend Performance Optimization",
      description:
        "Fast load times, and smooth interactions, checked throughout the build, not bolted on at the end.",
    },
    {
      title: "Integration API",
      description:
        "Proper loading and error handling with clean reliable connections to your backend or third party services.",
    },
    {
      title: "Quality Assurance and Testing",
      description: "Every screen is tested on devices and browsers before it goes live.",
    },
    {
      title: "Cross Browser Compatibility",
      description:
        "Same experience no matter what they are on, consistent behavior between major browsers.",
    },
    {
      title: "Post-Launch Support",
      description:
        "Bug fixes, updates, and help keep your frontend current as your product and users keep growing.",
    },
  ],
  benefits: [
    {
      kind: "benefit",
      title: "Faster Websites",
      description:
        "Optimized code, and smart loading mean users stay engaged instead of bouncing while a page loads.",
    },
    {
      kind: "benefit",
      title: "Fewer Bugs",
      description:
        "A well-structured frontend catches issues early, instead of surfacing them after real users find them first.",
    },
    {
      kind: "benefit",
      title: "Lower Long-Term Costs",
      description:
        "Clean, documented code is far easier to maintain. Shortcuts taken early tend to be expensive fixes later.",
    },
    {
      kind: "outcome",
      title: "Systems That Scale With You",
      description:
        "With the right component architecture, you don’t have to rebuild everything when you add a new feature.",
    },
    {
      kind: "outcome",
      title: "Cleaner Code",
      description:
        "Consistent structure keeps the codebase readable, which makes new features much easier to build later.",
    },
    {
      kind: "outcome",
      title: "Better User Experience",
      description:
        "A fast, clear interface keeps users on the page longer, and more likely to come back.",
    },
  ],
  whyHire: {
    roleTitle: "Frontend Developer",
    intro:
      "You're hiring the person who actually writes the code. Not a project manager relaying updates from someone else. Here's what that gets you.",
    reasons: [
      {
        tag: "Speed",
        title: "Speed",
        description:
          "I move fast without skipping the parts that matter. Your timeline stays realistic instead of dragging on for months.",
      },
      {
        tag: "Precision",
        title: "Precision",
        description:
          "Details get real attention. From how a button responds to how a layout holds up on a smaller screen.",
      },
      {
        tag: "Full",
        title: "Full Ownership",
        description:
          "I own what I build. There's no blaming \"the last developer,\" because there isn't one on this project.",
      },
      {
        tag: "Clear",
        title: "Clear Communication",
        description:
          "Updates come in plain language. You won't need a glossary to understand what's happening with your build.",
      },
      {
        tag: "Flexibility",
        title: "Flexibility",
        description: "I work around your existing tools and team. Not the other way around.",
      },
      {
        tag: "Long-Term",
        title: "Long-Term Support",
        description:
          "I don't disappear after launch. If something needs fixing six months later, I'm still around and I still remember the system.",
      },
    ],
    highlights: [
      { label: "Experience", value: "Years building production interfaces" },
      {
        label: "Projects",
        value: "Frontend builds delivered across SaaS, eCommerce, and internal tools",
      },
      {
        label: "Scope",
        value: "Comfortable owning frontend, API integration, and design systems together",
      },
    ],
  },
  caseStudySlugs: [
    "spendly-personal-expense-tracker",
    "minilist-headless-cms",
    "real-time-chat-application",
  ],
  faqs: [
    {
      question: "What Does a Frontend Development Service Include?",
      answer:
        "It covers everything a user sees and interacts with. UI design, components, responsiveness, performance and API integration. I own the whole build myself, so there's no gap between pieces built by different people.",
    },
    {
      question: "How Much Does It Cost to Hire a Frontend Developer?",
      answer:
        "Cost depends on scope. A simple landing page costs far less than a full product interface with dozens of screens. I quote you on the specifics of your project, not a flat rate.",
    },
    {
      question: "How Long Does It Take to Build a Frontend?",
      answer:
        "Timelines vary by complexity. A basic site can ship in a couple of weeks. A full product interface with custom components usually takes a couple of months, depending on the features involved.",
    },
    {
      question: "What Technologies Do You Use for Frontend Development?",
      answer:
        "I mainly work with React, Next.js, JavaScript, TypeScript and Tailwind CSS. The specific stack will depend on your product needs, your users and what your team can maintain for the long haul.",
    },
    {
      question: "Do You Provide Custom Frontend Development?",
      answer:
        "Yes. I don't build interfaces from a generic template. Custom frontend development means the components, layout, and styling all fit how your specific product actually works.",
    },
    {
      question: "Do You Build Responsive Websites?",
      answer:
        "Yes. Responsive web development is part of nearly every project I build. Your site works cleanly on phones, tablets, and desktops, not just the screen size used during testing.",
    },
    {
      question: "Can You Optimize an Existing Frontend for Speed?",
      answer:
        "Yes. Frontend performance optimization is one of the most common requests I get. I dig into load times, bundle size and rendering to make an existing site noticeably faster.",
    },
    {
      question: "Can You Improve or Modernize an Existing Frontend?",
      answer:
        "Yes. I regularly step into existing frontends to fix messy components, patch performance issues, or modernize outdated code, all without disrupting your live product during the process.",
    },
    {
      question: "Do You Provide Frontend Development Outsourcing?",
      answer:
        "Yes. If full time isn’t the right fit, I can be your dedicated frontend developer on a defined project or ongoing scope. You get senior-level work without the overhead.",
    },
    {
      question: "Do You Provide Frontend Maintenance and Support After Launch?",
      answer:
        "Yes. Post launch support includes bug fixes, performance monitoring and ongoing frontend development work. It keeps your interface reliable as your product and users keep growing.",
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
    title: "Frontend Development Services | React & Next.js Developer",
    description:
      "Frontend development services from a dedicated developer. React, Next.js, TypeScript and Tailwind CSS used to build fast, responsive, production-ready interfaces.",
    focusKeyword: "frontend development services",
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
    ogTitle: "Frontend Development Services | React & Next.js Developer",
    ogDescription:
      "Frontend development services from a dedicated developer. React, Next.js, TypeScript and Tailwind CSS used to build fast, responsive, production-ready interfaces.",
  },
  updatedAt: "2026-09-14",
};
