/**
 * settings/ — single place for site identity, flags, content, and SEO.
 *
 * Prefer importing from here (or `@/lib/site-config` / `@/lib/seo` shims):
 *   import { siteConfig } from "@/settings";
 *   import { rootMetadata } from "@/settings/seo";
 */

import { identity } from "./identity";
import { features } from "./features";
import { content } from "./content";

export type { FAQCategory, FAQItem, BuildingItem, LearningItem, ProfileLink } from "./types";

export { identity } from "./identity";
export { features } from "./features";
export { content } from "./content";
export {
  chatRates,
  formatRatesLine,
  formatRatesReply,
  buildChatSystemPrompt,
  getCannedAnswers,
  randomOffTopicReply,
  OFF_TOPIC_REPLIES,
} from "./chat";
export type { CannedAnswer } from "./chat";

/**
 * Unified config object — same shape the app always used.
 * Prefer editing identity / features / content files, not this merge.
 */
export const siteConfig = {
  ...identity,
  ...features,
  ...content,
};

export type SiteConfig = typeof siteConfig;
