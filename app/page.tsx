import { homePageJsonLdSchemas } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { ThemeProvider } from "@/hooks/use-theme";
import { Suspense } from "react";
import {
  PageTransition,
  PageTransitionItem,
  PageReveal,
  Navbar,
  ScrollProgressBar,
  BackToTop,
  LoadingScreenWrapper,
  Footer,
  HomeOverlays,
} from "@/components/layout";
import { SectionErrorBoundary } from "@/components/shared";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ExperienceSection } from "@/components/sections/experience";
import { EducationSection } from "@/components/sections/education";
import { ProjectsSection } from "@/components/sections/projects";
import { FAQSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";

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
        <PageReveal />
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
                <SectionErrorBoundary section="Contact">
                  <ContactSection />
                </SectionErrorBoundary>
              </main>
            </PageTransitionItem>

            <PageTransitionItem>
              <Footer />
            </PageTransitionItem>
          </PageTransition>

          <BackToTop />
        </div>
      </LoadingScreenWrapper>
    </ThemeProvider>
  );
}
