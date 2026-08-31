import type { ProjectDetail } from "./types";

export const minilistHeadlessCmsDetail: ProjectDetail = {
  slug: "minilist-headless-cms",
  intro:
    "MiniList is a headless CMS, a place to write and manage content that then gets delivered to any website or app through an API. It has two halves: an admin dashboard built in Next.js where content is written, and a NestJS backend that stores it and serves it out. It is self-hostable, so the content and the database stay wherever you put them.",
  overview:
    "The admin side handles writing and organising content: a rich text editor, blog posts, author profiles, SEO fields, and analytics. The backend stores everything in PostgreSQL through Prisma and exposes it over both REST and GraphQL, so whoever is consuming the content can pick whichever fits their app.\n\nAccess is handled two ways. People sign in to the dashboard with Google OAuth. Applications reading content use generated API keys instead, which keeps human sessions and machine access separate.\n\nThe interesting part of building a CMS is that you are building for two very different audiences at once: writers who need a comfortable editor, and developers who need a predictable API.",
  role: [
    "Built the admin dashboard in Next.js, including the rich text editing experience",
    "Built the NestJS backend and the content delivery API",
    "Designed the PostgreSQL schema in Prisma for posts, authors, and SEO fields",
    "Implemented Google OAuth for dashboard sign-in",
    "Added API key generation so applications can read content without a user session",
    "Exposed content over both REST and GraphQL",
  ],
  problem:
    "A CMS has to serve two audiences whose needs pull in different directions. Writers want an editor that feels natural and does not require thinking about data structures. Developers want a stable, predictable API and no surprises in the response shape. On top of that, the two groups need entirely different kinds of access. A person signing in is not the same as an application fetching content on a schedule. The problem was building one system that handles both without the editor leaking into the API design or vice versa.",
  build:
    "The Next.js dashboard is where content is created. It holds the rich text editor, the forms for authors and SEO fields, and the analytics views. It talks to the NestJS backend rather than to the database directly.\n\nNestJS handles storage and delivery. Prisma defines the schema for posts, authors, and SEO metadata, and generates a typed client for PostgreSQL. Content is exposed through both a REST API and GraphQL, sharing the same underlying services so the two interfaces cannot drift apart in behaviour.\n\nAuthentication is split by audience. Google OAuth covers people signing in to the dashboard, so there are no passwords to store. API keys cover applications reading content, and each key can be generated and revoked independently of any user account.\n\nBecause the whole thing runs on your own PostgreSQL instance, it can be self-hosted rather than depending on a managed content platform.",
  features: [
    {
      title: "Rich Text Editing",
      description:
        "Content is written in a rich text editor rather than raw markup, so writers can format posts without thinking about how the content is stored underneath.",
    },
    {
      title: "Blog and Author Management",
      description:
        "Posts and author profiles are managed separately and linked together, which means an author's details live in one place instead of being repeated on every post.",
    },
    {
      title: "API Key Generation",
      description:
        "Applications get their own keys to read content. Keys are separate from user accounts, so revoking an application's access does not affect anyone's login.",
    },
    {
      title: "Google OAuth Sign-In",
      description:
        "Dashboard access uses Google OAuth, which means no password storage and no password reset flow to build and maintain.",
    },
    {
      title: "SEO Fields",
      description:
        "Posts carry their own SEO metadata, so the site consuming the content has the titles and descriptions it needs rather than generating them from the body text.",
    },
    {
      title: "REST and GraphQL Delivery",
      description:
        "The same content is available through both interfaces. A site that just wants a list of posts can use REST; one that needs specific nested fields can use GraphQL.",
    },
    {
      title: "Analytics",
      description:
        "Content activity is surfaced in the dashboard, so the people writing can see what is happening without leaving the admin.",
    },
  ],
  architecture: {
    layers: [
      "Next.js Admin Dashboard",
      "NestJS API",
      "REST & GraphQL Layer",
      "Prisma ORM",
      "PostgreSQL",
    ],
    explanation:
      "The Next.js dashboard is a separate application from the NestJS backend, and it uses the same API that any other consumer would. That was deliberate: if the admin can build everything it needs through the public API, the API is complete enough for outside applications too. NestJS handles requests through either the REST or GraphQL layer, both of which call the same services underneath, and Prisma handles the PostgreSQL access.",
  },
  decisions: [
    {
      title: "Separating the admin from the API",
      why: "Keeping the dashboard as its own Next.js application meant it had to consume the same API as any external client. That forced the API to be genuinely complete rather than leaving gaps that only the admin knew how to work around.",
      tradeoff:
        "Two applications to deploy and keep in sync instead of one. In return, the API is proven by the admin using it every day.",
    },
    {
      title: "Offering both REST and GraphQL",
      why: "Different consumers want different things. A simple site pulling a list of posts is happier with REST. An app that needs specific nested fields benefits from GraphQL. Supporting both meant not forcing a choice on whoever integrates.",
      tradeoff:
        "Two interfaces to maintain. I reduced that cost by having both call the same services, so the behaviour is defined once even though it is exposed twice.",
    },
    {
      title: "API keys separate from user accounts",
      why: "Applications and people need different kinds of access. An application should not need a user session to read published content, and revoking its access should not touch anyone's login.",
      tradeoff:
        "Two authentication paths to build and reason about instead of one shared mechanism.",
    },
    {
      title: "Google OAuth instead of custom passwords",
      why: "Storing passwords means handling hashing, resets, and the security responsibility that comes with them. OAuth removes all of that from the codebase.",
      tradeoff:
        "Everyone using the dashboard needs a Google account. For a self-hosted CMS with a small editorial team that is a reasonable requirement.",
    },
  ],
  tradeoffs: [
    "Rich text is harder than it looks. The editor has to produce something structured enough to serve through an API, not just HTML that happens to render correctly in one place.",
    "Supporting two API styles doubles the surface area. Sharing the service layer keeps the logic in one place, but both interfaces still need to be kept current as the schema changes.",
    "Self-hosting shifts work onto whoever runs it. Database, deployment, and updates all become their responsibility. That is the trade for keeping the content and infrastructure fully under their control.",
  ],
  stack: [
    { group: "Admin Dashboard", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
    { group: "Backend", items: ["NestJS", "GraphQL", "REST API"] },
    { group: "Data", items: ["Prisma", "PostgreSQL"] },
    { group: "Authentication", items: ["Google OAuth", "API keys"] },
    { group: "Deployment", items: ["Vercel"] },
  ],
  outcome: [
    "A working headless CMS with a Next.js admin dashboard and a NestJS content API",
    "Content delivery over both REST and GraphQL from the same services",
    "Google OAuth for dashboard access and generated API keys for applications",
    "A self-hostable setup running on PostgreSQL rather than a managed content platform",
    "A live demo that can be opened without local setup",
  ],
  learned: [
    "Building the admin against the public API is a good forcing function. Any gap in the API shows up immediately as something the dashboard cannot do.",
    "Separating human authentication from machine authentication early avoids awkward workarounds later, when an application needs access but should not have a user session.",
    "Supporting two API styles is only sustainable if they share the layer underneath. Duplicating the logic would have guaranteed they drift apart.",
  ],
  imageAlt: "MiniList headless CMS admin dashboard showing content management and editing tools",
  relatedSlugs: ["social-media-backend-api", "real-time-chat-application"],
  internalLinks: [
    {
      sentence:
        "This project brings together most of the stack I use day to day, with Next.js and NestJS on either side and Prisma and PostgreSQL underneath.",
      anchor: "See the full stack I build with",
      href: "/skills/",
    },
    {
      sentence: "There are more full-stack products and backend systems in the rest of my work.",
      anchor: "Browse all of my projects",
      href: "/work/",
    },
  ],
  seo: {
    title: "MiniList - Headless CMS | Next.js, NestJS & PostgreSQL | Jay Patel",
    description:
      "A self-hostable headless CMS with a Next.js admin dashboard and NestJS API, covering rich text editing, Google OAuth, API keys and REST plus GraphQL delivery.",
    ogTitle: "MiniList - Headless CMS | Next.js, NestJS & PostgreSQL",
    ogDescription:
      "A full-stack headless CMS built with Next.js, NestJS, Prisma and PostgreSQL, with rich text editing, author management, API keys and content delivery over REST and GraphQL.",
    primaryTopic: "Headless CMS",
    secondaryTopics: [
      "Next.js admin dashboard",
      "NestJS API",
      "content management system",
      "Prisma and PostgreSQL",
      "GraphQL content delivery",
      "Google OAuth",
      "API key authentication",
    ],
  },
};
