import type { ProjectDetail } from "./types";

export const pmsHrManagementSystemDetail: ProjectDetail = {
  slug: "pms-hr-management-system",
  intro:
    "PMS is an HR management system covering the full employee cycle of attendance, leave, and payroll for a mid-sized company. It was built with React on the front end and Node.js with PostgreSQL behind it, and it had to work alongside an ERP system the company already relied on rather than replacing it.",
  ndaNotice:
    "This project was built for a production environment and cannot be documented publicly in full. What follows covers my responsibilities and the general engineering work, without client details, internal business data, or proprietary implementation specifics.",
  overview:
    "The platform handles the HR processes that a company runs every month: recording attendance, managing leave requests and approvals, and processing payroll based on both. Different roles see different things. An employee, a manager, and someone in HR each have their own view and their own permissions.\n\nWhat made this project demanding was not any single feature but how tightly the features depend on each other. Attendance feeds leave. Leave affects payroll. Payroll has to be correct, because it is money. And all of it had to fit alongside an existing ERP system that was already in daily use and could not be disrupted.",
  role: [
    "Built the React interfaces for attendance, leave, and payroll workflows",
    "Developed REST APIs on Node.js for the HR modules",
    "Worked on the PostgreSQL data model for employee, attendance, and payroll records",
    "Implemented role-based access control across the different user types",
    "Worked on the integration layer connecting the platform to the existing ERP system",
  ],
  problem:
    "HR data is connected in a chain, and payroll sits at the end of it. Attendance records determine leave balances, and both feed into what someone is paid, so an error early in that chain does not stay small. On top of that, the company already had an ERP system that was working and in daily use. The platform could not replace it or ask people to change how they used it. It had to fit alongside it and exchange data with it reliably.",
  build:
    "The interface is a React application organised around the HR modules for attendance, leave, and payroll, with the view changing based on who is signed in. An employee submitting a leave request and a manager approving it are using the same system through different permissions.\n\nThe backend is Node.js exposing REST APIs, with PostgreSQL underneath. A relational database was the right fit here because the data genuinely is relational: employees have attendance records, attendance affects leave balances, and leave affects payroll runs. Those relationships needed to be enforced by the database rather than assumed by the application.\n\nRole-based access control runs through the whole system. Permissions are checked on the API, not only reflected in the interface, so a role determines what a request is actually allowed to do rather than just what a screen chooses to show.\n\nThe ERP integration is a defined boundary between the two systems. Rather than reaching into the ERP or duplicating its data, the platform exchanges information with it at agreed points, which keeps the two able to change independently.",
  features: [
    {
      title: "Attendance Tracking",
      description:
        "Attendance records are captured and stored as the base layer for everything else. Leave balances and payroll calculations both depend on this data being accurate.",
    },
    {
      title: "Leave Management",
      description:
        "Employees request leave and managers approve it, with balances updating as a result. The approval path has to match how the company actually works, not a generic version of it.",
    },
    {
      title: "Payroll Processing",
      description:
        "Payroll draws on attendance and leave data to produce each cycle. This is the part with the least tolerance for error, so the inputs to it had to be dependable.",
    },
    {
      title: "Role-Based Access Control",
      description:
        "Employees, managers, and HR staff each have their own permissions. Access is enforced at the API level rather than only hidden in the interface.",
    },
    {
      title: "ERP Integration",
      description:
        "The platform exchanges data with the company's existing ERP system through a defined boundary, so the ERP kept working as it was while the new HR modules were added around it.",
    },
  ],
  architecture: {
    layers: [
      "React Client",
      "REST API (Node.js)",
      "HR Modules (Attendance, Leave, Payroll)",
      "PostgreSQL",
      "ERP Integration Layer",
    ],
    explanation:
      "The React client calls REST APIs on the Node.js backend, which routes requests to the relevant HR module. Those modules read and write to PostgreSQL, where the relationships between employees, attendance, leave, and payroll are modelled directly. The ERP integration sits as its own layer rather than being spread through the modules. That way the systems stay loosely coupled, and a change on either side does not ripple through the whole platform.",
  },
  decisions: [
    {
      title: "PostgreSQL for HR and payroll data",
      why: "The data is relational in the truest sense. Employees, attendance, leave balances, and payroll runs all reference each other, and payroll depends on those references being correct. A relational database enforces that at the data layer instead of leaving it to application logic.",
      tradeoff:
        "Schema changes need migrations and planning, which is slower than a schema-less store. For payroll data, that constraint is the point rather than a cost.",
    },
    {
      title: "Integrating with the ERP rather than replacing it",
      why: "The ERP was already working and people depended on it. Replacing it would have meant a much larger, riskier project. Building alongside it delivered the HR functionality without disrupting something already in daily use.",
      tradeoff:
        "Two systems have to stay in agreement, and the integration boundary becomes something that needs maintaining. That is still a far smaller risk than a full replacement.",
    },
    {
      title: "Enforcing permissions on the API",
      why: "Hiding a button does not stop a request. With payroll and personal employee data involved, the check has to happen where the action actually runs.",
      tradeoff:
        "Permissions get expressed twice, once for what the interface shows and once for what the API allows, but the second one is what actually protects the data.",
    },
  ],
  tradeoffs: [
    "Because attendance, leave, and payroll form a chain, a change to any one of them has to be considered against the other two. Features could not be built in isolation.",
    "Integrating with a system already in production means working within its constraints. The boundary between the two had to be clear, otherwise both would have become harder to change.",
    "Payroll leaves little room for iteration. Correctness in the data model mattered more here than speed of delivery.",
  ],
  stack: [
    { group: "Frontend", items: ["React"] },
    { group: "Backend", items: ["Node.js", "REST API"] },
    { group: "Database", items: ["PostgreSQL"] },
    { group: "Integration", items: ["Existing ERP system"] },
  ],
  outcome: [
    "A full-cycle HR platform covering attendance, leave, and payroll",
    "Role-based access enforced across employee, manager, and HR views",
    "A working integration with the company's existing ERP system",
    "A relational data model where payroll depends on verified attendance and leave records",
  ],
  learned: [
    "When one feature feeds another, the data model matters more than any individual screen. Getting attendance right was what made leave and payroll possible.",
    "Integrating with an existing system is usually the lower-risk path. Replacing something that works is rarely the actual requirement.",
    "Permission checks belong where the work happens. Interface-level restrictions are a convenience, not a protection.",
  ],
  imageAlt: "HR management system interface showing attendance, leave and payroll modules",
  relatedSlugs: ["philantro-ai-ngo-management-platform", "verify-360-kyc-platform"],
  internalLinks: [
    {
      sentence: "React, Node.js, and PostgreSQL are core to the production work I take on.",
      anchor: "See the technologies I work with",
      href: "/skills/",
    },
    {
      sentence:
        "There are more production platforms and full-stack applications in the rest of my work.",
      anchor: "Browse all of my projects",
      href: "/work/",
    },
  ],
  seo: {
    title: "HR Management System | React, Node.js & PostgreSQL | Jay Patel",
    description:
      "An HR platform covering attendance, leave and payroll with role-based access, built in React and Node.js and integrated with an existing ERP system.",
    ogTitle: "PMS HR Management System | React, Node.js & PostgreSQL",
    ogDescription:
      "A full-cycle HR platform handling attendance, leave and payroll with role-based access control, built with React, Node.js and PostgreSQL alongside an existing ERP.",
    primaryTopic: "HR Management System",
    secondaryTopics: [
      "attendance and leave management",
      "payroll processing",
      "role-based access control",
      "ERP integration",
      "React application",
      "Node.js REST API",
      "PostgreSQL data modelling",
    ],
  },
};
