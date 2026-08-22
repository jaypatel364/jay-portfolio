/** Shared types for site settings / content. */

export type FAQCategory = "work" | "tech" | "personal" | "process";

export interface FAQItem {
  category: FAQCategory;
  question: string;
  answer: string;
}

export interface BuildingItem {
  name: string;
  description: string;
  /** Set a URL to make the badge a clickable link. null = non-clickable. */
  url: string | null;
}

export interface LearningItem {
  name: string;
  icon: string;
}

/** External profile / marketplace link — null href = hidden until you add a URL. */
export interface ProfileLink {
  id: string;
  label: string;
  href: string | null;
  /** Short subtitle on Contact badges — keep to 1–2 words. */
  tagline: string;
}
