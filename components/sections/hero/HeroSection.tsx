import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/settings";
import { HeroBackground } from "./HeroBackground";
import { HeroActions } from "./HeroActions";
import { HeroSocials } from "./HeroSocials";

/** Server-rendered hero banner — all SEO copy is in the initial HTML. */
export function HeroSection() {
  const hero = siteConfig.hero;

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] items-start justify-center overflow-hidden px-4 pb-20 pt-24 sm:px-6 sm:pt-28"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        {siteConfig.showHeroAvailability && (
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`${hero.availabilityCta} with ${siteConfig.fullName}`}
            className="group inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.06] py-1.5 pl-3.5 pr-3 text-xs font-medium backdrop-blur-sm transition-colors duration-200 hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-foreground">{hero.availability}</span>
            <span className="h-3 w-px bg-primary/25" aria-hidden />
            <span className="inline-flex items-center gap-1 text-primary">
              {hero.availabilityCta}
              <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        )}

        <span className="mt-7 block font-heading text-[27px] font-black leading-[0.95] tracking-tight sm:text-[29px] md:text-[32px] lg:text-[35px]">
          <span className="gradient-text-animated">{siteConfig.fullName}</span>
        </span>

        <h1 className="mx-auto mt-5 max-w-4xl font-heading text-[1.6rem] font-bold leading-tight tracking-tight text-foreground [text-wrap:balance] sm:text-4xl lg:text-5xl">
          {hero.headline}
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
          {hero.lead.map((segment, i) =>
            segment.strong ? (
              <strong key={i} className="font-semibold text-foreground">
                {segment.text}
              </strong>
            ) : (
              <Fragment key={i}>{segment.text}</Fragment>
            ),
          )}
        </p>

        <div className="mt-10 flex justify-center">
          <HeroActions />
        </div>

        <div className="mt-9">
          <HeroSocials />
        </div>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-y-6 border-t border-border/70 pt-7 sm:grid-cols-4 sm:divide-x sm:divide-border/60">
          {hero.highlights.map(({ value, label }) => (
            <li key={label} className="px-2 sm:px-4">
              <p className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">
                {value}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                {label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
