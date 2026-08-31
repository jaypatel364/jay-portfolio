import { Mail } from "lucide-react";
import { siteConfig } from "@/settings";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";

const links = [
  { icon: GithubIcon, href: siteConfig.github, label: "GitHub", external: true },
  { icon: LinkedinIcon, href: siteConfig.linkedin, label: "LinkedIn", external: true },
  { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email", external: false },
];

/** Static anchors — no client JS, and the profile links stay crawlable. */
export function HeroSocials() {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className="hidden h-px w-10 bg-gradient-to-r from-transparent to-border sm:block"
        aria-hidden="true"
      />

      <ul className="flex items-center gap-2.5">
        {links.map(({ icon: Icon, href, label, external }) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
              aria-label={label}
              className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-primary hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Icon className="relative h-[19px] w-[19px]" />
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <span
        className="hidden h-px w-10 bg-gradient-to-l from-transparent to-border sm:block"
        aria-hidden="true"
      />
    </div>
  );
}
