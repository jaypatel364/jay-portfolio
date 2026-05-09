"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const EDUCATION = [
{
  degree: "Bachelor's in Computer Engineering",
  school: "SCET, Kalol",
  year: "2019 – 2022",
  desc: "Focused on software engineering, web development, data structures, and modern programming concepts.",
  icon: GraduationCap,
},
{
  degree: "Diploma in Computer Engineering",
  school: "GPG, Gandhinagar",
  year: "2016 – 2019",
  desc: "Built strong fundamentals in programming, databases, computer networks, and application development.",
  icon: GraduationCap,
},
  // {
  //   degree: "AWS Certified Cloud Practitioner",
  //   school: "Amazon Web Services",
  //   year: "2023",
  //   desc: "Validated understanding of AWS Cloud concepts, services, security, architecture, and pricing. Applied cloud skills to production deployments.",
  //   icon: Award,
  // },
];

export function EducationSection() {
  return (
    <section id="education" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading label="Background" title="Education" />
        {/* <SectionHeading label="Background" title="Education & Certifications" /> */}


        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />

          <div className="space-y-12">
            {EDUCATION.map((item, i) => {
              const Icon = item.icon;
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.degree}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 z-10 -translate-x-1/2 md:left-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-card">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-glow">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {item.year}
                      </span>
                      <h3 className="font-heading mt-2 text-base font-bold">{item.degree}</h3>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">{item.school}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
