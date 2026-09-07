import { BlogPostCard as PostCard } from "@/components/sections/blog/BlogPostCard";
import type { BlogPostCard } from "@/lib/sanity/types";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceResourcesRail({ posts }: { posts: BlogPostCard[] }) {
  if (!posts.length) return null;

  return (
    <SectionFrame
      id="related-resources"
      label="Insights"
      title="Related articles & guides"
      description="Topic clusters connect services with deeper articles — explore guides related to this service."
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
