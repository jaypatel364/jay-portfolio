import { SiteChrome, InnerPageHero, ContactHeroVisual } from "@/components/layout";
import { ContactExploreSection, ContactPageSection } from "@/components/sections/contact";
import { contactPageJsonLd, contactPageMetadata, innerPageBreadcrumbJsonLd } from "@/settings/seo";
import { innerPages } from "@/settings/pages";

export const metadata = contactPageMetadata;

const page = innerPages.contact;

export default function ContactPage() {
  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(innerPageBreadcrumbJsonLd(page.label, "contact")).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <InnerPageHero
          label={page.hero.label}
          title={page.hero.title}
          description={page.hero.description}
          chips={page.hero.chips}
          visual={<ContactHeroVisual />}
        />
        <ContactPageSection />
        {/* <ContactTrustStrip /> */}
        <ContactExploreSection />
      </main>
    </SiteChrome>
  );
}
