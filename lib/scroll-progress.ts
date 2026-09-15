/** Shared scroll helpers for navbar badge + blog reading progress. */

export const BLOG_ARTICLE_BODY_ID = "blog-article-body";

/** Matches `scroll-mt-28` on article headings (fixed navbar clearance). */
const ARTICLE_HEADING_OFFSET = 112;

export function isBlogIndexPath(pathname: string): boolean {
  return pathname === "/blog" || pathname === "/blog/";
}

export function isBlogPostPath(pathname: string): boolean {
  return /^\/blog\/[^/]+\/?$/.test(pathname);
}

export function measureFirstSectionHeroThreshold(main: HTMLElement | null): number {
  const firstSection = main?.querySelector("section");
  return firstSection
    ? Math.max(firstSection.getBoundingClientRect().height * 0.65, 120)
    : window.innerHeight;
}

export function measureBlogPostHeroThreshold(): number {
  const header = document.querySelector("article > header");
  if (header) {
    return Math.max(header.getBoundingClientRect().height * 0.65, 120);
  }
  return window.innerHeight;
}

export function computePageScrollPercent(): number {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
}

export function computeArticleBodyScrollPercent(targetId = BLOG_ARTICLE_BODY_ID): number {
  const el = document.getElementById(targetId);
  if (!el) return computePageScrollPercent();

  const rect = el.getBoundingClientRect();
  const total = el.offsetHeight - window.innerHeight;
  if (total <= 0) {
    return rect.bottom <= window.innerHeight ? 100 : 0;
  }

  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  return Math.round((scrolled / total) * 100);
}

/** Current in-article heading for the navbar reading badge on blog posts. */
export function getActiveArticleHeadingLabel(): string {
  const related = document.getElementById("blog-related");
  if (related) {
    const relatedTop = related.getBoundingClientRect().top;
    if (relatedTop <= ARTICLE_HEADING_OFFSET + 4) {
      return "More posts";
    }
  }

  const headings = Array.from(
    document.querySelectorAll<HTMLElement>(
      `#${BLOG_ARTICLE_BODY_ID} h2[id], #${BLOG_ARTICLE_BODY_ID} h3[id], #${BLOG_ARTICLE_BODY_ID} h4[id]`,
    ),
  );

  if (headings.length === 0) {
    const title = document.querySelector("article h1")?.textContent?.trim();
    return title || "Article";
  }

  let current = headings[0];
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top <= ARTICLE_HEADING_OFFSET + 4) {
      current = heading;
    }
  }

  return current.textContent?.trim() ?? "Article";
}
