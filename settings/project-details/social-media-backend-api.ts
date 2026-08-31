import type { ProjectDetail } from "./types";

export const socialMediaBackendApiDetail: ProjectDetail = {
  slug: "social-media-backend-api",
  intro:
    "This is the backend for a social network: the part that stores posts, tracks who follows whom, and decides what shows up in a feed. There is no frontend here; it is a GraphQL API built with NestJS, Prisma, and PostgreSQL. Instead of showing the newest posts first, the feed uses a hotScore that balances how popular a post is against how old it is.",
  overview:
    "The API covers the features you would expect from an Instagram-style product: creating posts, liking them, following other accounts, receiving notifications, and signing in. Everything is exposed through GraphQL, so a client asks for the exact fields it needs instead of receiving fixed REST responses.\n\nThe part I spent the most thought on was the feed. Sorting by newest is easy but produces a poor experience, because a post from a minute ago outranks something far more popular from this morning. The hotScore approach combines engagement with recency, so posts that people actually interacted with stay visible for a while before decaying.\n\nThe codebase is organised as a modular monolith: separate modules per feature, one deployable application.",
  role: [
    "Designed the GraphQL schema: types, queries, and mutations",
    "Modelled the database in Prisma and PostgreSQL, including the follow relationships",
    "Built the feature modules for posts, likes, follows, and notifications",
    "Implemented JWT authentication and protected the resolvers that need it",
    "Wrote the hotScore ranking used to order the feed",
    "Deployed the API with a public GraphQL endpoint",
  ],
  problem:
    "Social features look simple from the outside but the data relationships are not. A follow is a link between two users in the same table. A feed has to pull posts from everyone a user follows, then order them sensibly. Likes and notifications create more connections on top of that. The main problem was modelling those relationships in PostgreSQL so the feed could be assembled without the query becoming unmanageable, and keeping the code organised as features were added.",
  build:
    "I used NestJS because its module system matches how this kind of product grows. Posts, likes, follows, notifications, and auth each live in their own module with their own resolvers and services, so a change to notifications does not reach into post logic.\n\nPrisma sits between the modules and PostgreSQL. The schema defines users, posts, likes, follows, and notifications along with the relations between them, and Prisma generates typed client code from that schema, so a query that asks for a field that does not exist fails at compile time.\n\nGraphQL is the only interface. Each module contributes its own resolvers, which are merged into one schema. Authentication uses JWT: signing in returns a token, and protected resolvers check it before running.\n\nThe feed query gathers posts from the accounts a user follows and orders them by hotScore rather than by creation time.",
  features: [
    {
      title: "Posts and Likes",
      description:
        "Users can create posts and like them. Like counts feed into the ranking, so engagement affects what appears in the feed rather than just sitting on the post as a number.",
    },
    {
      title: "Follow Relationships",
      description:
        "Accounts can follow each other, and those links decide whose posts appear in a given feed. It is a self-referencing relationship between users, which is one of the trickier things to model well.",
    },
    {
      title: "Ranked Feed",
      description:
        "The feed uses a hotScore that weighs engagement against how recently a post was made. A popular post stays visible longer, and a brand new post with no interaction does not automatically outrank everything else.",
    },
    {
      title: "Notifications",
      description:
        "Actions like a like or a new follower create a notification record for the affected user, so the client can show activity without polling for changes across every entity.",
    },
    {
      title: "JWT Authentication",
      description:
        "Signing in returns a token that the client sends with later requests. Resolvers that touch a user's own data check that token before doing anything.",
    },
    {
      title: "GraphQL Schema",
      description:
        "Clients request exactly the fields they need in one call. For a social feed this matters, because a list of posts, their authors, and their like counts becomes a single query rather than several REST round trips.",
    },
  ],
  architecture: {
    layers: [
      "GraphQL Client",
      "NestJS GraphQL Layer",
      "Feature Modules (Posts, Likes, Follows, Notifications, Auth)",
      "Prisma ORM",
      "PostgreSQL",
    ],
    explanation:
      "A client sends a GraphQL query to the NestJS application. NestJS routes it to the resolver in the relevant feature module, which calls its service for the actual logic. Services talk to PostgreSQL through Prisma. Everything runs as one deployable application, a modular monolith rather than separate services, so the boundaries exist in the code without the operational cost of running several servers.",
  },
  decisions: [
    {
      title: "A modular monolith instead of microservices",
      why: "The features are closely related. A like touches posts, users, and notifications. Splitting those into separate services would have meant network calls between things that belong together. NestJS modules give clear boundaries inside one application.",
      tradeoff:
        "Everything deploys together, so a change to one module means redeploying the whole API. For a project this size that is a much smaller cost than running and coordinating multiple services.",
    },
    {
      title: "GraphQL instead of REST",
      why: "Social data is deeply connected. A feed needs posts, their authors, and their like counts. With REST that is several endpoints, or one endpoint returning more than the client needs. GraphQL lets the client describe the shape it wants.",
      tradeoff:
        "GraphQL brings its own problems: query cost is harder to predict, and nested queries can cause repeated database lookups if you are not careful about how resolvers fetch data.",
    },
    {
      title: "hotScore ranking instead of a reverse-chronological feed",
      why: "Sorting by newest is the simplest thing to build and the worst thing to read. Combining engagement with recency keeps posts people responded to visible while still letting new content through.",
      tradeoff:
        "Ranked feeds are harder to reason about than a timeline. When a post does not appear where you expect, you have to check the score rather than just the timestamp.",
    },
    {
      title: "Prisma as the database layer",
      why: "The schema is the single definition of the data model, and the generated client is typed. With relationships this interconnected, having the compiler catch a wrong field name is worth a lot.",
      tradeoff:
        "Complex queries sometimes need raw SQL, and you give up some control over exactly what gets executed compared to writing queries by hand.",
    },
  ],
  tradeoffs: [
    "Modelling follows meant a relationship from users back to users. Getting that right early mattered, because the feed query depends on it and changing it later would have touched everything.",
    "Nested GraphQL queries can trigger repeated database calls for related records. It is the kind of problem that only appears once the data grows, so it needs attention at the query layer rather than in the resolvers.",
    "The hotScore formula is a judgement call, not a fact. It behaves reasonably, but any ranking like this needs adjusting once you can see how real content performs.",
  ],
  stack: [
    { group: "API", items: ["NestJS", "GraphQL", "TypeScript"] },
    { group: "Data", items: ["Prisma", "PostgreSQL"] },
    { group: "Authentication", items: ["JWT"] },
    { group: "Deployment", items: ["Render"] },
  ],
  outcome: [
    "A working GraphQL API covering posts, likes, follows, notifications, and authentication",
    "A feed ordered by hotScore rather than a plain reverse-chronological list",
    "A relational schema in PostgreSQL that handles follow relationships and engagement",
    "A public GraphQL endpoint where the schema can be explored directly",
  ],
  learned: [
    "Database modelling has to happen before the API design, not alongside it. The follow relationship shaped every query that came after it.",
    "Module boundaries are worth setting up early. Once posts, likes, and notifications each had their own module, adding features stopped touching unrelated code.",
    "GraphQL removes over-fetching but replaces it with a query-cost problem you have to actively manage.",
  ],
  imageAlt:
    "Social media backend API built with NestJS and GraphQL, showing the GraphQL schema explorer",
  relatedSlugs: ["minilist-headless-cms", "real-time-chat-application"],
  internalLinks: [
    {
      sentence:
        "Backend and API work like this is a large part of what I do, including NestJS, GraphQL, Prisma, and PostgreSQL.",
      anchor: "See the technologies I work with",
      href: "/skills/",
    },
    {
      sentence: "There are more backend and full-stack projects alongside this one.",
      anchor: "Browse all of my work",
      href: "/work/",
    },
  ],
  seo: {
    title: "Social Media Backend API | NestJS, GraphQL & PostgreSQL | Jay Patel",
    description:
      "A social media backend built with NestJS, GraphQL, Prisma and PostgreSQL, covering posts, likes, follows, notifications, JWT auth and a hotScore ranked feed.",
    ogTitle: "Social Media Backend API | NestJS, GraphQL & PostgreSQL",
    ogDescription:
      "A modular NestJS GraphQL backend with posts, likes, follows, notifications, JWT authentication and a feed ranked by hotScore instead of timestamp.",
    primaryTopic: "NestJS GraphQL Backend API",
    secondaryTopics: [
      "GraphQL API",
      "NestJS modular monolith",
      "Prisma ORM",
      "PostgreSQL database design",
      "JWT authentication",
      "feed ranking",
      "social graph",
    ],
  },
};
