import type { ProjectDetail } from "./types";

export const philantroAiNgoManagementPlatformDetail: ProjectDetail = {
  slug: "philantro-ai-ngo-management-platform",
  intro:
    "Philantro AI is a management platform for NGOs. Instead of shipping fixed screens, it lets organisations build their own forms, reports, and charts, and track progress against milestones. It was built with React and server-side rendering on a Node.js and MongoDB backend. Part of my work also involved turning AI-assisted design concepts into production React components.",
  ndaNotice:
    "This project was built for a production environment and cannot be documented publicly in full. The summary below focuses on my responsibilities and the general technical approach, without client details, internal data, or proprietary implementation specifics.",
  overview:
    "The platform is built around configurability. NGOs vary a lot in how they work. Different programmes, different reporting requirements, and different definitions of progress mean that hard-coding screens for one organisation would not have worked for the next.\n\nInstead the modules are configurable: a form builder for creating data collection forms, dynamic report generation, a chart builder for visualising results, and milestone tracking for following programme progress. An organisation configures what it needs rather than waiting for a developer to add it.\n\nI also worked on the design-to-code side, taking concepts prototyped with AI assistance in Visily, refined into Figma designs, and building them out as production React components with server-side rendering.",
  role: [
    "Built configurable modules in React, including the custom form builder",
    "Worked on dynamic report generation and the customisable chart builder",
    "Implemented milestone tracking for programme progress",
    "Developed backend functionality on Node.js and Express with MongoDB",
    "Set up server-side rendering for the React application",
    "Collaborated on AI-assisted prototyping, taking Visily concepts through Figma into production components",
  ],
  problem:
    "Every NGO collects different information and reports on it differently. Building fixed forms and fixed reports would have meant a developer changing code every time an organisation needed a new field or a different breakdown, which does not scale and puts an engineer in the middle of routine work. The problem was to make the data collection, reporting, and visualisation configurable by the people using the platform, while keeping the configuration structured enough to stay reliable.",
  build:
    "The interface is React, rendered on the server so pages arrive as HTML rather than waiting for JavaScript to build them. The backend is Node.js with Express, and MongoDB stores the data.\n\nThe form builder is the centre of the platform. Rather than defining fields in code, a form is stored as configuration covering its fields, their types, and their rules. The React application reads that configuration and renders the form from it. Adding a field becomes a configuration change instead of a deployment.\n\nReports and charts follow the same idea. Report generation works from the collected data and the configuration describing what should be summarised, and the chart builder lets a user choose how that output is visualised. Milestone tracking sits on top, following progress against defined checkpoints.\n\nMongoDB suits this well. When forms are user-defined, the shape of a submission is not known ahead of time, and a document store handles that naturally, where a fixed relational schema would have to be worked around.\n\nOn the design side, concepts were prototyped with AI assistance in Visily, turned into Figma designs, and then built as production React components rather than being handed over as static mockups.",
  features: [
    {
      title: "Custom Form Builder",
      description:
        "Organisations build their own data collection forms by defining fields and rules. The application renders each form from that configuration, so a new field does not require a code change or a release.",
    },
    {
      title: "Dynamic Report Generation",
      description:
        "Reports are generated from collected data according to configuration rather than being written individually. Different organisations get the breakdowns they need from the same underlying system.",
    },
    {
      title: "Customisable Chart Builder",
      description:
        "Users choose how their data is visualised instead of receiving a fixed set of charts. What is worth graphing varies by programme, so that choice belongs with the user.",
    },
    {
      title: "Milestone Tracking",
      description:
        "Programme progress is tracked against defined milestones, which gives a structured way to see where things stand rather than reading it out of raw submissions.",
    },
    {
      title: "Server-Side Rendering",
      description:
        "Pages are rendered on the server so content arrives as HTML. For a data-heavy platform this means the first view is usable sooner rather than waiting on client-side rendering.",
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
      "React renders on the server through Node.js and Express, so pages are delivered as HTML. The configurable modules sit behind that. Forms, reports, charts, and milestones each read their definitions from stored configuration rather than from hard-coded structures. MongoDB holds both that configuration and the submitted data, which works because user-defined forms produce documents whose shape is not fixed in advance.",
  },
  decisions: [
    {
      title: "Configuration-driven modules instead of fixed screens",
      why: "Organisations needed different fields, reports, and charts. Building each variation in code would have meant a developer involved in every routine change. Storing the definition as configuration and rendering from it moves that control to the people using the platform.",
      tradeoff:
        "A system that renders from configuration is harder to build and to debug than fixed screens, because you are building the thing that builds the forms rather than the forms themselves.",
    },
    {
      title: "MongoDB for user-defined data",
      why: "When users define their own forms, submissions do not have a fixed shape. A document database stores that naturally, whereas a rigid relational schema would need workarounds for every custom field.",
      tradeoff:
        "You lose the guarantees a relational schema gives you. Validation has to be handled deliberately in the application, since the database will accept structures that the form definition never intended.",
    },
    {
      title: "Server-side rendering",
      why: "This is a data-heavy platform used for real work. Rendering on the server means the page arrives as HTML instead of the browser assembling it before anything is visible.",
      tradeoff:
        "SSR adds complexity to both rendering and deployment compared to a purely client-side application.",
    },
    {
      title: "Prototyping in Visily and Figma before building",
      why: "Configurable interfaces are much easier to get wrong than fixed ones. Working the concepts through prototypes and Figma designs first meant those questions were resolved in design rather than discovered halfway through the React implementation.",
      tradeoff:
        "There is a step between idea and code, but rebuilding a form builder after the fact is considerably more expensive than revising a prototype.",
    },
  ],
  tradeoffs: [
    "Building a configurable system means building the layer that generates the interface, not just the interface. It takes longer up front and pays back every time a requirement changes.",
    "A flexible data model puts the responsibility for validation on the application. The database will store what it is given, so form definitions have to carry their own rules.",
    "Configuration has to stay structured. Too much flexibility and the data becomes hard to report on, which defeats the reason for collecting it.",
  ],
  stack: [
    { group: "Frontend", items: ["React", "SSR", "Tailwind CSS"] },
    { group: "Backend", items: ["Node.js", "Express.js"] },
    { group: "Database", items: ["MongoDB"] },
    { group: "Design", items: ["Visily", "Figma"] },
  ],
  outcome: [
    "A configurable NGO management platform with form, report, and chart builders",
    "Milestone tracking for following programme progress",
    "Server-rendered React running on a Node.js and MongoDB backend",
    "A working path from AI-assisted prototypes through Figma designs to production React components",
  ],
  learned: [
    "Building a configurable system is a different problem from building an application. You are designing the rules that generate the interface, and those rules need as much thought as any feature.",
    "Flexible storage moves validation into the application. The database will not catch what the form definition should have.",
    "Prototyping first is worth it for configurable interfaces, because the hard questions surface in design, where they are cheap to change.",
  ],
  imageAlt:
    "NGO management platform showing configurable forms, reports and milestone tracking modules",
  relatedSlugs: ["pms-hr-management-system", "verify-360-kyc-platform"],
  internalLinks: [
    {
      sentence:
        "Complex forms, configurable workflows, and admin platforms are a recurring part of the work I take on.",
      anchor: "See the full stack I build with",
      href: "/skills/",
    },
    {
      sentence: "This is one of several production platforms I have worked on.",
      anchor: "Browse all of my projects",
      href: "/work/",
    },
  ],
  seo: {
    title: "NGO Management Platform | React, Node.js & MongoDB | Jay Patel",
    description:
      "A configurable NGO management platform with a custom form builder, dynamic reports, chart builder and milestone tracking, built in React with Node.js and MongoDB.",
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
