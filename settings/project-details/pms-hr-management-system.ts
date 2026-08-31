import type { ProjectDetail } from "./types";

export const pmsHrManagementSystemDetail: ProjectDetail = {
  slug: "pms-hr-management-system",
  intro:
    "PMS is an HR management system that covers the full employee cycle: attendance, leave, and payroll for a mid-sized company. React runs the front end. Node.js and PostgreSQL sit behind it. The catch was that it had to work alongside an ERP system the company already relied on, so replacing that was never on the table.",
  ndaNotice:
    "I built this for a client, and the agreement covers the details. So this write-up sticks to my own work and the general engineering approach. No client name, no payroll figures, and none of the internal business rules.",
  overview:
    "The platform handles the HR work a company runs every month: recording attendance, managing leave requests and approvals, and running payroll off both. Roles change what you see. An employee, a manager, and someone in HR each get their own view and their own permissions.\n\nNo single feature here was hard. What made the project demanding is how tightly the features lean on each other. Attendance feeds leave. Leave affects payroll. Payroll has to be right, because it is money. And behind all of it sat an ERP system in daily use that nobody could afford to disrupt.",
  role: [
    "Built the React interfaces for attendance, leave, and payroll workflows",
    "Developed REST APIs on Node.js for the HR modules",
    "Worked on the PostgreSQL data model for employee, attendance, and payroll records",
    "Implemented role-based access control across the different user types",
    "Worked on the integration layer connecting the platform to the existing ERP system",
  ],
  problem:
    "HR data runs in a chain, and payroll sits at the end of it. Attendance records set leave balances, and both decide what someone gets paid. So a small error early in that chain does not stay small. The company also had a working ERP system in daily use. The new platform could not replace it, and it could not ask people to change how they used it. It had to sit alongside that system and trade data with it reliably.",
  build:
    "The interface is a React app built around the HR modules for attendance, leave, and payroll. What you see shifts with who is signed in. An employee filing a leave request and a manager approving it are in the same system, separated by permissions.\n\nThe backend is Node.js serving REST APIs over PostgreSQL. A relational database fit because the data really is relational. Employees have attendance records. Attendance shapes leave balances. Leave shapes payroll runs. Those links needed enforcing in the database, not merely assumed in the app.\n\nRole-based access control runs through the whole system. The API checks permissions on every request, so a role decides what a request may actually do. Hiding controls in the interface was never the point.\n\nThe ERP integration is a defined boundary between the two systems. The platform never reaches into the ERP or copies its data. It trades information at agreed points, which leaves both systems free to change on their own schedule.",
  features: [
    {
      title: "Attendance Tracking",
      description:
        "Attendance records are captured and stored as the base layer for everything above them. Leave balances and payroll both rely on this data being right.",
    },
    {
      title: "Leave Management",
      description:
        "Employees request leave, managers approve it, and balances update from there. The approval path needed to mirror how this company actually works, not some generic version of it.",
    },
    {
      title: "Payroll Processing",
      description:
        "Payroll pulls from attendance and leave data to produce each cycle. It has the least room for error of anything here, so every input feeding it had to be dependable.",
    },
    {
      title: "Role-Based Access Control",
      description:
        "Employees, managers, and HR staff each carry their own permissions. The API enforces them, so access is not simply hidden in the interface.",
    },
    {
      title: "ERP Integration",
      description:
        "The platform trades data with the company's existing ERP through a defined boundary. The ERP kept running as it always had while the new HR modules grew around it.",
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
      "The React client calls REST APIs on the Node.js backend, which hands each request to the right HR module. Those modules read and write PostgreSQL, where the links between employees, attendance, leave, and payroll are modeled directly. The ERP integration sits in its own layer, never spread through the modules. That keeps the two systems loosely coupled, so a change on either side does not ripple across the whole platform.",
  },
  decisions: [
    {
      title: "PostgreSQL for HR and payroll data",
      why: "The data is relational in the truest sense. Employees, attendance, leave balances, and payroll runs all point at each other, and payroll only works if those pointers are right. A relational database enforces that at the data layer, so app logic is not the last line of defense.",
      tradeoff:
        "Schema changes need migrations and planning, which is slower than a schema-less store. With payroll data, that constraint is the whole point.",
    },
    {
      title: "Integrating with the ERP, not replacing it",
      why: "The ERP already worked, and people leaned on it daily. Replacing it would have meant a far bigger, riskier project. Building alongside it got the HR features shipped without breaking something people already used.",
      tradeoff:
        "Two systems have to stay in agreement, and that boundary becomes one more thing to maintain. It is still a far smaller risk than a full replacement.",
    },
    {
      title: "Enforcing permissions on the API",
      why: "Hiding a button does not stop a request. With payroll and personal employee data involved, the check has to happen where the action actually runs.",
      tradeoff:
        "Permissions get written twice: once for what the interface shows, once for what the API allows. Only the second one really protects the data.",
    },
  ],
  tradeoffs: [
    "Attendance, leave, and payroll form a chain, so any change to one meant checking it against the other two. Nothing here could be built in isolation.",
    "Integrating with a system already in production means living inside its constraints. The boundary needed to stay clear, or both systems would have grown harder to change.",
    "Payroll leaves little room to iterate. A correct data model mattered more here than shipping fast.",
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
    "When one feature feeds another, the data model matters more than any single screen. Getting attendance right is what made leave and payroll possible.",
    "Integrating with an existing system is usually the lower-risk path. Replacing something that works is rarely the actual requirement.",
    "Permission checks belong where the work happens. Interface-level restrictions are a convenience, not a protection.",
  ],
  imageAlt: "HR management system interface showing attendance, leave and payroll modules",
  relatedSlugs: ["philantro-ai-ngo-management-platform", "verify-360-kyc-platform"],
  internalLinks: [
    {
      sentence: "React, Node.js, and PostgreSQL sit at the core of the client work I take on.",
      anchor: "See the tools I use on production builds",
      href: "/skills/",
    },
    {
      sentence: "More production platforms and full-stack applications sit in the wider archive.",
      anchor: "View other platforms I have built",
      href: "/work/",
    },
  ],
  seo: {
    title: "HR Management System | React & Node.js | Jay Patel",
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
      "PostgreSQL data modeling",
    ],
  },
};
