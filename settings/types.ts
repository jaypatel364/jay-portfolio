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
