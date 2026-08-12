import { homePageJsonLdSchemas } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { ThemeProvider } from "@/hooks/use-theme";
import { PageTransition, PageTransitionItem } from "@/components/portfolio/PageTransition";
import { Navbar } from "@/components/portfolio/Navbar";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { BackToTop } from "@/components/portfolio/BackToTop";
import { ChatBot } from "@/components/portfolio/ChatBot";
import { CursorSpotlight } from "@/components/portfolio/CursorSpotlight";
import { KonamiEasterEgg } from "@/components/portfolio/KonamiEasterEgg";
import { SectionErrorBoundary } from "@/components/portfolio/SectionErrorBoundary";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { EducationSection } from "@/components/portfolio/EducationSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { FAQSection } from "@/components/portfolio/FAQSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { Footer } from "@/components/portfolio/Footer";
import { LoadingScreenWrapper } from "@/components/portfolio/LoadingScreen";

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/*
       * LoadingScreenWrapper:
       *   - Controlled by siteConfig.showLoadingScreen
       *   - Plays the boot sequence once per session (sessionStorage)
       *   - Hides site content behind it, reveals via split-wipe on done
       */}
      <LoadingScreenWrapper>
        <div className="relative min-h-screen bg-background text-foreground">
          {/* Non-layout overlays */}
          <CursorSpotlight />
          <ScrollProgressBar />
          <KonamiEasterEgg />

          <PageTransition>
            <PageTransitionItem>
              <Navbar />
            </PageTransitionItem>

            <PageTransitionItem>
              <main>
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
          <ChatBot />
        </div>
      </LoadingScreenWrapper>
    </ThemeProvider>
  );
}
