"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Friendly labels for section ids used in the navbar reading badge */
const SECTION_LABELS: Record<string, string> = {
  home: "Home",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  work: "Work",
  faq: "FAQ",
  contact: "Contact",
  "who-am-i": "Who Am I",
  "why-choose": "Why Me",
  "stack-catalog": "Stack",
  services: "Services",
  "skills-work-strip": "Projects",
  process: "Process",
  "work-stats": "Overview",
  "work-catalog": "Projects",
  "work-stack": "Stack",
  "contact-form": "Message",
  "contact-explore": "Explore",
};

function formatSectionId(id: string | undefined | null): string {
  if (!id) return "Page";

  return (
    SECTION_LABELS[id] ??
    id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

/**
 * Tracks which in-page section is currently in view.
 * Discovers `section[id]` under `#main` so every route (home + inner pages) works.
 */
export function useActiveSection() {
  const pathname = usePathname();
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const main = document.getElementById("main");
    const nodes = main ? Array.from(main.querySelectorAll<HTMLElement>("section[id]")) : [];

    if (nodes.length === 0) {
      setActive("Page");
      return;
    }

    setActive(formatSectionId(nodes[0]?.id));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        const id = (top.target as HTMLElement).id;
        if (id) setActive(formatSectionId(id));
      },
      { threshold: 0.15, rootMargin: "-80px 0px -40% 0px" },
    );

    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return active;
}
