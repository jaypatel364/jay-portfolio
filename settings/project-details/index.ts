/**
 * Long-form project write-ups for `/work/<slug>/`.
 *
 * Any slug with an entry in `PROJECT_DETAILS` is published, indexed (when
 * `allowIndexing` is on), and rendered as the full case study. NDA projects
 * render with `ndaNotice` and no code/demo links.
 */

import { minilistHeadlessCmsDetail } from "./minilist-headless-cms";
import { philantroAiNgoManagementPlatformDetail } from "./philantro-ai-ngo-management-platform";
import { pmsHrManagementSystemDetail } from "./pms-hr-management-system";
import { realTimeChatApplicationDetail } from "./real-time-chat-application";
import { socialMediaBackendApiDetail } from "./social-media-backend-api";
import { spendlyPersonalExpenseTrackerDetail } from "./spendly-personal-expense-tracker";
import { verify360KycPlatformDetail } from "./verify-360-kyc-platform";
import type { ProjectDetail } from "./types";

/** Detail content keyed by project slug. */
export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  [spendlyPersonalExpenseTrackerDetail.slug]: spendlyPersonalExpenseTrackerDetail,
  [socialMediaBackendApiDetail.slug]: socialMediaBackendApiDetail,
  [minilistHeadlessCmsDetail.slug]: minilistHeadlessCmsDetail,
  [realTimeChatApplicationDetail.slug]: realTimeChatApplicationDetail,
  [pmsHrManagementSystemDetail.slug]: pmsHrManagementSystemDetail,
  [philantroAiNgoManagementPlatformDetail.slug]: philantroAiNgoManagementPlatformDetail,
  [verify360KycPlatformDetail.slug]: verify360KycPlatformDetail,
};

/** All slugs with detail content — published and indexable. */
export const PUBLISHED_PROJECT_SLUGS = Object.keys(PROJECT_DETAILS) as PublishedProjectSlug[];

export type PublishedProjectSlug = keyof typeof PROJECT_DETAILS;

export function getProjectDetail(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS[slug];
}

export function isPublishedProjectSlug(slug: string): slug is PublishedProjectSlug {
  return slug in PROJECT_DETAILS;
}

export function hasPublishedDetail(slug: string): boolean {
  return slug in PROJECT_DETAILS;
}

export type {
  ProjectArchitecture,
  ProjectDecision,
  ProjectDetail,
  ProjectDetailSeo,
  ProjectFeature,
  ProjectInternalLink,
  ProjectTechGroup,
} from "./types";
