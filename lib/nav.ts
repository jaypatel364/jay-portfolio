/**
 * Shared primary navigation — homepage sections vs dedicated routes.
 */

import { siteConfig } from "@/settings";
import { innerPages } from "@/settings/pages";

export type NavItem = {
  id: string;
  label: string;
  /** Full path — `/`, `/about/`, or `/#experience` */
  href: string;
  /** True when this item is a standalone page route */
  isRoute: boolean;
};

export const PRIMARY_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/", isRoute: true },
  {
    id: innerPages.about.navId,
    label: innerPages.about.label,
    href: `${innerPages.about.path}/`,
    isRoute: true,
  },
  {
    id: innerPages.skills.navId,
    label: innerPages.skills.label,
    href: `${innerPages.skills.path}/`,
    isRoute: true,
  },
  { id: "experience", label: "Experience", href: "/#experience", isRoute: false },
  { id: "education", label: "Education", href: "/#education", isRoute: false },
  {
    id: innerPages.work.navId,
    label: innerPages.work.label,
    href: `${innerPages.work.path}/`,
    isRoute: true,
  },
  ...(siteConfig.showFAQ
    ? [{ id: "faq", label: "FAQ", href: "/#faq", isRoute: false } as NavItem]
    : []),
  {
    id: innerPages.contact.navId,
    label: innerPages.contact.label,
    href: `${innerPages.contact.path}/`,
    isRoute: true,
  },
];

/** Footer quick links — core pages only */
export const FOOTER_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/", isRoute: true },
  {
    id: innerPages.about.navId,
    label: innerPages.about.label,
    href: `${innerPages.about.path}/`,
    isRoute: true,
  },
  {
    id: innerPages.skills.navId,
    label: innerPages.skills.label,
    href: `${innerPages.skills.path}/`,
    isRoute: true,
  },
  {
    id: innerPages.work.navId,
    label: innerPages.work.label,
    href: `${innerPages.work.path}/`,
    isRoute: true,
  },
  {
    id: innerPages.contact.navId,
    label: innerPages.contact.label,
    href: `${innerPages.contact.path}/`,
    isRoute: true,
  },
];

/** Map pathname → active nav id for inner routes */
export const PATH_TO_NAV_ID: Record<string, string> = {
  "/": "home",
  [`${innerPages.about.path}/`]: innerPages.about.navId,
  [`${innerPages.skills.path}/`]: innerPages.skills.navId,
  [`${innerPages.work.path}/`]: innerPages.work.navId,
  [`${innerPages.contact.path}/`]: innerPages.contact.navId,
};
