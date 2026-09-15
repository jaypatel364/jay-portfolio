import { SiteChrome, InnerPageHero, WorkHeroVisual } from "@/components/layout";
import { PAGE_CONTAINER } from "@/components/shared/page-container";
import {
  WorkProjectsSection,
  WorkStackLinksSection,
  WorkStatsBar,
} from "@/components/sections/projects";
import { workPageMetadata, innerPageBreadcrumbJsonLd, workPageJsonLd } from "@/settings/seo";
import { innerPages } from "@/settings/pages";
import { cn } from "@/lib/utils";

export const metadata = workPageMetadata;

const page = innerPages.work;

export default function WorkPage() {
  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(innerPageBreadcrumbJsonLd(page.label, "work")).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(workPageJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <InnerPageHero
          label={page.hero.label}
          title={page.hero.title}
          description={page.hero.description}
          chips={page.hero.chips}
          visual={<WorkHeroVisual />}
        />
        <div className={cn(PAGE_CONTAINER, "pb-24")}>
          <WorkStatsBar />
          <WorkProjectsSection />
          <WorkStackLinksSection />
        </div>
      </main>
    </SiteChrome>
  );
}
