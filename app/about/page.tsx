import { SiteChrome, InnerPageHero, AboutHeroVisual } from "@/components/layout";
import { WhoAmISection } from "@/components/sections/who-am-i";
import { WhyChooseSection } from "@/components/sections/why-choose";
import { ExperienceSection } from "@/components/sections/experience";
import { EducationSection } from "@/components/sections/education";
import { aboutPageMetadata, innerPageBreadcrumbJsonLd, personJsonLd } from "@/settings/seo";
import { innerPages } from "@/settings/pages";

export const metadata = aboutPageMetadata;

const page = innerPages.about;

export default function AboutPage() {
  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(innerPageBreadcrumbJsonLd(page.label, "about")).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <InnerPageHero
          label={page.hero.label}
          title={page.hero.title}
          description={page.hero.description}
          chips={page.hero.chips}
          visual={<AboutHeroVisual />}
        />
        <WhoAmISection />
        <WhyChooseSection />
        <ExperienceSection />
        <EducationSection />
      </main>
    </SiteChrome>
  );
}
