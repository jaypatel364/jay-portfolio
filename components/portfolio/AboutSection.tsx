"use client";

import { motion } from "framer-motion";
import { Code2, Server, Database, Zap, Hammer, ArrowUpRight, BookOpen } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";

const HIGHLIGHTS = [
  { icon: Code2, title: "Frontend", desc: "React, Next.js, TypeScript" },
  { icon: Server, title: "Backend", desc: "Node.js, Express, REST/GraphQL" },
  { icon: Database, title: "Database", desc: "MongoDB, PostgreSQL, Redis" },
  { icon: Zap, title: "DevOps", desc: "Docker, AWS, CI/CD" },
];

export function AboutSection() {
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const building = siteConfig.currentlyBuilding;
  const learning = siteConfig.currentlyLearning;

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
              I&apos;m a passionate full-stack developer with over {expLabel} years of experience
              building modern web applications. I specialize in the{" "}
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

            {/* Currently building badge */}
            {building && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {building.url ? (
                  <a
                    href={building.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 transition-all hover:border-primary/40 hover:bg-primary/10"
                  >
                    <CurrentlyBuildingContent building={building} />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                    <CurrentlyBuildingContent building={building} />
                  </div>
                )}
              </motion.div>
            )}

            {/* What I'm learning badge */}
            {learning.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Currently learning
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {learning.map((item) => (
                      <span
                        key={item.name}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
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

// ── internal sub-component ──────────────────────────────────────────────────

interface BuildingInfo {
  name: string;
  description: string;
  url: string | null;
}

function CurrentlyBuildingContent({ building }: { building: BuildingInfo }) {
  return (
    <>
      {/* Animated hammer icon */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Hammer className="h-4 w-4 animate-[wave_2s_ease-in-out_infinite]" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Currently building
        </p>
        <p className="text-sm font-semibold text-foreground">{building.name}</p>
        <p className="text-xs text-muted-foreground">{building.description}</p>
      </div>
      {building.url && (
        <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary" />
      )}
    </>
  );
}
