import { SiteChrome, InnerPageHero, ServicesHeroVisual } from "@/components/layout";
import { ServicesHubSection } from "@/components/sections/service-pages";
import { getAllServices, getServicesHub } from "@/lib/services";
import {
  serviceHubBreadcrumbJsonLd,
  servicesHubJsonLd,
  servicesHubMetadata,
} from "@/settings/services-seo";

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
          visual={<ServicesHeroVisual />}
        />
        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <ServicesHubSection
            services={services}
            primaryCta={hub.hero.primaryCta}
            secondaryCta={hub.hero.secondaryCta}
          />
        </div>
      </main>
    </SiteChrome>
  );
}
