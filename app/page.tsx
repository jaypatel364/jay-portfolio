import { ThemeProvider } from "@/hooks/use-theme";
import { Navbar } from "@/components/portfolio/Navbar";
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
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <EducationSection />
          {/* <ProjectsSection /> */}
          {/* <TestimonialsSection /> */}
          <ContactSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
