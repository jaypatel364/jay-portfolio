import type { ProjectDetail } from "./types";

export const minilistHeadlessCmsDetail: ProjectDetail = {
  slug: "minilist-headless-cms",
  heading: "MiniList: A Self-Hosted Headless CMS Built on Next.js and NestJS",
  intro:
    "A headless CMS solves one problem well: it gives you somewhere to write content that any website or app can then pull through an API. MiniList takes that idea and splits it into two pieces. A Next.js admin dashboard handles writing and organizing, while a NestJS backend stores everything and serves it back out. Because the whole thing runs on your own PostgreSQL instance, you can self-host it end to end and never touch a managed content platform.\n\nYou can try the live demo or browse the source code to see how the two halves talk to each other. This project sits next to other full-stack work in the project portfolio, and it's fairly representative of the stack I reach for most often.",
  overview:
    "The dashboard side of this headless content management system covers writing posts, managing author profiles, filling in SEO fields, and reading basic analytics, all through a rich text editor that doesn't force writers to think about markup. Everything gets stored in PostgreSQL through Prisma, then served back out over both REST and GraphQL, so whoever's consuming the content picks whichever style actually fits their app.\n\nAccess splits cleanly into two paths. People sign into the dashboard through Google OAuth. Apps reading content instead use generated API keys, which keeps human sessions and machine access from ever tangling together.\n\nWhat makes building a CMS interesting is that it serves two audiences pulling in different directions. Writers want an editor that feels effortless. Developers want an API that never surprises them. MiniList tries to give both groups exactly what they need without either one compromising the other.",
  role: [
    "Built the admin dashboard in Next.js, including the rich text editing experience",
    "Built the NestJS backend and the content delivery API",
    "Designed the PostgreSQL schema in Prisma for posts, authors, and SEO fields",
    "Implemented Google OAuth for dashboard sign-in",
    "Added API key generation so apps can read content without a user session",
    "Exposed content over both REST and GraphQL",
  ],
  problem:
    "Writers want something that feels natural, with zero thought given to how data gets structured underneath. Developers want a stable content API with a response shape they can trust every single time. Those two groups also need fundamentally different access: a person logging in has nothing in common with an app pulling content on a cron schedule.\n\nSo the real task was one system serving both groups well, without the editor experience leaking into API design decisions, or the reverse. That's more or less the whole idea behind an API-first content management system like this one.",
  build:
    "The Next.js dashboard is where content gets written. It holds the editor, the author and SEO forms, and the analytics views, and critically, it talks to the NestJS backend exactly the way any outside app would. It never touches the database directly.\n\nNestJS handles storage and delivery on the backend side of this headless CMS. Prisma defines the schema for posts, authors, and SEO metadata, then generates a typed PostgreSQL client from it. Content goes out through both a REST API and a GraphQL API, and both routes call the same underlying services, so their behavior can't quietly drift apart over time.\n\nAuthentication splits by who's asking. Google OAuth covers dashboard sign-ins, which means no stored passwords anywhere in the system. API keys cover apps reading content, and each key gets created and revoked independently, with no connection to any individual user account.\n\nSince it all runs on your own PostgreSQL database, this works as a genuinely self-hosted CMS rather than depending on a third-party managed platform. For more on how this connects to the rest of my work, see my full-stack development skills and PostgreSQL and Prisma skills.",
  features: [
    {
      title: "Rich text editing",
      description:
        "Writers format posts without ever touching raw markup. How the content actually gets stored underneath stays entirely out of their way.",
    },
    {
      title: "Blog and author management",
      description:
        "Posts and author profiles are managed separately, then linked. An author's details live in one place, so updating a bio doesn't mean editing every post they've ever written.",
    },
    {
      title: "API key generation",
      description:
        "Apps get their own keys for reading content, completely separate from user accounts. Revoking one app's access never touches anyone's login.",
    },
    {
      title: "Google OAuth sign-in",
      description:
        "No stored passwords, and no reset flow to build and then maintain indefinitely.",
    },
    {
      title: "SEO fields",
      description:
        "Every post carries its own title and description metadata, so a site pulling that content never has to guess at it from the body text.",
    },
    {
      title: "REST and GraphQL delivery",
      description:
        "A site pulling a simple list of posts calls REST. An app needing specific nested fields calls GraphQL. Same content, two interfaces.",
    },
    {
      title: "Analytics",
      description:
        "Content activity shows up directly in the dashboard, so writers can see what's happening without leaving the admin panel.",
    },
  ],
  architecture: {
    layers: [
      "Next.js admin dashboard",
      "NestJS API",
      "REST or GraphQL layer",
      "Prisma",
      "PostgreSQL",
    ],
    explanation:
      "The Next.js dashboard runs as its own separate app from the NestJS backend, and it calls the exact same API any outside consumer would use. That separation was deliberate: if the dashboard can do everything it needs through the public API, that's proof the API is complete enough for outside apps too.\n\nRoughly, requests flow through the Next.js admin dashboard, into the NestJS API, through a REST or GraphQL layer depending on the caller, down through Prisma, and finally into PostgreSQL.",
  },
  decisions: [
    {
      title: "Keeping the dashboard as its own Next.js app",
      why: "Keeping the dashboard as its own separate Next.js app, rather than baking it into the backend, forced it to consume the same content API any external client would use. That kept the API honest, since there was no private shortcut only the admin knew how to use.",
      tradeoff:
        "It does mean two apps to deploy and keep synchronized, but in exchange, the dashboard proves every day that the public API actually works.",
    },
    {
      title: "Offering both REST and GraphQL",
      why: "Offering both REST and GraphQL wasn't about covering every base for its own sake. Different consumers genuinely want different things: a simple site pulling a post list is happier with REST, while an app needing nested fields does better with GraphQL. Supporting both means nobody has to twist their integration to fit one particular style.",
      tradeoff:
        "The cost is maintaining two interfaces, which gets manageable by pointing both at the same underlying services, so behavior is defined once and just exposed twice.",
    },
    {
      title: "Separating API keys from user accounts",
      why: "Separating API keys from user accounts came from a simple realization: an app shouldn't need a full user session just to read published content, and cutting off one misbehaving app should never touch anyone's personal login.",
      tradeoff:
        "That does mean building and reasoning about two separate authentication paths, where a single shared mechanism would obviously have been simpler.",
    },
    {
      title: "Google OAuth over custom password auth",
      why: "Choosing Google OAuth over building custom password auth avoided dragging hashing, reset flows, and an ongoing security burden into the codebase. OAuth lifts all of that out entirely.",
      tradeoff:
        "The trade-off is that everyone using the dashboard needs a Google account, which is a reasonable ask for a self-hosted CMS run by a small editorial team.",
    },
  ],
  tradeoffs: [
    "Rich text is harder to get right than it looks from the outside. The editor has to emit something structured enough to serve reliably through an API, not just HTML that happens to render correctly in one specific place.",
    "Supporting two API styles effectively doubles the surface area that needs attention whenever the schema changes. A shared service layer keeps the core logic in one place, but both REST and GraphQL still need updating in lockstep.",
    "Self-hosting shifts real work onto whoever runs the system: the database, the deployment, and every future update all land on them directly. That's simply the cost of keeping content and infrastructure fully in your own hands instead of handing it to a managed platform.",
  ],
  stack: [
    { group: "Admin dashboard", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
    { group: "Backend", items: ["NestJS", "GraphQL", "REST API"] },
    { group: "Data", items: ["Prisma", "PostgreSQL"] },
    { group: "Auth", items: ["Google OAuth", "API keys"] },
    { group: "Deployment", items: ["Vercel"] },
  ],
  outcome: [
    "A working headless CMS with a Next.js admin dashboard and a NestJS content API.",
    "Content delivery through both REST and GraphQL, both backed by the exact same services underneath.",
    "Google OAuth for people, generated API keys for apps.",
    "A fully self-hostable setup running on PostgreSQL, and a hosted demo you can try without any local setup at all.",
  ],
  learned: [
    "Building the admin dashboard against the public API turned out to be a genuinely useful forcing function. Any gap in the content API shows up immediately as something the dashboard simply can't do, rather than staying hidden until an outside developer hits it first.",
    "Splitting human and machine authentication early saved a lot of awkward workarounds later, particularly once an app needed read access without any business holding a full user session.",
    "Two API styles only stay maintainable if they share the same service layer underneath. Duplicate that logic across a REST implementation and a GraphQL implementation, and the two will drift apart from each other eventually, more or less guaranteed.",
  ],
  faqs: [
    {
      question: "What exactly is a headless CMS?",
      answer:
        "A headless CMS separates content writing from content display. Instead of rendering pages itself, it stores content and exposes it through an API, letting any website or app pull that content in and present it however it needs to.",
    },
    {
      question: "How does MiniList deliver content?",
      answer:
        "MiniList stores content in PostgreSQL through Prisma, then serves it through both a REST API and a GraphQL API from the same underlying services. A site needing a simple post list can use REST, while an app needing specific nested fields can use GraphQL instead.",
    },
    {
      question: "Is MiniList really self-hosted?",
      answer:
        "Yes. It runs on your own PostgreSQL instance rather than a third-party managed service, which makes it a genuinely self-hosted headless CMS. Your content and your database stay under your own control.",
    },
    {
      question: "How does authentication work for people versus apps?",
      answer:
        "People sign into the dashboard through Google OAuth, avoiding stored passwords entirely. Apps that read content instead use generated API keys, created and revoked independently of any user account, so cutting off an app never affects a person's login.",
    },
  ],
  imageAlt: "MiniList headless CMS admin dashboard showing content management and editing tools",
  relatedSlugs: ["social-media-backend-api", "real-time-chat-application"],
  internalLinks: [
    {
      sentence:
        "Most of my day-to-day stack shows up in MiniList, with Next.js and NestJS on either side and Prisma sitting over PostgreSQL in the middle. Read more through my",
      anchor: "full-stack skills",
      href: "/skills/",
    },
    {
      sentence:
        "More full-stack products and backend systems sit next to this one in the portfolio.",
      anchor: "Explore the rest of the work",
      href: "/work/",
    },
    {
      sentence: "Or take a look at the",
      anchor: "full-stack web development services",
      href: "/services/full-stack-development/",
    },
  ],
  seo: {
    title: "MiniList: Open-Source Headless CMS in Next.js and NestJS",
    description:
      "MiniList is a self-hosted headless CMS with a Next.js dashboard and NestJS API, serving content over REST and GraphQL on your own PostgreSQL.",
    ogTitle: "MiniList: Open-Source Headless CMS in Next.js and NestJS",
    ogDescription:
      "MiniList is a self-hosted headless CMS with a Next.js dashboard and NestJS API, serving content over REST and GraphQL on your own PostgreSQL.",
    primaryTopic: "Headless CMS",
    secondaryTopics: [
      "Next.js admin dashboard",
      "NestJS API",
      "Prisma and PostgreSQL",
      "REST and GraphQL",
      "Google OAuth",
      "API key authentication",
      "Self-hosted CMS",
    ],
  },
};
