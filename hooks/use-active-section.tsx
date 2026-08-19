"use client";

import { useEffect, useState } from "react";

const SECTIONS = ["home", "about", "skills", "experience", "education", "work", "faq", "contact"];

export function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          const id = top.target.id;
          if (SECTIONS.includes(id)) setActive(id);
        }
      },
      { threshold: 0.15, rootMargin: "-80px 0px -40% 0px" },
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}
