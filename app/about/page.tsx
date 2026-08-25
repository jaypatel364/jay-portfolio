import { SiteChrome, InnerPageHero, AboutHeroVisual } from "@/components/layout";
import { WhoAmISection } from "@/components/sections/who-am-i";
import { WhyChooseSection } from "@/components/sections/why-choose";
import { ExperienceSection } from "@/components/sections/experience";
import { EducationSection } from "@/components/sections/education";
import {
  aboutPageJsonLd,
  aboutPageMetadata,
  innerPageBreadcrumbJsonLd,
  personJsonLd,
} from "@/settings/seo";
import { innerPages } from "@/settings/pages";
import { siteConfig } from "@/settings";
import { getExperienceLabel } from "@/lib/utils";

export const metadata = aboutPageMetadata;

const page = innerPages.about;
const expLabel = getExperienceLabel(siteConfig.careerStartDate);

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
          __html: JSON.stringify(aboutPageJsonLd).replace(/</g, "\\u003c"),
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
          description={page.hero.description.replace("{expLabel}", expLabel)}
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
