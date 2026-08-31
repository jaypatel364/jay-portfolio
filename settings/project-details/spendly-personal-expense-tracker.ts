import type { ProjectDetail } from "./types";

export const spendlyPersonalExpenseTrackerDetail: ProjectDetail = {
  slug: "spendly-personal-expense-tracker",
  intro:
    "Spendly is a personal expense tracker. You log what you spend, set a monthly budget, and see where the money actually went. It also imports spending history from CSV and Excel files, so you are not stuck typing in months of past transactions. It is built with TanStack Start and React on the front, and Supabase with PostgreSQL row-level security behind it.",
  overview:
    "The application is built around a dashboard: totals for the month, a six-month trend, and a breakdown by category. Logging an expense is meant to take a couple of seconds, because a tracker that is slow to use stops getting used.\n\nImport is the other half. Most people already have spending history in a bank export, so Spendly reads CSV and Excel files and lets you map their columns to its own fields. Exports work the other way round, so whatever filter is applied on screen is what gets exported.\n\nThe technically interesting part is privacy. Expense data is personal, so access is enforced by PostgreSQL row-level security rather than by application code. The database itself refuses to return another user's rows.",
  role: [
    "Built the application with TanStack Start and React",
    "Designed the dashboard, including the trend and category charts with Recharts",
    "Built the CSV and Excel import flow with column mapping",
    "Set up Supabase Auth and the PostgreSQL row-level security policies",
    "Handled server state and caching with TanStack Query",
    "Added schema validation with Zod for form input and imported rows",
  ],
  problem:
    "Two things usually make expense trackers fail. Logging an expense takes too long, so people stop doing it. And starting from an empty app is discouraging when you already have months of history sitting in a bank export. So the app needed fast entry and a real import path. Underneath both, there was a harder requirement: expense data is private, and a bug in a query should never be able to show one person another person's spending.",
  build:
    "TanStack Start handles the application shell and routing, with React for the interface and Tailwind for styling. TanStack Query manages anything that comes from the server. It caches results and refetches them, so the dashboard does not reload everything after each new expense.\n\nSupabase provides both authentication and the PostgreSQL database. Rather than filtering by user in application queries, access is enforced with row-level security policies on the tables themselves. A query for expenses only ever returns the rows belonging to the signed-in user, because the database applies that rule before the application sees anything.\n\nImport reads CSV and Excel files and asks you to map their columns to Spendly's fields, since no two bank exports use the same headers. Zod validates rows during import and input in the forms, so malformed data is caught before it reaches the database.\n\nCharts are built with Recharts: monthly totals, a six-month trend, and a category breakdown.",
  features: [
    {
      title: "Fast Expense Logging",
      description:
        "Adding an expense is a short form that takes a few seconds. This matters more than it sounds, because the main reason people abandon expense trackers is that logging feels like a chore.",
    },
    {
      title: "Monthly Budgets",
      description:
        "You set a budget for the month and the dashboard shows spending against it, so the number has context rather than being a total on its own.",
    },
    {
      title: "CSV and Excel Import",
      description:
        "Existing spending history can be imported from a bank export. Since every bank formats things differently, you map their columns to Spendly's fields during import rather than being forced into one fixed format.",
    },
    {
      title: "Filtered Export",
      description:
        "Whatever filter is applied on screen is what gets exported in one click, so you can pull out a single category or date range instead of the whole dataset.",
    },
    {
      title: "Dashboard and Charts",
      description:
        "Totals, a six-month trend, and a category breakdown, all built with Recharts. The trend is the view that makes patterns visible, since a single month rarely tells you much.",
    },
    {
      title: "Private by Default",
      description:
        "Each user's expenses are isolated by PostgreSQL row-level security. The rule lives in the database, not in application code, so it applies to every query regardless of how the data is requested.",
    },
  ],
  architecture: {
    layers: [
      "TanStack Start / React Client",
      "TanStack Query (server state)",
      "Supabase Client",
      "Supabase Auth + Row-Level Security",
      "PostgreSQL",
    ],
    explanation:
      "There is no separate backend service. The TanStack Start application talks to Supabase directly, and TanStack Query sits in between to cache server data and keep the dashboard from refetching everything on every change. Supabase handles sign-in and gives each request the identity of the signed-in user. PostgreSQL row-level security policies then decide which rows that user can see. The security boundary is in the database, which is what makes going without a custom API layer a reasonable choice here.",
  },
  decisions: [
    {
      title: "Row-level security instead of filtering in application code",
      why: "Every query in an app like this has to be scoped to one user, and doing that in application code means every single query is a chance to get it wrong. Putting the policy on the table means the database enforces it once, for everything.",
      tradeoff:
        "Policies are less obvious than a visible filter in the code, since you have to know to look in the database to understand why a query returns what it does. That is worth it for data this personal.",
    },
    {
      title: "Supabase instead of a custom backend",
      why: "The application needed authentication, a PostgreSQL database, and per-user access rules. Supabase provides all three, and row-level security meant the access rules could live in the database rather than in an API layer built to enforce them.",
      tradeoff:
        "It ties the project to Supabase's client and its way of doing things. If the logic later needs to grow beyond what policies can express, some of it would have to move into a backend service.",
    },
    {
      title: "Column mapping on import instead of a fixed format",
      why: "Bank exports have no shared standard. The same information appears under different headers in different files. Asking the user to map columns once is far more practical than asking them to reformat a spreadsheet.",
      tradeoff:
        "The import flow has an extra step, so it is not a single click. Without it, most real bank exports would simply fail to import.",
    },
    {
      title: "Zod for validation",
      why: "Data arrives from two directions, typed into forms and pulled from spreadsheets, and imported rows are much less predictable. One schema validates both paths before anything is written.",
      tradeoff:
        "Schemas need to be kept in step with the database structure, since they are defined separately.",
    },
  ],
  tradeoffs: [
    "Imported files are messy in ways forms are not: missing values, unexpected date formats, amounts stored as text. Validating at import instead of at display time keeps bad data out of the database entirely.",
    "Without a custom backend, business logic that policies cannot express has nowhere to live. That is an accepted limit of this architecture, not something solved by it.",
    "The project is still in progress, so features are being added and refined rather than being finished and frozen.",
  ],
  stack: [
    { group: "Frontend", items: ["TanStack Start", "React", "TypeScript", "Tailwind CSS"] },
    { group: "Data & State", items: ["TanStack Query", "Zod"] },
    { group: "Backend", items: ["Supabase", "PostgreSQL", "Row-Level Security"] },
    { group: "Visualisation", items: ["Recharts"] },
  ],
  outcome: [
    "A working expense tracker with fast logging, monthly budgets, and a dashboard",
    "CSV and Excel import with column mapping, plus filtered export",
    "Per-user data isolation enforced by PostgreSQL row-level security",
    "Totals, a six-month trend, and category breakdowns built with Recharts",
    "A live demo available to try",
  ],
  learned: [
    "Putting access rules in the database rather than in application code removes a whole class of mistakes. Every query inherits the rule instead of each one having to remember it.",
    "Import is where real-world data stops being tidy. Handling that properly took more thought than any of the dashboard work.",
    "Skipping a custom backend is a reasonable choice when the security boundary already lives somewhere solid, but it does set a ceiling on where complex logic can go later.",
  ],
  imageAlt:
    "Spendly expense tracker dashboard showing monthly totals, spending trends and category breakdown charts",
  relatedSlugs: ["minilist-headless-cms", "real-time-chat-application"],
  internalLinks: [
    {
      sentence:
        "React, TypeScript, PostgreSQL, and data-heavy interfaces come up across most of what I build.",
      anchor: "See the technologies I work with",
      href: "/skills/",
    },
    {
      sentence: "This sits alongside several other full-stack applications and APIs.",
      anchor: "Browse all of my work",
      href: "/work/",
    },
  ],
  seo: {
    title: "Spendly Expense Tracker | React, TanStack & Supabase | Jay Patel",
    description:
      "A personal expense tracker built with TanStack Start, React and Supabase, with budgets, CSV and Excel import, charts and PostgreSQL row-level security.",
    ogTitle: "Spendly Expense Tracker | React, TanStack Start & Supabase",
    ogDescription:
      "A personal expense tracker with budgets, CSV and Excel import, and spending charts, built on TanStack Start, React and Supabase with PostgreSQL row-level security.",
    primaryTopic: "Personal Expense Tracker Application",
    secondaryTopics: [
      "TanStack Start",
      "React dashboard",
      "Supabase",
      "PostgreSQL row-level security",
      "CSV and Excel import",
      "TanStack Query",
      "Recharts",
      "Zod validation",
    ],
  },
};
