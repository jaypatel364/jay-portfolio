/**
 * Shared primary navigation — dedicated page routes only.
 * Home-only / in-page jumps live in SECTION_JUMP_NAV (palette + shortcuts).
 */

import { siteConfig } from "@/settings";
import { innerPages } from "@/settings/pages";

export type NavItem = {
  id: string;
  label: string;
  /** Full path — `/`, `/about/`, or `/about/#experience` */
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
  {
    id: innerPages.work.navId,
    label: innerPages.work.label,
    href: `${innerPages.work.path}/`,
    isRoute: true,
  },
  {
    id: "services",
    label: "Services",
    href: "/services/",
    isRoute: true,
  },
  {
    id: innerPages.contact.navId,
    label: innerPages.contact.label,
    href: `${innerPages.contact.path}/`,
    isRoute: true,
  },
];

/**
 * In-page jumps — not in the primary navbar.
 * Experience / Education live on About; FAQ stays on the home page.
 */
export const SECTION_JUMP_NAV: NavItem[] = [
  {
    id: "experience",
    label: "Experience",
    href: `${innerPages.about.path}/#experience`,
    isRoute: false,
  },
  {
    id: "education",
    label: "Education",
    href: `${innerPages.about.path}/#education`,
    isRoute: false,
  },
  ...(siteConfig.showFAQ
    ? [{ id: "faq", label: "FAQ", href: "/#faq", isRoute: false } as NavItem]
    : []),
];

/** Primary pages + section jumps (keyboard shortcuts, command palette) */
export const ALL_NAV_TARGETS: NavItem[] = [...PRIMARY_NAV, ...SECTION_JUMP_NAV];

/** Footer quick links — same core pages as primary nav */
export const FOOTER_NAV: NavItem[] = PRIMARY_NAV;

/** Map pathname → active nav id for page routes */
export const PATH_TO_NAV_ID: Record<string, string> = {
  "/": "home",
  [`${innerPages.about.path}/`]: innerPages.about.navId,
  [`${innerPages.skills.path}/`]: innerPages.skills.navId,
  [`${innerPages.work.path}/`]: innerPages.work.navId,
  "/services/": "services",
  [`${innerPages.contact.path}/`]: innerPages.contact.navId,
};
