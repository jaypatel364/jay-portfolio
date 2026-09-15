import type { ProjectDetail } from "./types";

export const socialMediaBackendApiDetail: ProjectDetail = {
  slug: "social-media-backend-api",
  heading: "Social Media Backend API",
  intro:
    "No frontend ships with this project on purpose. It's a social media backend API, the part that stores posts, tracks who follows whom, and works out what actually lands in someone's feed. Built on NestJS, Prisma, and PostgreSQL, it exposes everything through GraphQL rather than REST. And the feed itself doesn't just show the newest post first. It ranks content with a hotScore that weighs popularity against age.\n\nYou can check the live demo or look through the source code directly. This sits alongside other backend work in the project portfolio, and it's a solid example of what a NestJS GraphQL API looks like once real social features get layered on top.",
  overview:
    "This social media API includes the pieces you'd expect from an Instagram-style backend: posts, likes, follows, notifications, and authentication. Everything runs through a single GraphQL endpoint, so a client asks for exactly the fields it needs instead of getting stuck with whatever shape a REST endpoint happens to return.\n\nThe feed is where most of the actual thought went. Sorting purely by newest post is the obvious approach, and it's also the weakest one, since a post from sixty seconds ago would outrank something genuinely popular from earlier that day. hotScore blends engagement with how recently something was posted instead, so posts people actually reacted to stay visible for a while before naturally fading as newer content takes over.\n\nUnder the hood, this is a modular monolith: separate modules for separate features, shipped as one deployable app rather than a scattering of microservices.",
  role: [
    "Designed the GraphQL schema: types, queries, and mutations",
    "Modeled the database in Prisma and PostgreSQL, including the follow relationships",
    "Built the feature modules for posts, likes, follows, and notifications",
    "Implemented JWT authentication and locked down the resolvers that need it",
    "Wrote the hotScore ranking that orders the feed",
    "Deployed the API with a public GraphQL endpoint",
  ],
  problem:
    "A follow is just a link from one user to another, sitting inside the same table. Simple enough on paper. But a feed then has to gather posts from everyone a given user follows and put them into some sensible order, and likes and notifications stack even more relationships on top of that.\n\nSo the actual engineering challenge in this social network backend wasn't any single feature. It was modeling those relationships correctly in PostgreSQL, keeping the feed query fast even as data grew, and keeping the codebase from turning into a tangle as features kept getting added.",
  build:
    "NestJS made sense here because its module system tends to match how a social product actually grows over time. Posts, likes, follows, notifications, and auth each get their own module, complete with their own resolvers and services, so a change to how notifications work never accidentally touches post logic.\n\nPrisma sits between those modules and PostgreSQL. Its schema defines users, posts, likes, follows, and notifications along with every relation connecting them, and it generates a fully typed client from that definition. Ask for a field that doesn't exist, and the build fails immediately rather than surfacing as a bug later in production.\n\nGraphQL is the only way in. Each module contributes its own resolvers, and NestJS merges them into a single schema. Authentication runs on JWT: signing in hands back a token, and any resolver touching private data checks that token before doing anything else.\n\nThe feed query itself pulls posts from everyone a user follows, then sorts by hotScore rather than creation date. For more on how I approach this kind of relational, API-heavy backend work, take a look at my backend development skills and NestJS and Node.js skills.",
  features: [
    {
      title: "Posts and likes",
      description:
        "Users post and like content, and like counts feed straight into ranking. A like isn't just a number sitting on a post here; it actually shapes what other people see.",
    },
    {
      title: "Follow relationships",
      description:
        "Accounts follow each other, and those links decide whose posts show up in a feed. In the database, this is a self-referencing relationship from the users table back to itself, which was one of the trickier parts to get right.",
    },
    {
      title: "Ranked feed with hotScore",
      description:
        "Engagement and recency get weighed together, so a popular post stays visible for longer while a brand-new post with zero likes doesn't immediately vanish under everything else.",
    },
    {
      title: "Notifications",
      description:
        "A like or a new follower writes one notification record for the affected user. The client reads that single list to show recent activity, no polling across a dozen other tables required.",
    },
    {
      title: "JWT authentication",
      description:
        "Signing in returns a token, and it travels with every subsequent request. Resolvers touching private data check it first.",
    },
    {
      title: "GraphQL schema",
      description:
        "One query pulls posts, their authors, and their like counts together. A REST API would typically need several round trips to assemble the same response.",
    },
  ],
  architecture: {
    layers: [
      "GraphQL client",
      "NestJS GraphQL layer",
      "Feature modules for posts, likes, follows, notifications, and auth",
      "Prisma",
      "PostgreSQL",
    ],
    explanation:
      "A GraphQL query arrives at the NestJS app, gets routed to the resolver inside the right feature module, and that resolver calls its service for the real logic. Services reach PostgreSQL through Prisma. It all deploys as a single app.\n\nThe boundaries between features are real and enforced, but they live inside the code rather than across separate servers, so there's no added infrastructure cost from running several services at once.",
  },
  decisions: [
    {
      title: "Modular monolith instead of microservices",
      why: "Going with a modular monolith instead of microservices came down to how tightly these features actually depend on each other. A single like touches posts, users, and notifications all at once, and splitting those into separate services would mean adding network calls between things that genuinely belong together. NestJS modules give clear internal boundaries without that overhead,",
      tradeoff:
        "though the cost is that everything deploys together; even a small change means redeploying the whole API. At this size, that's a far smaller price than coordinating several separate services would be.",
    },
    {
      title: "GraphQL over REST",
      why: "GraphQL won out over REST largely because social data is so interconnected. A feed needs posts, authors, and like counts all at once, and REST usually forces a choice between several thin endpoints or one bloated one returning more than a client asked for. GraphQL lets the client describe exactly what it wants.",
      tradeoff:
        "The trade-off shows up in query cost, which becomes harder to predict, and in nested queries, which can trigger repeated database lookups if resolvers aren't careful about how they fetch related data.",
    },
    {
      title: "hotScore over reverse-chronological feed",
      why: "Choosing hotScore over a plain reverse-chronological feed came from a simple observation: a timeline is the easiest feed to build and the least interesting one to actually scroll through. Blending engagement with recency keeps good content visible longer while still giving new posts a fair shot at surfacing.",
      tradeoff:
        "It does make the feed harder to reason about, though. When a post lands somewhere unexpected, you have to actually calculate its score rather than glance at a timestamp.",
    },
    {
      title: "Prisma as the database layer",
      why: "Prisma earned its spot as the database layer because the schema acts as a single source of truth, and the generated client is fully typed. With relationships as tangled as follows and likes, catching a typo'd field name at compile time saves real debugging time later.",
      tradeoff:
        "The downside is that genuinely complex queries occasionally still need raw SQL, which means giving up some fine control over exactly what runs against the database.",
    },
  ],
  tradeoffs: [
    "Modeling the follow relationship as a self-reference back to the users table took real care early on, since the entire feed query depends on getting that right. A structural fix later would have rippled through nearly everything downstream.",
    "Nested GraphQL queries can fire off repeated database calls for related records, and that problem only becomes visible once the dataset actually grows. The fix belongs in the query layer itself, not scattered across individual resolvers trying to patch around it.",
    "The hotScore formula, to be honest, is a judgment call more than a settled fact. It behaves reasonably in testing, but any ranking system like this needs ongoing tuning once real content starts moving through it and real usage patterns emerge.",
  ],
  stack: [
    { group: "API", items: ["NestJS", "GraphQL", "TypeScript"] },
    { group: "Data", items: ["Prisma", "PostgreSQL"] },
    { group: "Auth", items: ["JWT"] },
    { group: "Deployment", items: ["Render"] },
  ],
  outcome: [
    "A working GraphQL API covering posts, likes, follows, notifications, and authentication.",
    "A feed ordered by hotScore instead of a plain chronological list.",
    "A relational PostgreSQL schema that actually handles follow relationships and engagement data cleanly.",
    "And a public GraphQL endpoint where you can explore the schema yourself.",
  ],
  learned: [
    "Database modeling has to come before API design, not run alongside it as an afterthought. The follow relationship shaped nearly every query I wrote after it, which is worth knowing before you start planning a social media database from scratch.",
    "Setting up module boundaries early paid off repeatedly. Once posts, likes, and notifications each had their own space, new features stopped bleeding into code they had no business touching.",
    "GraphQL trades over-fetching for a query-cost problem. That's not a one-time fix; it needs continuous attention as the schema and usage patterns evolve.",
  ],
  faqs: [
    {
      question: "What's this social media backend API actually built with?",
      answer:
        "NestJS, GraphQL, Prisma, and PostgreSQL, with JWT handling authentication. It exposes a single GraphQL endpoint covering posts, likes, follows, and notifications, rather than separate REST routes for each.",
    },
    {
      question: "How does the ranking algorithm decide what shows up in the feed?",
      answer:
        "A hotScore blends engagement with how recently something was posted, so a popular post stays visible longer while brand-new content still gets a real chance to surface, instead of everything sorting purely by timestamp.",
    },
    {
      question: "Why GraphQL instead of REST for a social platform?",
      answer:
        "GraphQL lets a client ask for exactly the fields it needs in one request. For a feed, that means posts, authors, and like counts can arrive together in a single query, where REST would typically need several separate calls to build the same response.",
    },
    {
      question: "Is this built as microservices or a monolith?",
      answer:
        "It's a modular monolith. Posts, likes, follows, notifications, and auth each live in their own NestJS module, but the whole thing ships and deploys as one application rather than as separate independently-deployed services.",
    },
  ],
  imageAlt:
    "Social media backend API built with NestJS and GraphQL, showing the GraphQL schema explorer",
  relatedSlugs: ["minilist-headless-cms", "real-time-chat-application"],
  internalLinks: [
    {
      sentence:
        "API work like this, spanning NestJS, GraphQL, Prisma, and PostgreSQL, makes up a large share of what I build. Look through my",
      anchor: "backend development skills",
      href: "/skills/",
    },
    {
      sentence: "There's more backend and full-stack work in the wider portfolio.",
      anchor: "See every project I've shipped",
      href: "/work/",
    },
    {
      sentence: "Or check the",
      anchor: "backend API development services",
      href: "/services/backend-development/",
    },
  ],
  seo: {
    title: "Social Media Backend API: NestJS, GraphQL & Prisma Project",
    description:
      "A social media backend API with posts, follows, and notifications, built on NestJS, GraphQL, Prisma, and PostgreSQL, with a ranked feed algorithm.",
    ogTitle: "Social Media Backend API: NestJS, GraphQL & Prisma Project",
    ogDescription:
      "A social media backend API with posts, follows, and notifications, built on NestJS, GraphQL, Prisma, and PostgreSQL, with a ranked feed algorithm.",
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
