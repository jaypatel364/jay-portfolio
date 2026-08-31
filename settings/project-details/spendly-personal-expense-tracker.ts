import type { ProjectDetail } from "./types";

export const spendlyPersonalExpenseTrackerDetail: ProjectDetail = {
  slug: "spendly-personal-expense-tracker",
  intro:
    "Spendly is a personal expense tracker. You log what you spend, set a monthly budget, and see where the money went. It also reads spending history straight from CSV and Excel files, so you skip typing in months of old transactions. The front end runs on TanStack Start and React. Supabase sits behind it, with PostgreSQL row-level security keeping each account's data private.",
  overview:
    "The app is built around one dashboard: totals for the month, a six-month trend, and a breakdown by category. Logging an expense takes a couple of seconds. That speed matters, because a tracker that feels slow stops getting used.\n\nImport is the other half of the product. Most people already have their spending history in a bank export. Spendly reads those CSV and Excel files and lets you map their columns onto its own fields. Export runs the same idea backwards: whatever filter is on screen is what lands in the file.\n\nPrivacy is the part I thought hardest about. Expense data is personal, so PostgreSQL row-level security guards it at the database level, not in app code. The database simply will not hand back another user's rows.",
  role: [
    "Built the application with TanStack Start and React",
    "Designed the dashboard, including the trend and category charts in Recharts",
    "Built the CSV and Excel import flow with column mapping",
    "Set up Supabase Auth and the PostgreSQL row-level security policies",
    "Handled server state and caching with TanStack Query",
    "Added Zod schema validation for form input and imported rows",
  ],
  problem:
    "Two things usually kill an expense tracker. The first is friction: if logging a coffee takes half a minute, people quit within a week. The second is the empty start, because opening a blank app is discouraging when months of your history already sit in a bank export. So Spendly needed quick entry and a working import path. Both of those sat on top of a harder rule. Expense data is private, and one careless query should never expose another person's spending.",
  build:
    "TanStack Start handles the app shell and routing. React builds the interface and Tailwind styles it. TanStack Query owns anything that comes from the server, caching results and refetching on its own. The dashboard picks up a new expense without reloading the whole page.\n\nSupabase covers both sign-in and the PostgreSQL database. Access rules live on the tables themselves as row-level security policies, so app queries never filter by user at all. Ask for expenses and your own rows come back. The database applies that rule first, before any code sees a result.\n\nImport reads CSV and Excel files, then asks you to map their columns onto Spendly's fields. No two banks use the same headers, so a fixed parser would break on the second file you tried. Zod checks form input and imported rows against one schema, which keeps malformed data out of the database.\n\nRecharts draws the three views on the dashboard: monthly totals, the six-month trend, and the category breakdown.",
  features: [
    {
      title: "Fast Expense Logging",
      description:
        "Adding an expense is a short form and a few seconds of typing. That matters more than it sounds. The usual reason people abandon a tracker is that logging starts to feel like a chore.",
    },
    {
      title: "Monthly Budgets",
      description:
        "You set a budget for the month and the dashboard measures spending against it. A total on its own says very little. The same total next to a limit tells you whether to slow down.",
    },
    {
      title: "CSV and Excel Import",
      description:
        "Bring in existing spending history straight from a bank export. Every bank formats its files differently, so you map their columns onto Spendly's fields as part of the import. No spreadsheet cleanup first.",
    },
    {
      title: "Filtered Export",
      description:
        "Whatever filter is on screen is what you get in the file. One click pulls out a single category or a date range, so you are never stuck exporting the whole dataset.",
    },
    {
      title: "Dashboard and Charts",
      description:
        "Totals, a six-month trend, and a category breakdown, all drawn with Recharts. The trend is the view that earns its place. A single month of data rarely tells you much on its own.",
    },
    {
      title: "Private by Default",
      description:
        "PostgreSQL row-level security keeps every account's expenses apart. The rule sits in the database itself. It holds for every query, no matter which part of the app is asking.",
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
      "There is no separate backend service here. The TanStack Start app talks to Supabase directly, with TanStack Query in between as a cache so the dashboard is not refetching everything on every change. Supabase handles sign-in and tags each request with the identity of the signed-in user. PostgreSQL row-level security policies then decide which rows that user can see. Because the security boundary sits in the database, skipping a custom API layer is a fair trade at this size.",
  },
  decisions: [
    {
      title: "Row-level security over filtering in application code",
      why: "Every query in an app like this has to be scoped to one user. Do that in code and each query becomes a fresh chance to get it wrong. Put the policy on the table and the database enforces it once, for everything that touches those rows.",
      tradeoff:
        "A policy is less visible than a filter you can read in the code. You have to know to go look at the table to understand why a query returned what it did. For data this personal, I will take that.",
    },
    {
      title: "Supabase in place of a custom backend",
      why: "The app needed three things: sign-in, a PostgreSQL database, and per-user access rules. Supabase covers all three. Row-level security let the access rules live in the database, which left no API layer to build.",
      tradeoff:
        "It ties the project to Supabase's client and its way of working. If the logic outgrows what a policy can express, part of it has to move into a real backend service.",
    },
    {
      title: "Column mapping at import time",
      why: "Bank exports follow no shared standard. The same information turns up under a different header in every file. Mapping it once during import is quick. Asking someone to rewrite a spreadsheet first is not.",
      tradeoff:
        "Import gains a step and stops being a single click. Drop that step and most real bank exports would simply fail.",
    },
    {
      title: "Zod for validation",
      why: "Data arrives from two directions: typed into a form, or pulled out of a spreadsheet. Spreadsheet rows are far less predictable. One schema checks both paths before anything gets written.",
      tradeoff:
        "The schemas are defined separately from the database, so the two have to be kept in step by hand.",
    },
  ],
  tradeoffs: [
    "Imported files are messy in ways a form never is: blank cells, odd date formats, amounts stored as text. Catching all of that at import keeps bad rows out of the database, which beats hiding them at display time.",
    "With no custom backend, any logic a policy cannot express has nowhere to sit. That is a known ceiling of this setup, not a problem it solves.",
    "Spendly is still in progress. Features are being added and reworked, so nothing here is finished and frozen.",
  ],
  stack: [
    { group: "Frontend", items: ["TanStack Start", "React", "TypeScript", "Tailwind CSS"] },
    { group: "Data & State", items: ["TanStack Query", "Zod"] },
    { group: "Backend", items: ["Supabase", "PostgreSQL", "Row-Level Security"] },
    { group: "Visualization", items: ["Recharts"] },
  ],
  outcome: [
    "A working expense tracker with fast logging, monthly budgets, and a dashboard",
    "CSV and Excel import with column mapping, plus filtered export",
    "Per-user data isolation enforced by PostgreSQL row-level security",
    "Totals, a six-month trend, and category breakdowns drawn with Recharts",
    "A live demo available to try in the browser",
  ],
  learned: [
    "Access rules in the database wipe out a whole class of mistake. Every query inherits the rule, so no single query has to remember it.",
    "Import is where real data stops being tidy. Handling it properly took more thought than the entire dashboard.",
    "Skipping a custom backend works when the security boundary already sits somewhere solid. It still caps where complex logic can go later.",
  ],
  imageAlt:
    "Spendly expense tracker dashboard showing monthly totals, spending trends and category breakdown charts",
  relatedSlugs: ["minilist-headless-cms", "real-time-chat-application"],
  internalLinks: [
    {
      sentence: "Data-heavy React interfaces on a PostgreSQL backend are familiar ground for me.",
      anchor: "See my React and PostgreSQL skills",
      href: "/skills/",
    },
    {
      sentence: "Spendly sits alongside several other full-stack apps and APIs.",
      anchor: "Browse the full project archive",
      href: "/work/",
    },
  ],
  seo: {
    title: "Spendly Expense Tracker | React & Supabase | Jay Patel",
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
