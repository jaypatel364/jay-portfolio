import { siteConfig } from "@/settings";
import { getExperienceLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { HeroInteractive } from "./HeroInteractive";

/** Server-rendered hero — SEO-critical copy is in the initial HTML. */
export function HeroSection() {
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const withTerminal = siteConfig.showTerminalHero;

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20 sm:pt-16 md:pt-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className={cn("relative z-10 mx-auto w-full", withTerminal ? "max-w-6xl" : "max-w-4xl")}>
        <header
          className={cn(
            withTerminal ? "text-center lg:text-left mb-10 lg:mb-0" : "text-center mb-10",
          )}
        >
          <h1 className="font-heading text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl [text-wrap:balance]">
            <span className="gradient-text-animated">{siteConfig.fullName}</span>
          </h1>
          <p className="mt-3 text-base font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Full Stack Developer
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground mx-auto max-w-lg lg:mx-0">
            Full stack developer in India. {expLabel} years with React, Next.js, and Node.js —
            real-time apps, large form systems, and MERN work that ships.
          </p>
        </header>
        <HeroInteractive expLabel={expLabel} withTerminal={withTerminal} />
      </div>
    </section>
  );
}
