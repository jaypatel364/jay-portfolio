import type { ProjectDetail } from "./types";

export const philantroAiNgoManagementPlatformDetail: ProjectDetail = {
  slug: "philantro-ai-ngo-management-platform",
  intro:
    "Philantro AI is an NGO management platform. It ships no fixed screens. Instead, each organization builds its own forms, reports, and charts, then tracks progress against milestones. The front end is React with server-side rendering, on a Node.js and MongoDB backend. Part of my work also meant turning AI-assisted design concepts into production React components.",
  ndaNotice:
    "This one was built for a client under an agreement, so I can only go so far here. What follows is my own work and the broad technical shape of the build. The client, their data, and the finer points of the code stay out of it.",
  overview:
    "The platform is built to be shaped by the people using it. NGOs work in very different ways. Their programs differ, their reporting rules differ, and progress itself means something different from one group to the next. Hard-coded screens built for one NGO would have been wrong for the next.\n\nSo the modules are configurable. There is a form builder for collecting data, dynamic report generation, a chart builder for graphing results, and milestone tracking to follow how a program is going. Each group sets up what it needs and never waits on a developer.\n\nI also worked the design-to-code side. Concepts started as AI-assisted prototypes in Visily, moved into Figma designs, then shipped as production React components with server-side rendering.",
  role: [
    "Built configurable modules in React, including the custom form builder",
    "Worked on dynamic report generation and the customizable chart builder",
    "Implemented milestone tracking for program progress",
    "Developed backend functionality on Node.js and Express with MongoDB",
    "Set up server-side rendering for the React application",
    "Collaborated on AI-assisted prototyping, taking Visily concepts through Figma into production components",
  ],
  problem:
    "Every NGO collects different information and reports on it differently. Fixed forms and fixed reports would have put a developer in the loop for every small change. A new field, a different breakdown, and someone has to ship code. That does not scale, and it wastes an engineer on routine work. So forms, reports, and charts all had to be configurable by the people using the platform. The catch is that the setup still has to stay structured enough to trust.",
  build:
    "The interface is React, rendered on the server so pages arrive as HTML. Nobody waits for JavaScript to build the page first. The backend is Node.js with Express, and MongoDB stores the data.\n\nThe form builder is the heart of the platform. A form is not defined in code. It is stored as configuration: its fields, their types, and their rules. The React app reads that configuration and draws the form from it. Adding a field becomes a setting someone changes, not a deployment someone ships.\n\nReports and charts follow the same idea. Report generation runs off the collected data plus the configuration saying what to summarize. The chart builder then lets a user pick how that output gets graphed. Milestone tracking sits on top, following progress against set checkpoints.\n\nMongoDB suits this well. When users define their own forms, you cannot know the shape of a submission ahead of time. A document store takes that in its stride, while a fixed relational schema would need working around at every turn.\n\nOn the design side, concepts began as AI-assisted prototypes in Visily and became Figma designs. From there I built them as production React components, not static mockups handed over the wall.",
  features: [
    {
      title: "Custom Form Builder",
      description:
        "Groups build their own data collection forms by setting fields and rules. The app draws each form from that setup, so a new field needs no code change and no release.",
    },
    {
      title: "Dynamic Report Generation",
      description:
        "Reports build themselves from the collected data and a saved setup, so nobody hand-writes each one. Two groups can pull very different breakdowns out of the same system.",
    },
    {
      title: "Customizable Chart Builder",
      description:
        "Users pick how their own data gets graphed, with no fixed set of charts handed to them. What is worth charting shifts from one program to the next, so that call belongs to them.",
    },
    {
      title: "Milestone Tracking",
      description:
        "Program progress is tracked against set milestones. That gives a clear read on where things stand, so nobody has to work it out from raw submissions.",
    },
    {
      title: "Server-Side Rendering",
      description:
        "Pages render on the server, so content arrives as HTML. On a data-heavy platform that means the first screen is usable sooner.",
    },
  ],
  architecture: {
    layers: [
      "React Client (SSR)",
      "Node.js / Express Server",
      "Configurable Modules (Forms, Reports, Charts, Milestones)",
      "MongoDB",
    ],
    explanation:
      "React renders on the server through Node.js and Express, so pages go out as HTML. The configurable modules sit behind that. Forms, reports, charts, and milestones each read their definitions from stored configuration, never from hard-coded structures. MongoDB holds the configuration and the submitted data together. That works because user-defined forms produce documents with no fixed shape.",
  },
  decisions: [
    {
      title: "Configuration-driven modules over fixed screens",
      why: "Every group needed different fields, reports, and charts. Coding each variation would have pulled a developer into every routine change. Store the definition as configuration and draw the screen from it, and that control moves to the people using the platform.",
      tradeoff:
        "A system that renders from configuration is harder to build and harder to debug than fixed screens. You are building the thing that builds the forms, not the forms.",
    },
    {
      title: "MongoDB for user-defined data",
      why: "When users define their own forms, submissions have no fixed shape. A document database stores that as it comes. A rigid relational schema would need a workaround for every custom field.",
      tradeoff:
        "You give up the guarantees a relational schema hands you. The database will accept shapes the form never intended, so the app has to do the validating on purpose.",
    },
    {
      title: "Server-side rendering",
      why: "This is a data-heavy platform people use for real work. Rendering on the server means the page shows up as HTML, so the browser is not assembling it while the user waits.",
      tradeoff:
        "SSR makes both rendering and deployment more involved than a plain client-side app.",
    },
    {
      title: "Prototyping in Visily and Figma before building",
      why: "Configurable interfaces are far easier to get wrong than fixed ones. Working the ideas through prototypes and Figma first settled the hard questions in design. The alternative is finding them halfway through the React build.",
      tradeoff:
        "It puts a step between idea and code. Rebuilding a form builder after the fact costs far more than redrawing a prototype.",
    },
  ],
  tradeoffs: [
    "A configurable system means building the layer that generates the interface, not only the interface. It costs more up front and pays back every time a requirement shifts.",
    "A flexible data model puts validation on the app. The database stores what it is handed, so every form definition has to carry its own rules.",
    "Configuration still has to stay structured. Allow too much freedom and the data gets hard to report on, which defeats the point of collecting it.",
  ],
  stack: [
    { group: "Frontend", items: ["React", "SSR", "Tailwind CSS"] },
    { group: "Backend", items: ["Node.js", "Express.js"] },
    { group: "Database", items: ["MongoDB"] },
    { group: "Design", items: ["Visily", "Figma"] },
  ],
  outcome: [
    "A configurable NGO management platform with form, report, and chart builders",
    "Milestone tracking that follows program progress against set checkpoints",
    "Server-rendered React running on a Node.js and MongoDB backend",
    "A working path from AI-assisted prototypes through Figma designs to production React components",
  ],
  learned: [
    "Building a configurable system is a different job from building an app. You are designing the rules that generate the interface, and those rules need as much care as any feature.",
    "Flexible storage moves validation into the application. The database will not catch what the form definition should have.",
    "Prototyping first pays off for configurable interfaces. The hard questions surface in design, where changing your mind is cheap.",
  ],
  imageAlt:
    "NGO management platform showing configurable forms, reports and milestone tracking modules",
  relatedSlugs: ["pms-hr-management-system", "verify-360-kyc-platform"],
  internalLinks: [
    {
      sentence:
        "Complex forms, configurable workflows, and admin platforms come up again and again in my work.",
      anchor: "Review my front-end and platform skills",
      href: "/skills/",
    },
    {
      sentence: "This is one of several production platforms I have helped build.",
      anchor: "See my other client projects",
      href: "/work/",
    },
  ],
  seo: {
    title: "NGO Management Platform | React & Node.js | Jay Patel",
    description:
      "A configurable NGO management platform with a custom form builder, dynamic reports, charts and milestone tracking, built in React with Node.js and MongoDB.",
    ogTitle: "Philantro AI NGO Management Platform | React & Node.js",
    ogDescription:
      "A configurable NGO platform with a custom form builder, dynamic report generation, chart builder and milestone tracking, built with server-rendered React, Node.js and MongoDB.",
    primaryTopic: "NGO Management Platform",
    secondaryTopics: [
      "custom form builder",
      "configurable workflows",
      "dynamic report generation",
      "milestone tracking",
      "server-side rendering",
      "React and Node.js",
      "MongoDB",
    ],
  },
};
