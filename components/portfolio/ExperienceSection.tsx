"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const EXPERIENCES = [
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
      "Improved code quality through Git workflows, Jira, and peer reviews"
    ],
  },
  // {
  //   title: "Full Stack Developer",
  //   company: "Digital Solutions Ltd.",
  //   companyUrl: "https://example.com",
  //   location: "New York, NY",
  //   period: "2021 – 2023",
  //   description:
  //     "Developed and maintained multiple client-facing applications using the MERN stack. Collaborated with cross-functional teams to deliver high-quality software.",
  //   highlights: [
  //     "Built real-time dashboard serving 50K daily active users",
  //     "Integrated third-party APIs and payment gateways",
  //     "Mentored 2 junior developers on best practices",
  //   ],
  // },
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
      "Collaborated with 4 developers to improve UI and boost performance by 20%.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Career" title="Work Experience" />

        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/50 via-border to-border md:left-8 md:block" />

          <div className="space-y-8">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={exp.title + exp.company}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-6 z-10 hidden -translate-x-1/2 md:left-8 md:block">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                    className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </motion.div>
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="group ml-0 md:ml-20"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow md:p-8">
                    {/* Gradient accent */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <h3 className="font-heading text-lg font-bold text-foreground">
                          {exp.title}
                        </h3>
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                        >
                          {exp.company}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1">
                          <Calendar className="h-3 w-3" />
                          {exp.period}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1">
                          <MapPin className="h-3 w-3" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    <ul className="mt-4 space-y-2">
                      {exp.highlights.map((highlight, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.1 + j * 0.05 + 0.3 }}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          {highlight}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Bottom indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex items-center justify-center"
          >
            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                3+ years of professional experience
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
