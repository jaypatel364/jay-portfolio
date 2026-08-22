import { SiteChrome, InnerPageHero, SkillsHeroVisual } from "@/components/layout";
import { ServicesSection } from "@/components/sections/services";
import { ProcessSection } from "@/components/sections/process";
import { SkillsWorkStripSection } from "@/components/sections/projects";
import { SkillsCatalogSection } from "@/components/sections/skills/SkillsCatalogSection";
import {
  skillsPageMetadata,
  innerPageBreadcrumbJsonLd,
  servicesItemListJsonLd,
  skillsCatalogJsonLd,
} from "@/settings/seo";
import { innerPages } from "@/settings/pages";

export const metadata = skillsPageMetadata;

const page = innerPages.skills;

export default function SkillsPage() {
  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(innerPageBreadcrumbJsonLd(page.label, "skills")).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesItemListJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(skillsCatalogJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <InnerPageHero
          label={page.hero.label}
          title={page.hero.title}
          description={page.hero.description}
          chips={page.hero.chips}
          visual={<SkillsHeroVisual />}
        />
        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <SkillsCatalogSection />
          <ServicesSection />
          <SkillsWorkStripSection />
          <ProcessSection />
        </div>
      </main>
    </SiteChrome>
  );
}
