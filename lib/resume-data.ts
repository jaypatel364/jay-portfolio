/**
 * Single source of truth for resume content.
 * Imported by both the portfolio sections and the /resume print route.
 */

export interface Experience {
  title: string;
  company: string;
  companyUrl: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  desc: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    title: "Full Stack Developer",
    company: "Krishang Technolab",
    companyUrl: "https://www.krishangtechnolab.com",
    location: "Ahmedabad, India",
    period: "2023 – Present",
    description:
      "MERN Stack Developer with experience in building scalable web applications, dynamic form systems, and team collaboration using Agile methodologies.",
    highlights: [
      "Built scalable React.js and Node.js platform features with API integrations",
      "Led a project and mentored 5 junior developers",
      "Created a dynamic form system supporting 100+ configurable forms",
      "Improved code quality through Git workflows, Jira, and peer reviews",
    ],
  },
  {
    title: "Web Developer Intern",
    company: "Krishang Technolab",
    companyUrl: "https://www.krishangtechnolab.com",
    location: "Ahmedabad, India",
    period: "August 2022 – December 2022",
    description:
      "Contributed to frontend development using React and TypeScript. Participated in agile sprints and collaborated with designers on UI/UX improvements.",
    highlights: [
      "Built an internal HR management tool for attendance and leave tracking",
      "Developed automated notification and holiday management features",
      "Collaborated with 4 developers to improve UI and boost performance by 20%",
    ],
  },
];

export const EDUCATION: Education[] = [
  {
    degree: "Bachelor's in Computer Engineering",
    school: "SCET, Kalol",
    year: "2019 – 2022",
    desc: "Focused on software engineering, web development, data structures, and modern programming concepts.",
  },
  {
    degree: "Diploma in Computer Engineering",
    school: "GPG, Gandhinagar",
    year: "2016 – 2019",
    desc: "Built strong fundamentals in programming, databases, computer networks, and application development.",
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux / Zustand", "HTML / CSS"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "REST APIs", "GraphQL"],
  },
  {
    category: "Tools & DevOps",
    skills: ["Git / GitHub", "Docker", "AWS", "Jest / Vitest", "CI/CD", "Figma"],
  },
];
