import { SiteChrome, InnerPageHero, ServicesHeroVisual } from "@/components/layout";
import { PAGE_CONTAINER } from "@/components/shared/page-container";
import { ServicesHubSection } from "@/components/sections/service-pages";
import { getAllServices, getServicesHub } from "@/lib/services";
import {
  serviceHubBreadcrumbJsonLd,
  servicesHubJsonLd,
  servicesHubMetadata,
} from "@/settings/services-seo";
import { cn } from "@/lib/utils";

export const metadata = servicesHubMetadata();

const hub = getServicesHub();

export default function ServicesPage() {
  const services = getAllServices();

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceHubBreadcrumbJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesHubJsonLd(services.length)).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <InnerPageHero
          label={hub.hero.label}
          title={hub.hero.title}
          description={hub.hero.description}
          chips={[...hub.hero.chips]}
          visual={<ServicesHeroVisual services={services.map((s) => ({ title: s.title }))} />}
        />
        <div className={cn(PAGE_CONTAINER, "pb-24")}>
          <ServicesHubSection
            services={services}
            primaryCta={hub.hero.primaryCta}
            secondaryCta={hub.hero.secondaryCta}
            overview={hub.overview}
          />
        </div>
      </main>
    </SiteChrome>
  );
}
