import type { ProjectDetail } from "./types";

export const philantroAiNgoManagementPlatformDetail: ProjectDetail = {
  slug: "philantro-ai-ngo-management-platform",
  heading: "Philantro AI: A Configurable NGO Management Platform Built in React",
  intro:
    "No two NGOs collect data the same way, so this platform doesn't ship with fixed screens at all. Instead, each organization builds its own forms, generates its own reports, and tracks progress against its own milestones. React with server-side rendering handles the frontend, and Node.js with MongoDB runs behind it. Part of the work also meant turning AI-assisted design concepts into actual production React components, not just mockups.",
  ndaNotice:
    "This project is protected under an NDA. It was built for a client under an agreement, so what follows covers my own role and the broad technical shape of the build, without the client, their data, or the finer points of the code. You can see it alongside other client work in the wider project archive.",
  overview:
    "This nonprofit management platform was built to be shaped by whoever's actually using it. NGOs run their programs differently from one another, follow different reporting rules, and even define progress differently depending on their mission. Hard-coded screens designed for one organization would simply be wrong for the next.\n\nSo every module here is configurable: a form builder for collecting data, dynamic report generation, a chart builder for graphing results, and milestone tracking for following how a program is going over time. Each organization sets up exactly what it needs on its own, without waiting on a developer for routine changes.\n\nDesign work followed a specific path too. Concepts started as AI-assisted prototypes in Visily, moved into Figma for refinement, and then shipped as actual production React components rather than staying as static mockups.",
  role: [
    "Built configurable modules in React, including the custom form builder",
    "Worked on dynamic report generation and the customizable chart builder",
    "Implemented milestone tracking for program progress",
    "Developed backend functionality on Node.js and Express with MongoDB",
    "Set up server-side rendering for the React application",
    "Collaborated on AI-assisted prototyping, taking Visily concepts through Figma into production components",
  ],
  problem:
    "Every NGO collects different information and reports on it in its own way. Fixed forms would have meant a developer in the loop for every minor change, a new field here, a different breakdown there, and someone has to ship code just to handle it. That doesn't scale, and it wastes engineering time on work that should belong to program staff, not developers.\n\nSo forms, reports, and charts all had to be configurable by the people actually running programs on this NGO management platform. The catch is that the setup still needs enough structure to be trustworthy. A data collection tool nobody can rely on defeats the entire point of building it.",
  build:
    "React handles the interface, rendered on the server so pages arrive as ready HTML rather than making users wait for JavaScript to assemble the page first. Node.js with Express runs the backend, and MongoDB stores everything underneath.\n\nThe custom form builder sits at the heart of the platform. A form isn't hard-coded anywhere. It's stored as configuration, its fields, their types, and their validation rules, and the React app reads that configuration and draws the form directly from it. Adding a field becomes a setting an NGO changes itself, not a deployment someone has to ship.\n\nReports and charts follow the same logic. Dynamic report generation runs off the collected data plus a saved configuration describing what to summarize, and the chart builder then lets a user decide how that output gets graphed. Milestone tracking sits on top of all of it, following program progress against whatever checkpoints an organization has set.\n\nMongoDB fits this particular problem well. When users define their own forms, there's no way to know the shape of a submission ahead of time, and a document store handles that variation naturally, while a rigid relational schema would need constant workarounds every time a new field got added. On the design side, the path ran from AI-assisted prototypes in Visily through Figma and into working React components built for production, not handed over as a static mockup. For more on how I approach configurable, data-heavy interfaces like this, see my React and front-end development skills and Node.js backend skills.",
  features: [
    {
      title: "Custom form builder",
      description:
        "Organizations set fields and rules without touching code, and the app draws each form from that configuration directly. A new field needs no code change and no release cycle at all.",
    },
    {
      title: "Dynamic report generation",
      description:
        "Reports build themselves from collected data and a saved configuration, so nobody's hand-writing each one from scratch. Two different NGOs can pull entirely different breakdowns from the same underlying system.",
    },
    {
      title: "Customizable chart builder",
      description:
        "Users choose how their own data gets visualized, with no fixed set of charts handed to them by default. What's worth charting changes from one program to the next, so that decision stays with the people running it.",
    },
    {
      title: "Milestone tracking",
      description:
        "Program progress gets measured against set milestones, giving a clear read on where things stand without anyone having to reconstruct that picture manually from raw submissions.",
    },
    {
      title: "Server-side rendering",
      description:
        "Pages render server-side, so content shows up as HTML immediately. On a platform this data-heavy, that means the first screen is usable sooner, even before every script has finished loading.",
    },
  ],
  architecture: {
    layers: [
      "React client with server-side rendering",
      "Node.js and Express server",
      "Configurable modules for forms, reports, charts, and milestones",
      "MongoDB",
    ],
    explanation:
      "React renders on the server through Node.js and Express, so pages go out as HTML from the very first response. The configurable modules sit behind that rendering layer, with forms, reports, charts, and milestones all reading their definitions from stored configuration rather than any hard-coded structure baked into the app.\n\nRoughly: a React client with server-side rendering, talking to a Node.js and Express server, which runs the configurable modules for forms, reports, charts, and milestones, all backed by MongoDB.\n\nMongoDB holds configuration and submitted data together in the same store, which works because user-defined forms produce documents with no fixed shape, something a rigid relational schema would genuinely struggle to accommodate.",
  },
  decisions: [
    {
      title: "Configuration-driven modules over fixed screens",
      why: "Choosing configuration-driven modules over fixed screens came from the reality that every NGO needed different fields, reports, and charts to match how it actually operates. Coding each variation by hand would have pulled a developer into every routine change an organization wanted to make. Storing the definition as configuration and drawing the interface from it instead moved that control directly to the people using the platform.",
      tradeoff:
        "The cost is that a system rendering from configuration is genuinely harder to build and harder to debug than a set of fixed screens, since you're building the thing that builds the forms, not the forms themselves.",
    },
    {
      title: "MongoDB for user-defined data",
      why: "MongoDB made sense for user-defined data because submissions have no predictable shape ahead of time when users are the ones defining forms. A document database absorbs that variation without complaint, where a rigid relational schema would need a workaround for every custom field added.",
      tradeoff:
        "The trade-off is real, though: you lose the guarantees a relational schema hands you automatically. The database will happily accept shapes the original form never intended, so validation has to be handled deliberately in application code.",
    },
    {
      title: "Server-side rendering",
      why: "Server-side rendering earned its place because this is a genuinely data-heavy platform people rely on for real work. Rendering server-side means the page shows up as HTML right away, instead of leaving a browser to assemble everything piece by piece while a user stares at a blank screen.",
      tradeoff:
        "The cost is that SSR makes both rendering and deployment more involved than a plain client-side app would be.",
    },
    {
      title: "Prototyping in Visily and Figma before building",
      why: "Prototyping in Visily and then Figma before writing any React code came from a simple observation: configurable interfaces are much easier to get wrong than fixed ones, since a single design mistake gets multiplied across every organization that configures a form differently. Working through the ideas early, in design, surfaced the hard questions before they became expensive to fix.",
      tradeoff:
        "The only real cost is an extra step between the initial idea and working code, but rebuilding a form builder after the fact costs far more than redrawing a prototype ever would.",
    },
  ],
  tradeoffs: [
    "A configurable system means building the layer that generates the interface, not just the interface itself. That costs more up front, and it pays that cost back every single time a requirement shifts for one of the organizations using the platform.",
    "A flexible data model shifts the burden of validation onto the application. The database stores whatever it's handed, so every form definition has to carry its own rules along with it rather than leaning on the database to catch mistakes automatically.",
    "Configuration still needs to stay structured enough to be useful. Too much freedom in how forms and fields get defined, and the resulting data becomes hard to report on cleanly, which quietly defeats the entire point of collecting it.",
  ],
  stack: [
    { group: "Frontend", items: ["React", "server-side rendering", "Tailwind CSS"] },
    { group: "Backend", items: ["Node.js", "Express.js"] },
    { group: "Database", items: ["MongoDB"] },
    { group: "Design", items: ["Visily", "Figma"] },
  ],
  outcome: [
    "A configurable NGO management platform with form, report, and chart builders.",
    "Milestone tracking that follows program progress against set checkpoints.",
    "Server-rendered React running on a Node.js and MongoDB backend.",
    "And a real working path from AI-assisted prototypes through Figma designs into production React components.",
  ],
  learned: [
    "Building a configurable system turned out to be a genuinely different job from building a regular application. You're designing the rules that generate the interface, and those rules need as much care and testing as any single feature would.",
    "Flexible storage like MongoDB moves validation into the application layer entirely. The database won't catch what a form definition should have caught in the first place, so that responsibility has to be handled deliberately rather than assumed away.",
    "Prototyping first paid off noticeably here. The hard questions surfaced early in design, where changing your mind is still cheap, rather than late in a React build, where it's genuinely expensive.",
  ],
  faqs: [
    {
      question: "What makes an NGO management platform different from a standard nonprofit CRM?",
      answer:
        "A configurable NGO management platform lets each organization define its own forms, reports, and charts, rather than working within fixed screens built for a generic use case. That flexibility matters because NGOs collect very different data and measure progress in different ways depending on their programs.",
    },
    {
      question: "How does a custom form builder actually work?",
      answer:
        "A custom form builder stores each form as configuration, its fields, field types, and validation rules, rather than as fixed code. The application reads that configuration and renders the form directly from it, so adding or changing a field becomes something an organization can do itself without waiting on a developer.",
    },
    {
      question: "Why choose MongoDB for a platform with user-defined forms?",
      answer:
        "MongoDB stores data as flexible documents instead of fixed rows and columns, which suits a platform where every organization defines its own fields. Submissions from different NGOs can have completely different shapes, and a document database handles that naturally, where a relational schema would need constant workarounds.",
    },
    {
      question: "What does milestone tracking add for nonprofit program management?",
      answer:
        "Milestone tracking measures program progress against a set of defined checkpoints, giving staff a clear, immediate read on where a program stands. That removes the need to manually reconstruct that picture from raw form submissions every time someone needs a status update.",
    },
  ],
  imageAlt:
    "NGO management platform showing configurable forms, reports and milestone tracking modules",
  relatedSlugs: ["pms-hr-management-system", "verify-360-kyc-platform"],
  internalLinks: [
    {
      sentence:
        "Complex forms, configurable workflows, and admin platforms keep coming up in my work. Review my",
      anchor: "front-end and platform skills",
      href: "/skills/",
    },
    {
      sentence: "This is one of several production platforms I've helped build. See",
      anchor: "my other client projects",
      href: "/work/",
    },
    {
      sentence: "Or take a look at the",
      anchor: "custom platform development services",
      href: "/services/full-stack-development/",
    },
  ],
  seo: {
    title: "Philantro AI: A Configurable NGO Management Platform",
    description:
      "Philantro AI is an NGO management platform with a custom form builder, dynamic reports, and milestone tracking, built with React and MongoDB.",
    ogTitle: "Philantro AI: A Configurable NGO Management Platform",
    ogDescription:
      "Philantro AI is an NGO management platform with a custom form builder, dynamic reports, and milestone tracking, built with React and MongoDB.",
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
