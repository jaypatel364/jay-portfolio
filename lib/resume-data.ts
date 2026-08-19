/**
 * Experience + education shown on the site.
 * The downloadable CV is `public/jay-patel-resume.pdf` (not a duplicate HTML page).
 */

export interface Experience {
  title: string;
  company: string;
  companyUrl: string;
  location: string;
  period: string;
  startYear: string;
  endYear: string;
  description: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  desc: string;
}

export const EXPERIENCES: Experience[] = [
  {
    title: "Full Stack Developer",
    company: "Krishang Technolab",
    companyUrl: "https://www.krishangtechnolab.com",
    location: "Ahmedabad, India",
    period: "December 2022 – Present",
    startYear: "2022",
    endYear: "Present",
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
    period: "August 2022 – November 2022",
    startYear: "2022",
    endYear: "2022",
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
