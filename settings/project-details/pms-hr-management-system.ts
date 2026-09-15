import type { ProjectDetail } from "./types";

export const pmsHrManagementSystemDetail: ProjectDetail = {
  slug: "pms-hr-management-system",
  heading: "PMS: An HR Management System for Attendance, Leave, and Payroll",
  intro:
    "Attendance, leave, and payroll for a mid-sized company, all in one place, is what this HR management system handles. React runs the interface, Node.js and PostgreSQL sit behind it, and the real catch was that it had to work alongside an ERP system the company already depended on daily. Replacing that ERP was never on the table.",
  ndaNotice:
    "This project is protected under an NDA. It was built for a client under a formal agreement, so what follows covers my own work and the general engineering approach, without any client name, payroll figures, or internal business rules. You can see how it fits among other production work in the wider project archive.",
  overview:
    "This HR software handles the work a company runs through every month: recording attendance, managing leave requests and approvals, and running payroll off both of those inputs. What someone sees changes with their role. An employee, a manager, and someone on the HR team each get a different view and a different set of permissions inside the same platform.\n\nNo individual feature here was particularly difficult on its own. What made this employee management system demanding was how tightly everything depends on everything else. Attendance feeds leave. Leave affects payroll. And payroll has to be right, because it's literally people's money, sitting on top of an ERP system already in daily use that nobody could afford to disrupt.",
  role: [
    "Built the React interfaces for attendance, leave, and payroll workflows",
    "Developed REST APIs on Node.js for the HR modules",
    "Worked on the PostgreSQL data model for employee, attendance, and payroll records",
    "Implemented role-based access control across the different user types",
    "Worked on the integration layer connecting the platform to the existing ERP system",
  ],
  problem:
    "HR data flows in a chain, and payroll sits right at the end of it. Attendance records set leave balances, and both together decide what someone actually gets paid. A small mistake early in that chain doesn't stay small by the time it reaches a paycheck.\n\nThere was also a working ERP already running across the business every single day. This new platform couldn't replace it, and it couldn't ask people to change habits they'd already built around it. It had to sit alongside that ERP and trade data reliably, which turned ERP integration into one of the central engineering problems of the whole build.",
  build:
    "The interface is a React application built around three core modules: attendance, leave, and payroll. What a user sees shifts depending on who's signed in. An employee filing a leave request and a manager approving that same request work inside the same platform, separated cleanly by permissions rather than by separate apps entirely.\n\nThe backend runs Node.js serving REST APIs over PostgreSQL. A relational database made sense here because the data genuinely is relational. Employees have attendance records, attendance shapes leave balances, and leave balances shape payroll runs. Those links needed enforcing directly in the database schema, not just assumed somewhere in application code and hoped for.\n\nRole-based access control runs through the entire system. The API checks permissions on every request, so a person's role decides what that specific request is allowed to do. A hidden button in the interface was never treated as real protection on its own.\n\nERP integration is handled as a defined boundary between the two systems, rather than something spread throughout the codebase. This platform never reaches directly into the ERP or copies its data wholesale. Instead, it trades information at agreed points, which leaves both systems free to evolve on their own schedule without breaking each other. For more on how I approach this kind of relational, production-grade build, see my React and Node.js development skills and PostgreSQL database design skills.",
  features: [
    {
      title: "Attendance tracking",
      description:
        "Attendance records form the base layer everything else builds on. Leave balances and payroll both depend entirely on this data being accurate from day one.",
    },
    {
      title: "Leave management",
      description:
        "Employees can submit leave requests, managers can review and approve them, and available leave balances are updated automatically. The approval workflow needed to mirror how this specific company actually operates, not some generic version of leave management.",
    },
    {
      title: "Payroll processing",
      description:
        "Payroll pulls from attendance and leave data to run each pay cycle. There's the least room for error here of anything in the platform, which meant every input feeding it needed to be trustworthy and traceable.",
    },
    {
      title: "Role-based access control",
      description:
        "Employees, managers, and HR staff each carry their own permissions, enforced directly by the API rather than simply hidden behind a UI toggle.",
    },
    {
      title: "ERP integration",
      description:
        "The platform trades data with the existing ERP through a clearly defined boundary, letting the ERP keep running exactly as it always had while new HR modules grew around it.",
    },
  ],
  architecture: {
    layers: [
      "React Client",
      "REST API (Node.js)",
      "Attendance, Leave, and Payroll Modules",
      "PostgreSQL",
      "ERP Integration Layer",
    ],
    explanation:
      "The React client calls REST APIs on the Node.js backend, which routes each request to the right HR module. Those modules read and write PostgreSQL, where the relationships between employees, attendance, leave, and payroll are modeled directly in the schema itself.\n\nRoughly, requests flow from the React client, through a REST API on Node.js, into the attendance, leave, and payroll modules, down to PostgreSQL, with ERP integration sitting in its own separate layer.\n\nThat ERP layer stays isolated rather than getting spread across individual modules, keeping the two systems loosely coupled so a change on one side doesn't ripple through the whole platform.",
  },
  decisions: [
    {
      title: "PostgreSQL for HR and payroll data",
      why: "PostgreSQL made sense for HR and payroll data because the data is relational in the truest sense of the word. Employees, attendance, leave balances, and payroll runs all point at each other, and payroll only comes out correctly if those pointers hold up. A relational database enforces that structure directly, so application logic is never the last line of defense against a bad record.",
      tradeoff:
        "The cost is that schema changes need migrations and real planning, slower than a schema-less store, but with payroll data specifically, that added friction is essentially the whole point.",
    },
    {
      title: "Integrating with the existing ERP instead of replacing it",
      why: "Integrating with the existing ERP instead of replacing it came down to risk. The ERP already worked, and people leaned on it every day. Replacing it outright would have meant a far bigger, far riskier project than the client actually needed solved. Building alongside it got the new HR features shipped without breaking something people already relied on.",
      tradeoff:
        "The trade-off is that two systems now have to stay in agreement, and that shared boundary becomes one more thing to maintain long-term, though still a much smaller risk than a full ERP replacement.",
    },
    {
      title: "Enforcing permissions at the API level",
      why: "Enforcing permissions at the API level, not just in the interface, came from a simple fact: hiding a button doesn't stop a request from reaching the server. With payroll figures and personal employee data involved, the check has to happen exactly where the action runs.",
      tradeoff:
        "That does mean writing permissions twice, once for what the interface shows and once for what the API actually allows, but only the second check genuinely protects anything.",
    },
  ],
  tradeoffs: [
    "Attendance, leave, and payroll form a tight chain, so any change to one module meant checking it carefully against the other two before shipping anything. Nothing here could be built in isolation without risking a downstream break.",
    "Integrating with a system already running in production means living inside its existing constraints. The boundary needed to stay clean and well-defined, or both systems would have grown harder to change over time as more edge cases piled up.",
    "Payroll leaves very little room to iterate after the fact. Getting the data model right mattered more here than shipping fast, since a payroll mistake has real financial consequences for real people, not just an inconvenient bug.",
  ],
  stack: [
    { group: "Frontend", items: ["React"] },
    { group: "Backend", items: ["Node.js", "REST API"] },
    { group: "Database", items: ["PostgreSQL"] },
    { group: "Integration", items: ["Existing ERP system"] },
  ],
  outcome: [
    "An end-to-end HR solution that streamlines attendance tracking, leave management, and payroll processing.",
    "Role-based access enforced across employee, manager, and HR views.",
    "Seamless connectivity with the company’s current ERP system for smooth data synchronization.",
    "And a relational data model where payroll genuinely depends on verified attendance and leave records, not just trusted ones.",
  ],
  learned: [
    "When one feature feeds directly into another, the data model matters more than any single screen. Getting attendance right is what actually made accurate leave tracking and payroll possible further down the chain.",
    "Integrating with something that already exists is usually the lower-risk path for a client, even though it demands more careful boundary design up front. Replacing something that already works is rarely the real requirement, even when it looks simpler at a glance.",
    "Permission checks belong at the point where the work actually happens, inside the API itself. Interface-level restrictions are a convenience for the user, not real protection for the data underneath.",
  ],
  faqs: [
    {
      question: "What does an HR management system typically cover?",
      answer:
        "An HR management system, sometimes called an HRMS or HRIS, usually handles attendance tracking, leave management, and payroll processing in one platform. Role-based access control then decides what employees, managers, and HR staff can each see and do within it.",
    },
    {
      question: "Why does payroll depend so heavily on attendance and leave data?",
      answer:
        "Payroll calculations pull directly from attendance records and approved leave balances, since both determine what someone is actually owed for a given pay period. An error in attendance or leave carries straight through into payroll, which is why accuracy earlier in the chain matters so much.",
    },
    {
      question: "Can a new HR platform run alongside an existing ERP?",
      answer:
        "Yes. Rather than replacing an ERP a company already depends on, a new platform can integrate with it through a clearly defined data boundary. Each system keeps operating independently, trading information only at agreed points, which avoids disrupting workflows people already rely on.",
    },
    {
      question: "Why enforce role-based access control at the API level rather than the interface?",
      answer:
        "Hiding a button or menu item in the interface doesn't stop someone from sending that request directly to the server. Enforcing permissions inside the API means every request gets checked at the exact point the action happens, which is what actually protects sensitive data like payroll and personal records.",
    },
  ],
  imageAlt: "HR management system interface showing attendance, leave and payroll modules",
  relatedSlugs: ["philantro-ai-ngo-management-platform", "verify-360-kyc-platform"],
  internalLinks: [
    {
      sentence:
        "React, Node.js, and PostgreSQL sit at the core of most client work I take on. See the",
      anchor: "tools and skills I use in production",
      href: "/skills/",
    },
    {
      sentence: "More production platforms and full-stack applications sit in the wider archive.",
      anchor: "View other platforms I've built",
      href: "/work/",
    },
    {
      sentence: "Or take a look at the",
      anchor: "custom software development services",
      href: "/services/full-stack-development/",
    },
  ],
  seo: {
    title: "PMS: HR Management System for Payroll, Built With React",
    description:
      "PMS is an HR management system for attendance, leave, and payroll, built with React, Node.js, and PostgreSQL, running alongside an existing ERP.",
    ogTitle: "PMS: HR Management System for Payroll, Built With React",
    ogDescription:
      "PMS is an HR management system for attendance, leave, and payroll, built with React, Node.js, and PostgreSQL, running alongside an existing ERP.",
    primaryTopic: "HR Management System",
    secondaryTopics: [
      "attendance and leave management",
      "payroll processing",
      "role-based access control",
      "ERP integration",
      "React application",
      "Node.js REST API",
      "PostgreSQL data modeling",
    ],
  },
};
