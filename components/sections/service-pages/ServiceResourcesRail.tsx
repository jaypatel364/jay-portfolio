import type { Service } from "@/lib/services/types";
import { getServiceSectionHeading, getServiceSectionSupport } from "@/lib/services";
import { BlogPostCard as PostCard } from "@/components/sections/blog/BlogPostCard";
import type { BlogPostCard } from "@/lib/sanity/types";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceResourcesRail({
  service,
  posts,
}: {
  service: Service;
  posts: BlogPostCard[];
}) {
  if (!posts.length) return null;

  return (
    <SectionFrame
      id="related-resources"
      label="Insights"
      title={getServiceSectionHeading(service, "relatedPosts")}
      description={getServiceSectionSupport(service, "relatedPosts")}
      fullBleed
    >
      <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post._id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
