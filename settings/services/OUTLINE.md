# Service Page Outline (Fixed IA)

**Purpose:** One consistent page structure for every service slug.  
**Audience:** Product, design, engineering, and SEO.  
**Rule:** Same outline on all service pages. Content changes per service. UI treatment can evolve later without changing this order.

---

## Fixed page flow

| #   | Section                      | Internal key      | Always shown?     | SEO / content purpose                                         |
| --- | ---------------------------- | ----------------- | ----------------- | ------------------------------------------------------------- |
| 1   | SEO Hero                     | `hero`            | Always            | Primary H1, value prop, CTAs, service context                 |
| 2   | What I Do                    | `whatWeDo`        | Always            | Explain the service, scope, and what the work includes        |
| 3   | Service Capabilities         | `capabilities`    | Always            | Breadth of offerings; scannable capability coverage           |
| 4   | Problems I Solve             | `problems`        | Always            | Customer pain points this service addresses                   |
| 5   | My Process                   | `process`         | Always            | How the engagement runs from start to delivery                |
| 6   | Technologies & Tools         | `technologies`    | Always            | Stack credibility; categorized tools (not a logo dump)        |
| 7   | How the Pieces Connect       | `piecesConnect`   | Always            | System story — layers work together, not as isolated services |
| 8   | Use Cases                    | `useCases`        | Always            | Relevant product / industry scenarios                         |
| 9   | Who This Service Is For      | `audiences`       | Always            | Audience fit (“this is for me”)                               |
| 10  | Deliverables                 | `deliverables`    | Always            | Concrete outputs the client receives                          |
| 11  | Benefits & Outcomes          | `benefits`        | Always            | Technical + business outcomes (no fake metrics)               |
| 12  | Case Studies / Work Examples | `caseStudies`     | If projects exist | Proof with real work                                          |
| 13  | FAQ                          | `faqs`            | If FAQs exist     | Long-tail questions; FAQ schema                               |
| 14  | You May Also Need            | `relatedServices` | If related exist  | Internal linking across the service ecosystem                 |
| 15  | Related Articles & Guides    | `relatedPosts`    | If posts exist    | Service → knowledge → service topic clusters                  |
| 16  | Global Contact CTA           | Site chrome       | Always            | Site-wide contact CTA — do **not** duplicate on the page      |

---

## Consistency rules

1. **One outline for all services** — Full-Stack, SaaS, MVP, API & Backend, Performance, Frontend, and future slugs.
2. **Do not reorder sections per service** for design experiments. Optional sections hide when empty; they do not reshuffle the list.
3. **Do not merge sections** (e.g. Problems + Audiences) in a way that breaks this outline.
4. **No sticky sidebar / blog TOC** — the page is a continuous scroll journey.
5. **One primary contact CTA at the end** — reuse the global Contact CTA; avoid a second competing contact block.
6. **UI can change later** — layout, typography, and visuals are free to improve; the section order and jobs stay fixed.
7. **Content counts (locked for consistency)** — `process` must have **8** steps; `useCases` must have **6** items on every service page.

---

## What varies per service (content only)

| Field area               | Examples of what changes                                                |
| ------------------------ | ----------------------------------------------------------------------- |
| Hero                     | H1, description, CTAs, trust lines, tech chips                          |
| What I Do                | Heading + paragraphs; optional editorial statement                      |
| Capabilities             | Titles, descriptions, related service links                             |
| Problems                 | Pain points specific to this service                                    |
| Process                  | Steps and descriptions                                                  |
| Technologies             | Categories and tools                                                    |
| Pieces Connect           | Diagram narrative / industries (same section, service-specific visuals) |
| Use cases                | Relevant scenarios only                                                 |
| Audiences                | Who should buy this service                                             |
| Deliverables             | Concrete outputs                                                        |
| Benefits                 | Outcomes (honest; no invented stats)                                    |
| Case studies             | Project slugs that map to real work                                     |
| FAQs                     | Service-specific Q&A                                                    |
| Related services / posts | Internal links for that topic cluster                                   |

---

## SEO notes (for review / feedback)

Use this section when sharing the outline with SEO. Feedback should map to a row in the fixed flow above.

### On-page goals

- **One clear primary intent per page** (commercial / hire for this service).
- **H1 in the Hero** matches the primary keyword strategy for that slug.
- **Section H2s** stay predictable across pages so crawlers and users learn the pattern.
- **Body copy stays comprehensive** — improve presentation, do not strip useful SEO text just to look cleaner.
- **Internal links:** Capabilities → related services; Related Services; Related Articles; Work/case studies.
- **FAQ block** supports long-tail questions and FAQ structured data when present.
- **Images (when added):** descriptive filenames, meaningful alt text, no keyword stuffing.

### Questions for SEO

Please review and advise on:

1. Primary keyword + H1 pattern per service slug
2. Recommended H2 wording (keep jobs the same; wording can be refined)
3. Secondary keywords / entities to reinforce in which sections
4. Long-tail FAQ candidates per service
5. Internal linking priorities (service ↔ service, service ↔ blog, service ↔ work)
6. Meta title / description patterns for hub + detail pages
7. Any section that should be stronger for search (without changing the fixed order)

### Out of scope for SEO rewrites

- Inventing fake metrics or social proof numbers
- Adding a sticky TOC / article sidebar
- Duplicating a second global Contact CTA
- Reordering the outline per service unless we update this document first

---

## Implementation reference

| Concern                 | Location                                                      |
| ----------------------- | ------------------------------------------------------------- |
| Canonical section order | `lib/services/types.ts` → `DEFAULT_SERVICE_SECTION_ORDER`     |
| Page renderer           | `components/sections/service-pages/ServicePageExperience.tsx` |
| Per-service content     | `settings/services/pages/*.ts`                                |
| Hub page                | `/services/` → `settings/services/hub.ts`                     |
| Detail routes           | `/services/[slug]/`                                           |

Optional sections render only when data exists (`caseStudies`, `faqs`, `relatedServices`, `relatedPosts`). Empty optional sections are omitted; remaining sections keep the same relative order.

---

## Approved “keep concept” sections

These may get spacing / polish later, but the concept stays:

- FAQ
- Related Articles & Guides
- You May Also Need (related services)
- Global Contact CTA

## UI lock status (visual only — outline unchanged)

| Section                         | UI status                                                               |
| ------------------------------- | ----------------------------------------------------------------------- |
| Capabilities                    | Locked — Skills card grid                                               |
| What I Do                       | Locked — badge + heading + visual / statement + checklist + outline CTA |
| Problems                        | Locked                                                                  |
| How the Pieces Connect (System) | Locked                                                                  |
| Who This Service Is For (Fit)   | Locked                                                                  |
| Benefits & Outcomes             | Locked                                                                  |
| FAQ                             | Locked                                                                  |
| Connected services              | Locked                                                                  |
| Insights (related posts)        | Locked                                                                  |
| Global Contact CTA              | Locked                                                                  |
| Process                         | Compact step rail + detail panel (less scroll)                          |
| Technologies                    | Layered chip ecosystem                                                  |
| Deliverables                    | Why Choose–style icon list + sticky visual                              |

---

## Change control

If the outline must change (add, remove, or reorder a section):

1. Update this file first.
2. Update `DEFAULT_SERVICE_SECTION_ORDER`.
3. Update `ServicePageExperience` rendering.
4. Align all service content files as needed.

Do not change the outline only in one service’s content.
