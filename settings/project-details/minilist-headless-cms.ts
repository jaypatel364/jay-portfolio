import type { ProjectDetail } from "./types";

export const minilistHeadlessCmsDetail: ProjectDetail = {
  slug: "minilist-headless-cms",
  intro:
    "MiniList is a headless CMS: a place to write and manage content, which then reaches any website or app through an API. It comes in two halves. A Next.js admin dashboard is where content gets written, and a NestJS backend stores it and serves it out. The whole thing is self-hostable, so your content and your database stay wherever you put them.",
  overview:
    "The admin side covers writing and organizing content: a rich text editor, blog posts, author profiles, SEO fields, and analytics. The backend keeps all of it in PostgreSQL through Prisma. It then serves that content over both REST and GraphQL, so whoever consumes it picks whichever style suits their app.\n\nAccess works two ways. People sign in to the dashboard with Google OAuth. Apps that read content use generated API keys, which keeps human sessions and machine access apart.\n\nThe interesting part of building a CMS is the split audience. Writers want an editor that feels good. Developers want an API that never surprises them. You are serving both at once.",
  role: [
    "Built the admin dashboard in Next.js, including the rich text editing experience",
    "Built the NestJS backend and the content delivery API",
    "Designed the PostgreSQL schema in Prisma for posts, authors, and SEO fields",
    "Implemented Google OAuth for dashboard sign-in",
    "Added API key generation so apps can read content without a user session",
    "Exposed content over both REST and GraphQL",
  ],
  problem:
    "A CMS serves two audiences whose needs pull in opposite directions. Writers want an editor that feels natural, with no thinking about data structures. Developers want a stable API and no surprises in the response shape. The two groups also need very different access. A person signing in is nothing like an app fetching content on a schedule. So the job was one system that handles both, without the editor bleeding into the API design or the other way around.",
  build:
    "The Next.js dashboard is where content gets created. It holds the rich text editor, the forms for authors and SEO fields, and the analytics views. It talks to the NestJS backend, never to the database directly.\n\nNestJS handles storage and delivery. Prisma defines the schema for posts, authors, and SEO metadata, then generates a typed PostgreSQL client. Content goes out over a REST API and GraphQL, and both call the same services underneath, so their behavior cannot drift apart.\n\nAuthentication splits by audience. Google OAuth covers people signing in to the dashboard, which means no stored passwords. API keys cover apps reading content, and each key is created and revoked on its own, with no tie to a user account.\n\nThe whole stack runs on your own PostgreSQL instance, so you can self-host it and skip a managed content platform entirely.",
  features: [
    {
      title: "Rich Text Editing",
      description:
        "Writers format posts in a rich text editor, with no raw markup to deal with. How the content gets stored underneath stays out of their way.",
    },
    {
      title: "Blog and Author Management",
      description:
        "Posts and author profiles are managed apart, then linked. An author's details live in one place, so nothing gets copied onto every post they write.",
    },
    {
      title: "API Key Generation",
      description:
        "Apps get their own keys for reading content. Keys sit apart from user accounts, so cutting off an app leaves everyone's login untouched.",
    },
    {
      title: "Google OAuth Sign-In",
      description:
        "Dashboard access runs on Google OAuth. No stored passwords, and no reset flow to build and then maintain.",
    },
    {
      title: "SEO Fields",
      description:
        "Every post carries its own SEO metadata. The site pulling that content gets real titles and descriptions, so it never has to guess them from the body text.",
    },
    {
      title: "REST and GraphQL Delivery",
      description:
        "The same content is available through both interfaces. A site that wants a list of posts calls REST. A site that needs specific nested fields calls GraphQL.",
    },
    {
      title: "Analytics",
      description:
        "Content activity shows up right in the dashboard, so writers can see what is happening without leaving the admin.",
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
      "The Next.js dashboard is a separate app from the NestJS backend, and it calls the same API any other consumer would. That was deliberate. If the admin can do everything it needs through the public API, then the API is complete enough for outside apps too. NestJS takes requests through the REST or GraphQL layer, both of which call the same services. Prisma handles the PostgreSQL access.",
  },
  decisions: [
    {
      title: "Separating the admin from the API",
      why: "Keeping the dashboard as its own Next.js app forced it to consume the same API as any external client. That kept the API honest, with no private gaps that only the admin knew how to work around.",
      tradeoff:
        "Two apps to deploy and keep in sync. In return, the admin proves the API works every single day.",
    },
    {
      title: "Offering both REST and GraphQL",
      why: "Different consumers want different things. A simple site pulling a list of posts is happier with REST. An app that needs nested fields does better with GraphQL. Supporting both means nobody has to bend their integration to suit me.",
      tradeoff:
        "Two interfaces to maintain. I cut that cost by pointing both at the same services, so behavior is defined once and merely exposed twice.",
    },
    {
      title: "API keys separate from user accounts",
      why: "Apps and people need different kinds of access. An app should not need a user session to read published content, and cutting off that app should not touch anyone's login.",
      tradeoff:
        "Two authentication paths to build and reason about, where one shared mechanism would have been simpler.",
    },
    {
      title: "Google OAuth over custom passwords",
      why: "Storing passwords drags in hashing, reset flows, and a security burden I would rather not carry. OAuth lifts all of that out of the code.",
      tradeoff:
        "Everyone using the dashboard needs a Google account. For a self-hosted CMS with a small editorial team, that is a fair ask.",
    },
  ],
  tradeoffs: [
    "Rich text is harder than it looks. The editor has to emit something structured enough to serve through an API, not just HTML that happens to render in one place.",
    "Two API styles double the surface area. A shared service layer keeps the logic in one place, but both interfaces still need updating as the schema moves.",
    "Self-hosting shifts work onto whoever runs it. The database, the deployment, and the updates all land on them. That is the price of keeping content and infrastructure fully in their own hands.",
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
    "Google OAuth for dashboard access and generated API keys for apps",
    "A self-hostable setup running on PostgreSQL, with no managed content platform involved",
    "A hosted demo of the dashboard, with no local setup required",
  ],
  learned: [
    "Building the admin against the public API is a good forcing function. Any gap in the API turns up straight away as something the dashboard cannot do.",
    "Splitting human and machine authentication early saves you awkward workarounds later, when an app needs access but has no business holding a user session.",
    "Two API styles only stay sustainable if they share the layer underneath. Duplicated logic would have drifted apart, guaranteed.",
  ],
  imageAlt: "MiniList headless CMS admin dashboard showing content management and editing tools",
  relatedSlugs: ["social-media-backend-api", "real-time-chat-application"],
  internalLinks: [
    {
      sentence:
        "MiniList pulls in most of my day-to-day stack, with Next.js and NestJS on either side and Prisma over PostgreSQL underneath.",
      anchor: "Read through the full stack I work in",
      href: "/skills/",
    },
    {
      sentence: "More full-stack products and backend systems sit next to this one.",
      anchor: "Explore the rest of my portfolio",
      href: "/work/",
    },
  ],
  seo: {
    title: "MiniList Headless CMS | Next.js & NestJS | Jay Patel",
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
