import dynamic from "next/dynamic";
import { homePageJsonLdSchemas } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { ThemeProvider } from "@/hooks/use-theme";
import { Suspense } from "react";
import { PageTransition, PageTransitionItem } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { BackToTop } from "@/components/layout/BackToTop";
import { LoadingScreenWrapper } from "@/components/layout/LoadingScreenWrapper";
import { Footer } from "@/components/layout/Footer";
import { GlobalCtaGate } from "@/components/layout/GlobalCtaGate";
import { HomeOverlays } from "@/components/layout/HomeOverlays";
import { SectionErrorBoundary } from "@/components/shared";
import { HeroSection } from "@/components/sections/hero";

/** Below-fold sections — code-split so hero paints with less JS. SSR kept for SEO. */
const sectionFallback = () => <div className="min-h-[32vh]" aria-hidden="true" />;

const AboutSection = dynamic(
  () => import("@/components/sections/about").then((m) => ({ default: m.AboutSection })),
  { loading: sectionFallback },
);
const SkillsSection = dynamic(
  () => import("@/components/sections/skills").then((m) => ({ default: m.SkillsSection })),
  { loading: sectionFallback },
);
const ExperienceSection = dynamic(
  () => import("@/components/sections/experience").then((m) => ({ default: m.ExperienceSection })),
  { loading: sectionFallback },
);
const EducationSection = dynamic(
  () => import("@/components/sections/education").then((m) => ({ default: m.EducationSection })),
  { loading: sectionFallback },
);
const ProjectsSection = dynamic(
  () => import("@/components/sections/projects").then((m) => ({ default: m.ProjectsSection })),
  { loading: sectionFallback },
);
const FAQSection = dynamic(
  () => import("@/components/sections/faq").then((m) => ({ default: m.FAQSection })),
  { loading: sectionFallback },
);

export default function Home() {
  return (
    <ThemeProvider>
      {/*
       * ── JSON-LD Structured Data ─────────────────────────────────────────
       * Injected as <script type="application/ld+json"> in the <head>.
       * Includes: Person, WebSite, ProfilePage, and FAQ schemas.
       * All schema content is defined in lib/seo.ts — edit it there.
       */}
      {homePageJsonLdSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      {/*
       * LoadingScreenWrapper:
       *   - Controlled by siteConfig.showLoadingScreen
       *   - Plays the boot sequence once per session (sessionStorage)
       *   - Overlays the boot UI; page HTML is always in the document (SEO)
       */}
      <LoadingScreenWrapper>
        <div className="site-shell relative min-h-screen bg-background text-foreground">
          <ScrollProgressBar />
          <Suspense fallback={null}>
            <HomeOverlays />
          </Suspense>

          <PageTransition>
            <PageTransitionItem>
              <Navbar />
            </PageTransitionItem>

            <PageTransitionItem>
              <main id="main">
                <SectionErrorBoundary section="Hero">
                  <HeroSection />
                </SectionErrorBoundary>
                <SectionErrorBoundary section="About">
                  <AboutSection />
                </SectionErrorBoundary>
                <SectionErrorBoundary section="Skills">
                  <SkillsSection />
                </SectionErrorBoundary>
                <SectionErrorBoundary section="Experience">
                  <ExperienceSection />
                </SectionErrorBoundary>
                <SectionErrorBoundary section="Education">
                  <EducationSection />
                </SectionErrorBoundary>
                <SectionErrorBoundary section="Projects">
                  <ProjectsSection />
                </SectionErrorBoundary>
                {siteConfig.showFAQ && (
                  <SectionErrorBoundary section="FAQ">
                    <FAQSection />
                  </SectionErrorBoundary>
                )}
              </main>
            </PageTransitionItem>

            <PageTransitionItem>
              <GlobalCtaGate />
              <Footer />
            </PageTransitionItem>
          </PageTransition>

          <BackToTop />
        </div>
      </LoadingScreenWrapper>
    </ThemeProvider>
  );
}
