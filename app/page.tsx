import { ThemeProvider } from "@/hooks/use-theme";
import { PageTransition, PageTransitionItem } from "@/components/portfolio/PageTransition";
import { Navbar } from "@/components/portfolio/Navbar";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { BackToTop } from "@/components/portfolio/BackToTop";
import { CursorSpotlight } from "@/components/portfolio/CursorSpotlight";
import { KonamiEasterEgg } from "@/components/portfolio/KonamiEasterEgg";
import { SectionErrorBoundary } from "@/components/portfolio/SectionErrorBoundary";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { EducationSection } from "@/components/portfolio/EducationSection";
// import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
// import { TestimonialsSection } from "@/components/portfolio/TestimonialsSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { Footer } from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        {/* Non-layout overlays — outside the stagger so they don't shift */}
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
              {/* <ProjectsSection /> */}
              {/* <TestimonialsSection /> */}
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
    </ThemeProvider>
  );
}
