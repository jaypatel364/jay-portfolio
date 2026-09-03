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
import { blogPostMetadata, blogPostPageJsonLdSchemas } from "@/settings/blog";

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
  const jsonLdSchemas = blogPostPageJsonLdSchemas(post, settings);

  return (
    <SiteChrome>
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <main id="main">
        <BlogPostArticle post={post} morePosts={morePosts} />
      </main>
    </SiteChrome>
  );
}
