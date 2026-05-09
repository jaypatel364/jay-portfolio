"use client";

import { motion } from "framer-motion";
import { Code2, Server, Database, Zap } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const HIGHLIGHTS = [
  { icon: Code2, title: "Frontend", desc: "React, Next.js, TypeScript" },
  { icon: Server, title: "Backend", desc: "Node.js, Express, REST/GraphQL" },
  { icon: Database, title: "Database", desc: "MongoDB, PostgreSQL, Redis" },
  { icon: Zap, title: "DevOps", desc: "Docker, AWS, CI/CD" },
];

export function AboutSection() {
  return (
    <section id="about" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="About" title="Who I Am" />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              I'm a passionate full-stack developer with over 3 years of experience building modern
              web applications. I specialize in the{" "}
              <span className="font-semibold text-foreground">MERN stack</span> and love turning
              complex business requirements into clean, performant code.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              From modern frontend interfaces to robust backend systems and API integrations, I love
              working across the full stack. I focus on writing maintainable code, building reusable
              architectures, and continuously improving performance and developer experience.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Beyond development, I enjoy exploring new technologies, building side projects,
              mentoring teammates, and continuously learning to grow as an engineer.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-glow"
              >
                <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
