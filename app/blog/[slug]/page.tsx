import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/layout";
import { BlogPostArticle } from "@/components/sections/blog";
import {
  getBlogPostBySlug,
  getBlogSettings,
  getBlogSlugs,
  getMorePostsForArticle,
} from "@/lib/sanity";
import { blogBreadcrumbJsonLd, blogPostJsonLd, blogPostMetadata } from "@/settings/blog";

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getBlogPostBySlug(slug), getBlogSettings()]);

  if (!post) {
    return { robots: { index: false, follow: false } };
  }

  return blogPostMetadata(post, settings);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getBlogPostBySlug(slug), getBlogSettings()]);

  if (!post) notFound();

  const morePosts = await getMorePostsForArticle(post);

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            blogBreadcrumbJsonLd([
              { name: "Home", path: "" },
              { name: "Blog", path: "blog" },
              { name: post.title, path: `blog/${post.slug}` },
            ]),
          ).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostJsonLd(post, settings)).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <BlogPostArticle post={post} morePosts={morePosts} />
      </main>
    </SiteChrome>
  );
}
