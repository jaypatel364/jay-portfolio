import { siteConfig } from "@/settings";
import { cn } from "@/lib/utils";
import { HeroInteractive } from "./HeroInteractive";

/** Server-rendered hero — SEO-critical copy is in the initial HTML. */
export function HeroSection() {
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
          <span className="block font-heading text-6xl font-black leading-none tracking-tight sm:text-7xl lg:text-8xl">
            <span className="gradient-text-animated">{siteConfig.fullName}</span>
          </span>

          <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground [text-wrap:balance] sm:text-3xl lg:text-4xl">
            I&apos;m a Full Stack Developer Specializing in the MERN Stack
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground lg:mx-0">
            I build custom web applications with{" "}
            <strong className="font-semibold text-foreground">
              JavaScript, React, Next.js and Node.js
            </strong>
            , focusing on scalable architecture, reliable backend systems and great user
            experiences.
          </p>
        </header>
        <HeroInteractive withTerminal={withTerminal} />
      </div>
    </section>
  );
}
