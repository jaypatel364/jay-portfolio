# Body Editor Guide

**Rich text / Portable Text features available in the post body.**

Use this when writing or generating article content. Pick the right block for the job — don't put everything in plain paragraphs.

**Reference post:** _Rendering Sanity Portable Text in Next.js: A Production Checklist_ shows most of these in a real article.

---

## Text formatting (built-in)

| Feature              | Use for                                                          |
| -------------------- | ---------------------------------------------------------------- |
| **Normal text**      | Body copy, introductions, explanations                           |
| **H2**               | Main sections (`##` shortcut)                                    |
| **H3**               | Subsections under an H2 (`###` shortcut)                         |
| **H4**               | Small sub-headings (`####` shortcut)                             |
| **Bold**             | Key terms, emphasis (`**text**`)                                 |
| **Italic**           | Light emphasis (`*text*`)                                        |
| **Underline**        | Rare highlight                                                   |
| **Strikethrough**    | Deprecated or crossed-out terms                                  |
| **Inline code**      | Short identifiers — `useState`, file names, flags (`` `code` ``) |
| **Bullet list**      | Unordered points (`- item`)                                      |
| **Numbered list**    | Steps, ordered instructions (`1. item`)                          |
| **Blockquote style** | Short one-line quotes in the flow of text                        |
| **External link**    | Links to docs, GitHub, other websites                            |
| **Internal link**    | Links to other posts, categories, or authors in this blog        |

> **Tip:** Paste a URL on selected text to auto-create a link. Drag blocks to reorder.

---

## Custom blocks

### Callout

**Use for:** Tips, warnings, notes, important reminders, examples, best practices.

| Tone                    | Good for                                           |
| ----------------------- | -------------------------------------------------- |
| Info / Note             | Neutral context or background                      |
| Tip / Pro tip           | Helpful shortcuts or expert advice                 |
| Success                 | "You're done" or shippable criteria                |
| Warning / Danger        | Security issues, breaking changes, things to avoid |
| Important               | Pre-publish reminders, must-read notes             |
| Question                | Rhetorical prompts or "still doing X?"             |
| Example / Best practice | Patterns to follow                                 |
| Key takeaway            | Short summary at end of a section                  |

---

### Code

**Use for:** Multi-line code samples — GROQ, TypeScript, bash, JSON, etc.

Set the **language** and optional **filename** (e.g. `app/page.tsx`).

---

### Code block (legacy)

**Use for:** Same as Code, but only if editing old posts. **Prefer Code for new content.**

Extra options: line numbers, highlight specific lines.

---

### Image

**Use for:** A single screenshot, diagram, or photo.

- Always add **alt text** (required)
- Optional **caption** and **alignment** (default, wide, full width, left, right)
- Optional **link** when image should be clickable

---

### Gallery

**Use for:** 2–12 related images shown together (before/after, screenshots, portfolio shots).

- **Grid** — side-by-side layout
- **Carousel** — swipeable set

Each image needs **alt text**.

---

### Quote

**Use for:** Standout quotes with attribution — not short inline quotes (use blockquote style for those).

- Add **author**, **source**, and **source URL** when known
- **Pull quote** — big emphasis in the middle of an article
- **Large** — hero-style quote

---

### Call to action (CTA)

**Use for:** End-of-article banners — read another post, subscribe, download, contact.

- Pick a **template** (primary, newsletter, get started, etc.)
- **Title** + optional description + **button**
- Optional second button
- Best placed **near the end** of the post

---

### Button

**Use for:** A single action link mid-article — lighter than a full CTA banner.

- Label + URL
- Style: primary, secondary, or outline
- Open in new tab when linking externally

---

### Embed

**Use for:** Videos and third-party embeds.

| Provider       | Use for                 |
| -------------- | ----------------------- |
| YouTube        | Tutorial or demo videos |
| Vimeo          | Hosted video            |
| Twitter / X    | Tweet embed             |
| CodePen        | Live code demo          |
| Generic oEmbed | Other supported URLs    |

Add a **caption** when the embed needs context.

---

### Table

**Use for:** Comparisons, checklists, feature matrices, side-by-side data.

- First row is usually the **header**
- Good for "Option A vs Option B" or step/status tables

---

### FAQ

**Use for:** Common questions and answers readers can expand in the article.

- Section title (default: "Frequently asked questions")
- Add **question + answer** pairs
- Use at the end of tutorials or when readers often ask the same things

---

### Table of contents

**Use for:** Long articles so readers can jump to sections.

- Default title: "On this page"
- Choose which headings to include (H2, H3, H4)
- Place **after the intro**, before the first major section
- Only worth it on **long posts** (4+ sections)

---

### Stats

**Use for:** 2–4 headline numbers — metrics, targets, quick facts.

Examples: `"12"` + `"min read"`, `"99%"` + `"uptime"`, `"3"` + `"steps"`.

---

### Divider

**Use for:** Visual break between major parts of the article.

- **Line** — standard section break
- **Dots** — lighter separator
- **Space** — extra whitespace only

Good before "Next steps" or the conclusion.

---

### Custom HTML

**Use for:** Rare custom markup — badges, special styling not covered by other blocks.

- Frontend sanitizes before render
- **Avoid scripts** — keep it simple
- Prefer other blocks when possible

---

## Quick picks — "I want to…"

| I want to…                         | Use                         |
| ---------------------------------- | --------------------------- |
| Warn about a mistake               | Callout → Warning or Danger |
| Share a pro tip                    | Callout → Tip or Pro tip    |
| Show code                          | Code block                  |
| Add a screenshot                   | Image                       |
| Show multiple screenshots          | Gallery                     |
| Quote someone properly             | Quote block                 |
| Link to another blog post          | Internal link (in text)     |
| Compare two options                | Table                       |
| Answer common questions            | FAQ                         |
| Help readers navigate a long post  | Table of contents           |
| Highlight key numbers              | Stats                       |
| Promote next article or newsletter | CTA block                   |
| Add one doc/repo link              | Button                      |
| Embed a YouTube walkthrough        | Embed                       |
| Break before the conclusion        | Divider                     |

---

## Simple article flow (example)

```
Intro paragraph
→ Callout (note) — why this matters
→ H2 section
→ Prose + inline code
→ Code block (example)
→ Callout (pro tip)
→ H2 next section
→ Image or Table
→ FAQ (if needed)
→ Divider
→ H2 Next steps (numbered list)
→ CTA block
```

---

## Avoid

| Don't                              | Do instead                        |
| ---------------------------------- | --------------------------------- |
| Put warnings in plain text         | Callout                           |
| Paste code in a paragraph          | Code block                        |
| Skip image alt text                | Always describe the image         |
| Stack multiple CTAs                | One CTA at the end                |
| Use H1 in body                     | Title is already H1 — start at H2 |
| Use Custom HTML for whole sections | Use the proper blocks above       |

---

_Body editor blocks: `callout` · `code` · `codeBlock` · `imageBlock` · `galleryBlock` · `quoteBlock` · `ctaBlock` · `buttonBlock` · `embedBlock` · `table` · `faqBlock` · `tocBlock` · `statsBlock` · `dividerBlock` · `htmlBlock`_
