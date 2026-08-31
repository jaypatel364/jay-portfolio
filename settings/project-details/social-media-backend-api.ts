import type { ProjectDetail } from "./types";

export const socialMediaBackendApiDetail: ProjectDetail = {
  slug: "social-media-backend-api",
  intro:
    "This is a social media backend API: the layer that stores posts, tracks who follows whom, and decides what lands in a feed. There is no frontend here at all. It is a GraphQL API built on NestJS, Prisma, and PostgreSQL. The feed does not lead with the newest post either. It ranks by a hotScore that weighs how popular a post is against how old it is.",
  overview:
    "The API covers what you would expect from an Instagram-style product: posts, likes, follows, notifications, and sign-in. Everything goes out through GraphQL. A client asks for the exact fields it needs, so nobody is stuck with a fixed REST response shape.\n\nThe feed took the most thought. Sorting by newest is the easy build and the weak result, because a post from one minute ago will outrank something far more popular from this morning. So hotScore blends engagement with recency. Posts people actually reacted to stay up for a while, then decay.\n\nThe codebase is a modular monolith: one module per feature, one deployable app.",
  role: [
    "Designed the GraphQL schema: types, queries, and mutations",
    "Modeled the database in Prisma and PostgreSQL, including the follow relationships",
    "Built the feature modules for posts, likes, follows, and notifications",
    "Implemented JWT authentication and locked down the resolvers that need it",
    "Wrote the hotScore ranking that orders the feed",
    "Deployed the API with a public GraphQL endpoint",
  ],
  problem:
    "Social features look simple from the outside. The data behind them is not. A follow is a link from one user to another inside the same table. A feed has to gather posts from everyone a user follows, then put them in a sensible order. Likes and notifications pile on more connections. So the real work was modeling those relationships in PostgreSQL, keeping the feed query manageable, and holding the code together as features stacked up.",
  build:
    "I picked NestJS because its module system matches how this kind of product grows. Posts, likes, follows, notifications, and auth each get their own module, with their own resolvers and services. A change to notifications never reaches into post logic.\n\nPrisma sits between those modules and PostgreSQL. The schema defines users, posts, likes, follows, and notifications, plus the relations tying them together. Prisma generates a typed client from it, so asking for a field that does not exist breaks the build.\n\nGraphQL is the only interface. Each module adds its own resolvers, and those merge into a single schema. Auth runs on JWT: signing in returns a token, and protected resolvers check that token before they do anything.\n\nThe feed query pulls posts from the accounts a user follows, then orders them by hotScore instead of creation time.",
  features: [
    {
      title: "Posts and Likes",
      description:
        "Users create posts and like them. Like counts then feed into the ranking, so engagement shapes what surfaces. A like is more than a number sitting on the post.",
    },
    {
      title: "Follow Relationships",
      description:
        "Accounts follow each other, and those links decide whose posts appear in a feed. In the database it is a self-referencing link from users back to users, one of the trickier things to model well.",
    },
    {
      title: "Ranked Feed",
      description:
        "The feed uses a hotScore that weighs engagement against how recent a post is. A popular post stays up longer. A brand new post with no likes does not sail past everything else.",
    },
    {
      title: "Notifications",
      description:
        "A like or a new follower writes a notification record for the user it affects. The client reads that one list to show activity, with no polling across every other table.",
    },
    {
      title: "JWT Authentication",
      description:
        "Signing in returns a token, and the client sends it with every later request. Resolvers that touch a user's own data check that token first.",
    },
    {
      title: "GraphQL Schema",
      description:
        "Clients ask for exactly the fields they need in one call. That matters for a social feed. Posts, their authors, and their like counts arrive in a single query, where REST would need several round trips.",
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
      "A client sends a GraphQL query to the NestJS app. NestJS routes it to the resolver in the right feature module, and that resolver calls its service for the actual logic. Services reach PostgreSQL through Prisma. It all ships as one deployable app. The boundaries between features are real, but they live in the code, so there is no bill for running several servers.",
  },
  decisions: [
    {
      title: "A modular monolith, not microservices",
      why: "These features are closely related. A single like touches posts, users, and notifications. Split those into separate services and you add network calls between things that belong together. NestJS modules draw clear lines inside one app and skip all of that.",
      tradeoff:
        "Everything deploys together, so one small change means redeploying the whole API. At this size that costs far less than running and coordinating several services.",
    },
    {
      title: "GraphQL over REST",
      why: "Social data is deeply connected. A feed needs posts, their authors, and their like counts. REST gives you two options there: several endpoints, or one fat endpoint returning more than the client asked for. GraphQL lets the client describe the shape it wants.",
      tradeoff:
        "GraphQL brings its own problems. Query cost is harder to predict, and nested queries can trigger repeated database lookups if resolvers fetch data carelessly.",
    },
    {
      title: "hotScore ranking over a reverse-chronological feed",
      why: "A plain timeline is the simplest feed to build and the least rewarding to read. Blending engagement with recency keeps good posts visible while new content still gets its chance to surface.",
      tradeoff:
        "A ranked feed is harder to reason about than a timeline. When a post shows up in an odd place, you have to work out its score, not just read its timestamp.",
    },
    {
      title: "Prisma as the database layer",
      why: "The schema is the one definition of the data model, and the client it generates is typed. With relations this tangled, a compiler that catches a wrong field name earns its keep.",
      tradeoff:
        "Complex queries still drop to raw SQL now and then. You also give up some control over exactly what SQL runs.",
    },
  ],
  tradeoffs: [
    "Modeling follows meant a link from users back to users. Getting it right early mattered, because the feed query leans on it and a later change would have touched everything.",
    "Nested GraphQL queries can fire repeated database calls for related records. The problem only shows up once the data grows, and the fix belongs at the query layer, not in the resolvers.",
    "The hotScore formula is a judgment call, not a fact. It behaves sensibly, though any ranking like this needs tuning once you can watch real content move through it.",
  ],
  stack: [
    { group: "API", items: ["NestJS", "GraphQL", "TypeScript"] },
    { group: "Data", items: ["Prisma", "PostgreSQL"] },
    { group: "Authentication", items: ["JWT"] },
    { group: "Deployment", items: ["Render"] },
  ],
  outcome: [
    "A working GraphQL API covering posts, likes, follows, notifications, and authentication",
    "A feed ordered by hotScore instead of a plain reverse-chronological list",
    "A relational PostgreSQL schema that handles follow relationships and engagement",
    "A public GraphQL endpoint where the schema can be explored directly",
  ],
  learned: [
    "Database modeling comes before API design, not alongside it. The follow relationship shaped every query written after it.",
    "Module boundaries are worth setting up early. Once posts, likes, and notifications each had their own module, new features stopped touching unrelated code.",
    "GraphQL solves over-fetching and hands you a query-cost problem in exchange. That one needs active management.",
  ],
  imageAlt:
    "Social media backend API built with NestJS and GraphQL, showing the GraphQL schema explorer",
  relatedSlugs: ["minilist-headless-cms", "real-time-chat-application"],
  internalLinks: [
    {
      sentence:
        "API work makes up a large share of what I do, across NestJS, GraphQL, Prisma, and PostgreSQL.",
      anchor: "Look through my backend skill set",
      href: "/skills/",
    },
    {
      sentence: "There are more APIs and server-side builds in the wider portfolio.",
      anchor: "See every project I have shipped",
      href: "/work/",
    },
  ],
  seo: {
    title: "Social Media Backend API | NestJS & GraphQL | Jay Patel",
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
