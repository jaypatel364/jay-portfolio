# Blog Content Guide

**For AI authors, content generators, and editors.**

This document describes everything available in the Jay Patel portfolio blog CMS (Sanity Studio). Use it when drafting posts so content matches the schema, uses the right blocks, and reads well on [jaypateldev.com](https://jaypateldev.com).

**Reference post:** _Rendering Sanity Portable Text in Next.js: A Production Checklist_ (`/blog/sanity-portable-text-nextjs-renderer/`) demonstrates nearly every feature in a realistic technical article. When in doubt, mirror its structure.

---

## Quick rules for AI-generated posts

1. **One H1 per page** — the post `title` is the H1. Body headings start at **H2**.
2. **Lead with context** — first paragraph explains what the reader will learn and why it matters.
3. **Match block to intent** — use the decision guide below; do not dump everything into plain paragraphs.
4. **Alt text on every image** — required for cover image and `imageBlock` / gallery items.
5. **Excerpt ≤ 300 chars** — used on cards and as SEO fallback.
6. **Internal links** — link to other posts/categories/authors with `internalLink`, not raw URLs, when the target exists in the CMS.
7. **Structured data must match visible content** — if you add `FAQPage` JSON-LD, include a matching `faqBlock` in the body.
8. **Code blocks need a language** — prefer `code` (not legacy `codeBlock`) for new snippets.
9. **Scheduled/published posts** need: title, slug, excerpt, cover image (with alt), body, at least one author, publish date.
10. **Keep `noIndex: true`** until the post is ready for public search indexing.

---

## Content model overview

| Document type  | Purpose                                    |
| -------------- | ------------------------------------------ |
| `post`         | Blog article                               |
| `author`       | Person (byline + JSON-LD)                  |
| `category`     | Primary topic bucket (max 3 per post)      |
| `tag`          | Fine-grained labels                        |
| `blogSettings` | Singleton — blog index, defaults, featured |

Posts live at **`/blog/{slug}/`**.

---

## Post fields

### Content tab

| Field        | Type         | Notes                                                      |
| ------------ | ------------ | ---------------------------------------------------------- |
| `title`      | string       | Required. Becomes page H1 and default SEO title.           |
| `slug`       | slug         | Required. URL-safe, from title.                            |
| `excerpt`    | text (≤300)  | Required. Card summary + meta description fallback.        |
| `coverImage` | image + alt  | Required for publish. Hotspot supported. Optional caption. |
| `body`       | blockContent | Required for publish. See blocks below.                    |

### Publishing & taxonomy tab

| Field                | Type        | Notes                                                      |
| -------------------- | ----------- | ---------------------------------------------------------- |
| `status`             | string      | `draft` · `scheduled` · `published` · `archived`           |
| `publishedAt`        | datetime    | Required for scheduled/published. Scheduled = future date. |
| `updatedAt`          | datetime    | Optional. For “last updated” + structured data.            |
| `authors`            | reference[] | At least one for scheduled/published.                      |
| `categories`         | reference[] | Max 3. Pick one primary topic.                             |
| `tags`               | reference[] | Relevant tech/topic tags.                                  |
| `relatedPosts`       | reference[] | Max 4. Cross-link at end or in prose.                      |
| `featured`           | boolean     | Highlights on blog index. Independent of status.           |
| `readingTimeMinutes` | number      | Optional. Frontend can also compute from body.             |
| `statusNotes`        | text        | Private editor notes — not on site.                        |

### SEO tab (`seoFields`)

| Field                  | Fallback chain                                          |
| ---------------------- | ------------------------------------------------------- |
| `metaTitle`            | → post `title` (~60 chars)                              |
| `metaDescription`      | → `excerpt` (~160 chars)                                |
| `canonicalPath`        | → `/blog/{slug}/`                                       |
| `ogTitle`              | → metaTitle → title                                     |
| `ogDescription`        | → metaDescription → excerpt                             |
| `ogImage`              | → coverImage → blogSettings.defaultOgImage              |
| `twitterCard`          | `summary_large_image` (default) or `summary`            |
| `noIndex` / `noFollow` | Default `noIndex: true` until go-live                   |
| `primarySchemaType`    | `BlogPosting` · `NewsArticle` · `TechArticle` · `HowTo` |
| `structuredData[]`     | Extra JSON-LD (FAQ, HowTo, Event, etc.)                 |
| `jsonLdExtra`          | Raw JSON override (advanced)                            |
| `customHeadHtml`       | Meta/verification snippets only                         |

**Do not duplicate** tags/categories in SEO — they live on the post only.

---

## Body: inline formatting (Portable Text `block`)

### Styles

| Style      | Markdown shortcut | Use when                                                                     |
| ---------- | ----------------- | ---------------------------------------------------------------------------- |
| Normal     | —                 | Body copy, lead paragraph                                                    |
| H2         | `## `             | Major sections                                                               |
| H3         | `### `            | Subsections under H2                                                         |
| H4         | `#### `           | Small sub-headings                                                           |
| Blockquote | `> `              | Short inline quotes (1–2 sentences). For attributed quotes use `quoteBlock`. |

### Lists

- **Bullet** — `- ` or `* `
- **Numbered** — `1. ` (steps, ordered instructions)

### Text marks

| Mark      | Shortcut   | Use when                                              |
| --------- | ---------- | ----------------------------------------------------- |
| Strong    | `**text**` | Emphasis, key terms                                   |
| Emphasis  | `*text*`   | Subtle emphasis                                       |
| Underline | —          | Sparingly                                             |
| Strike    | —          | Deprecated terms                                      |
| Code      | `` ` ``    | Inline identifiers: `useState`, file names, CLI flags |

### Links

| Type                          | Use when                                                     |
| ----------------------------- | ------------------------------------------------------------ |
| **External** (`link`)         | Off-site URLs, docs, GitHub. Set `blank: true` for external. |
| **Internal** (`internalLink`) | Other posts, categories, authors in this CMS.                |

**Markdown:** paste a URL on selected text to auto-create a link.

---

## Body: custom blocks

Blocks are inserted via **+** in the editor, grouped as **Text · Media · Layout & data · Advanced**.

### When to use which block

| You have this in your content…  | Use this block     | Why                                                       |
| ------------------------------- | ------------------ | --------------------------------------------------------- |
| A tip, warning, or aside        | `callout`          | Visually distinct; 12 tone options                        |
| Code sample (>1 line)           | `code`             | Syntax highlighting, filename, line numbers               |
| Old posts with legacy code      | `codeBlock`        | Legacy only — prefer `code` for new content               |
| Single diagram or screenshot    | `imageBlock`       | Alt, caption, alignment, optional link                    |
| 2–12 related screenshots        | `galleryBlock`     | Grid or carousel                                          |
| Pull quote with attribution     | `quoteBlock`       | Author, source, URL, pull/large variants                  |
| End-of-article promotion        | `ctaBlock`         | Title + description + primary (optional secondary) button |
| Single inline action link       | `buttonBlock`      | One labeled button, primary/secondary/outline             |
| YouTube, Vimeo, CodePen, etc.   | `embedBlock`       | Video or embed with caption                               |
| Comparison or checklist data    | `table`            | Semantic rows/columns; first row(s) as header             |
| FAQ section readers see         | `faqBlock`         | Accordion-style Q&A in the article                        |
| Long article (3+ H2 sections)   | `tocBlock`         | Auto “On this page” from headings                         |
| 2–4 headline metrics            | `statsBlock`       | e.g. “12 min read”, “3 steps”, “99%”                      |
| Section break before conclusion | `dividerBlock`     | Line, dots, or space                                      |
| Custom badge/HTML snippet       | `htmlBlock`        | Rare; frontend sanitizes. No scripts.                     |
| Short philosophical one-liner   | `blockquote` style | Lighter than full `quoteBlock`                            |

---

## Block reference (fields & options)

### `callout`

| Field   | Options / notes                                                                                                                               |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `tone`  | `info` · `note` · `tip` · `proTip` · `success` · `warning` · `important` · `danger` · `question` · `example` · `bestPractice` · `keyTakeaway` |
| `title` | Optional heading                                                                                                                              |
| `body`  | Rich text (bold, em, code, links, lists)                                                                                                      |

**Tone guide:**

- `note` / `info` — neutral context
- `tip` / `proTip` — actionable shortcuts
- `success` — “you’re done” / shippable criteria
- `warning` / `danger` — security, breaking changes, anti-patterns
- `important` — pre-publish checklist items
- `question` — rhetorical or migration prompts
- `example` / `bestPractice` — patterns to copy
- `keyTakeaway` — summary box at section end

### `code` (preferred)

Sanity’s built-in code input. Set `language`, optional `filename`, paste `code`.

**Languages:** typescript, javascript, tsx, jsx, html, css, json, bash, python, sql, markdown, text.

**Use for:** GROQ queries, React components, terminal commands, config snippets.

### `codeBlock` (legacy)

Same idea with extra fields: `showLineNumbers` (default true), `highlightedLines` (e.g. `"3,5-7"`).

### `imageBlock`

| Field       | Options                                        |
| ----------- | ---------------------------------------------- |
| `alt`       | Required — describe content for screen readers |
| `caption`   | Optional visible caption                       |
| `title`     | Optional title attribute                       |
| `alignment` | `default` · `wide` · `full` · `left` · `right` |
| `linkUrl`   | Optional click-through                         |

**Use `wide`** for architecture diagrams; **`full`** for hero-style in-article images.

### `galleryBlock`

- **2–12 images**, each with required `alt`, optional `caption`
- **Layout:** `grid` or `carousel`

### `quoteBlock`

| Field       | Notes                        |
| ----------- | ---------------------------- |
| `text`      | Required quote body          |
| `author`    | Person name                  |
| `source`    | Book, talk, docs             |
| `sourceUrl` | Link to source               |
| `variant`   | `default` · `pull` · `large` |

**Use `pull`** for mid-article emphasis quotes.

### `ctaBlock`

| Field                                        | Notes                                                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `template`                                   | `primary` · `secondary` · `newsletter` · `download` · `contact` · `getStarted` · `announcement` · `custom` |
| `title` / `description`                      | Required title; optional description                                                                       |
| `buttonText` / `buttonUrl`                   | Required primary action                                                                                    |
| `secondaryButtonText` / `secondaryButtonUrl` | Optional second button                                                                                     |
| `alignment`                                  | `left` · `center`                                                                                          |

**Place near the end** — “read next”, newsletter, contact, download.

### `buttonBlock`

Single button: `label`, `url`, `style` (`primary` · `secondary` · `outline`), `openInNewTab`, `alignment`.

**Use for:** one doc link or repo link mid-article (lighter than a full CTA banner).

### `embedBlock`

| Provider  | Example use          |
| --------- | -------------------- |
| `youtube` | Tutorial walkthrough |
| `vimeo`   | Hosted demo          |
| `twitter` | Tweet/thread embed   |
| `codepen` | Live demo            |
| `oembed`  | Other oEmbed URLs    |

Always add a `caption` when the embed needs context.

### `table`

- `headerRows`: 0–3 (usually `1`)
- `rows[]` → `cells[]` → rich text `value`

**Use for:** feature matrices, renderer checklists, API comparisons.

### `faqBlock`

- Optional `title` (default: “Frequently asked questions”)
- `items[]`: `question` + `answer` (plain text)

**Pair with** `structuredData` entry `FAQPage` in SEO when targeting rich results.

### `tocBlock`

- `title` (default: “On this page”)
- `includeH2` / `includeH3` / `includeH4` (booleans)

**Place after the intro**, before the first major H2 — only on long posts (≈1,500+ words or 4+ sections).

### `statsBlock`

- **2–4 items:** `value` (e.g. `"<100ms"`, `"12"`) + `label`

**Use for:** performance targets, step counts, key numbers — not full paragraphs.

### `dividerBlock`

- `style`: `line` · `dots` · `space`

**Use before** “Next steps”, conclusion, or after a heavy section (FAQ, CTA).

### `htmlBlock`

- `html` — raw HTML (sanitized on frontend)
- `label` — editor-only note

**Use sparingly** — badges, custom markup not covered by other blocks. Never include `<script>`.

---

## Recommended article structures

### Technical tutorial / how-to

```
1. Lead paragraph (normal)
2. callout (note) — why this matters
3. H2 — problem or goal
4. Prose + inline code
5. tocBlock (if long)
6. H2 — steps
   H3 per step
   code blocks per step
   callout (proTip) after non-obvious steps
7. table — comparison or checklist (optional)
8. faqBlock — common questions
9. dividerBlock
10. H2 — next steps (numbered list)
11. ctaBlock — related post or contact
12. callout (bestPractice) — closing tip
```

**SEO:** `primarySchemaType: TechArticle` or `HowTo`; add matching `structuredData` HowTo steps.

### Opinion / essay

```
1. Strong lead
2. H2 sections with H3 sub-points
3. quoteBlock (pull) — mid-article
4. imageBlock — optional visual break
5. Short conclusion + buttonBlock to source
```

**SEO:** `BlogPosting` default is fine.

### Release notes / announcement

```
1. Lead with what shipped
2. statsBlock — version, date, impact metrics
3. H2 per feature
4. callout (important) for breaking changes
5. callout (warning) for migrations
6. ctaBlock (announcement template)
```

### Case study / portfolio piece

```
1. coverImage — hero visual
2. statsBlock — outcomes
3. galleryBlock — screenshots
4. H2 — challenge / approach / results
5. quoteBlock — client or testimonial (if any)
6. ctaBlock (contact)
```

---

## SEO & structured data pairing

| Visible content in body | Add in SEO `structuredData`              |
| ----------------------- | ---------------------------------------- |
| `faqBlock` with Q&A     | `FAQPage` entry (same questions/answers) |
| Step-by-step tutorial   | `HowTo` with `howToSteps[]`              |
| Event announcement      | `Event` with startDate, location         |
| Software/tool review    | `SoftwareApplication` or `Product`       |

**Never duplicate** `BlogPosting` in `structuredData` — the frontend builds it from post fields.

**Article schema types** (`primarySchemaType`):

- **`BlogPosting`** — general posts (default)
- **`TechArticle`** — developer/technical content
- **`NewsArticle`** — time-sensitive news
- **`HowTo`** — when the whole post is a procedure

---

## Supporting documents

### Author (`author`)

| Field    | Use                                        |
| -------- | ------------------------------------------ |
| `name`   | Byline                                     |
| `slug`   | `/author/{slug}/` if exposed               |
| `role`   | e.g. “Full Stack Developer”                |
| `avatar` | With alt text                              |
| `bio`    | Author page / JSON-LD                      |
| `email`  | Optional contact                           |
| `sameAs` | LinkedIn, GitHub, X URLs for Person schema |

### Category (`category`)

`title`, `slug`, optional `description`. **Max 3 per post** — choose the best primary fit.

### Tag (`tag`)

`title`, `slug`, optional `description`. Use for technologies and themes (e.g. Next.js, React, Sanity).

### Blog settings (`blogSettings` singleton)

- Blog index `title`, `description`
- `featuredPosts` (max 3) — manual curation on index
- `postsPerPage` (default 9)
- `defaultOgImage` — site-wide OG fallback
- `robotsIndex` / `noindexUntilReady` — global go-live flags

---

## Publishing checklist (before `published` + `noIndex: false`)

- [ ] Title clear and specific (not clickbait)
- [ ] Slug short, readable, keyword-aware
- [ ] Excerpt compelling and ≤300 characters
- [ ] Cover image with descriptive alt
- [ ] At least one author assigned
- [ ] Category + tags reflect content
- [ ] Every `imageBlock` / gallery image has alt
- [ ] Code blocks have correct language + filename where helpful
- [ ] Internal links point to real posts
- [ ] `metaDescription` ~150–160 chars (or strong excerpt)
- [ ] FAQ/HowTo structured data matches visible blocks
- [ ] Related posts (1–4) filled for longer articles
- [ ] `readingTimeMinutes` set or left for frontend calc
- [ ] Reviewed in Next.js preview — all blocks render

---

## Markdown shortcuts (editor)

| Input                  | Result        |
| ---------------------- | ------------- |
| `**bold**`             | Strong        |
| `*italic*`             | Emphasis      |
| `` `code` ``           | Inline code   |
| `## Heading`           | H2            |
| `### Heading`          | H3            |
| `- item`               | Bullet list   |
| `1. item`              | Numbered list |
| Paste URL on selection | Link          |

Drag blocks to reorder. Undo/redo supported.

---

## Frontend block types (for AI seeding / API)

Render every `_type` in `body[]`:

`block` · `code` · `codeBlock` · `imageBlock` · `galleryBlock` · `callout` · `quoteBlock` · `ctaBlock` · `buttonBlock` · `embedBlock` · `table` · `faqBlock` · `tocBlock` · `statsBlock` · `dividerBlock` · `htmlBlock`

**GROQ:** expand `imageBlock`/`galleryBlock` assets and `internalLink.reference->` in queries.

---

## Anti-patterns (avoid)

| Don’t                                   | Do instead                                                     |
| --------------------------------------- | -------------------------------------------------------------- |
| Wall of plain paragraphs for warnings   | `callout` with appropriate tone                                |
| Paste code in normal text               | `code` block with language                                     |
| Skip alt text                           | Describe what the image shows                                  |
| Raw `/blog/...` URLs for internal posts | `internalLink` reference                                       |
| FAQ only in SEO, not in body            | Visible `faqBlock` + matching JSON-LD                          |
| Multiple CTAs stacked back-to-back      | One `ctaBlock` at end; use `buttonBlock` sparingly mid-article |
| H1 in body                              | Only post title is H1                                          |
| `htmlBlock` for whole sections          | Compose with proper blocks                                     |
| `dangerouslySetInnerHTML` mindset       | Block-by-block structured content                              |

---

## Example metadata (technical post)

```yaml
title: "Rendering Sanity Portable Text in Next.js: A Production Checklist"
slug: sanity-portable-text-nextjs-renderer
excerpt: "A practical guide to mapping every Sanity block type to Next.js components..."
status: published
featured: true
readingTimeMinutes: 12
primarySchemaType: TechArticle
noIndex: true # flip false at go-live
```

Blocks used in that post: lead prose, callouts (all tones), toc, code ×2, internal links, quoteBlock, table, imageBlock, galleryBlock, statsBlock, faqBlock, codeBlock (legacy), embedBlock, blockquote, divider, numbered list, ctaBlock, buttonBlock, htmlBlock.

---

## Seed scripts (reference content)

```bash
# All-features demo draft
npx sanity exec scripts/seedDemoPost.ts --with-user-token

# Realistic technical sample (this guide’s reference post)
npx sanity exec scripts/seedTechnicalPost.ts --with-user-token
```

---

_Last updated from studio-portfolio schemas. When schemas change, update this file._
