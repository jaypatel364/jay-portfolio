import type { Metadata } from "next";
import { SiteChrome, InnerPageHero, BlogHeroVisual } from "@/components/layout";
import { BlogIndexSection } from "@/components/sections/blog";
import {
  getBlogPostsCount,
  getBlogPostsPage,
  getBlogSettings,
  getBlogTaxonomy,
  getFeaturedBlogPosts,
  resolveFeaturedPosts,
} from "@/lib/sanity";
import {
  blogBreadcrumbJsonLd,
  blogIndexJsonLd,
  blogIndexMetadata,
  blogPage,
} from "@/settings/blog";

const DEFAULT_POSTS_PER_PAGE = 12;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBlogSettings();
  return blogIndexMetadata(settings);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category?.trim() || null;
  const search = sp.q?.trim() || null;
  const requestedPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const [settings, taxonomy, totalPublished, flaggedFeatured] = await Promise.all([
    getBlogSettings(),
    getBlogTaxonomy(),
    getBlogPostsCount(),
    getFeaturedBlogPosts(2),
  ]);

  const featured = resolveFeaturedPosts(settings, flaggedFeatured);
  const perPage = settings?.postsPerPage ?? DEFAULT_POSTS_PER_PAGE;
  const excludeFeaturedFromGrid = !category && !search && featured.length > 0;

  const postsPage = await getBlogPostsPage({
    page: requestedPage,
    perPage,
    category,
    search,
    excludeIds: excludeFeaturedFromGrid ? featured.map((p) => p._id) : undefined,
  });

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
          __html: JSON.stringify(blogIndexJsonLd(settings, totalPublished)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <main id="main">
        <InnerPageHero
          label={blogPage.hero.label}
          title={blogPage.hero.title}
          description={blogPage.hero.description}
          chips={[...blogPage.hero.chips]}
          visual={<BlogHeroVisual />}
        />
        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 pt-4 md:pt-6">
          <BlogIndexSection
            settings={settings}
            posts={postsPage.posts}
            featured={featured}
            categories={taxonomy.categories}
            totalPublished={totalPublished}
            totalResults={postsPage.total}
            page={postsPage.page}
            totalPages={postsPage.totalPages}
            initialCategory={category}
            initialSearch={search}
          />
        </div>
      </main>
    </SiteChrome>
  );
}
