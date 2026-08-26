import type { Metadata } from "next";
import { SiteChrome, InnerPageHero, BlogHeroVisual } from "@/components/layout";
import { BlogIndexSection } from "@/components/sections/blog";
import { getBlogPosts, getBlogSettings, getBlogTaxonomy, resolveFeaturedPosts } from "@/lib/sanity";
import {
  blogBreadcrumbJsonLd,
  blogIndexJsonLd,
  blogIndexMetadata,
  blogPage,
} from "@/settings/blog";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBlogSettings();
  return blogIndexMetadata(settings);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const [settings, posts, taxonomy] = await Promise.all([
    getBlogSettings(),
    getBlogPosts(),
    getBlogTaxonomy(),
  ]);
  const featured = resolveFeaturedPosts(settings, posts);

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            blogBreadcrumbJsonLd([
              { name: "Home", path: "" },
              { name: "Blog", path: "blog" },
            ]),
          ).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogIndexJsonLd(settings, posts.length)).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <InnerPageHero
          label={blogPage.hero.label}
          title={settings?.title || blogPage.hero.title}
          description={settings?.description || blogPage.hero.description}
          chips={[...blogPage.hero.chips]}
          visual={<BlogHeroVisual />}
        />
        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 pt-4 md:pt-6">
          <BlogIndexSection
            settings={settings}
            posts={posts}
            featured={featured}
            categories={taxonomy.categories}
            initialCategory={sp.category ?? null}
          />
        </div>
      </main>
    </SiteChrome>
  );
}
