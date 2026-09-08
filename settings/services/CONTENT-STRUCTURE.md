# Service Detail Page — Content Structure

**Purpose:** One reusable blueprint for every `/services/[slug]/` page.  
**Use this when:** Writing new service copy, briefing SEO, or reviewing content in Google Docs.  
**Source files:** `settings/services/pages/<slug>.ts`  
**Page order:** Same on every service — do not reorder sections.

---

## Master H2 templates (all service pages)

H2s are built from `headingKeywords` in each service file + templates in `lib/services/section-headings.ts`.  
Set keywords once per page; H2s update automatically.

| Section                 | Master H2 template                       | Full stack development example                        |
| ----------------------- | ---------------------------------------- | ----------------------------------------------------- |
| What I Do               | What My [Keyword] Services Include       | What My Full Stack Development Services Include       |
| Service Capabilities    | [Keyword Variant] Capabilities           | Full Stack Web Development Capabilities               |
| Problems I Solve        | Common [Keyword] Challenges I Solve      | Common Full Stack Development Challenges I Solve      |
| My Process              | My [Keyword] Process                     | My Full Stack Development Process                     |
| Technologies & Tools    | [Keyword] Technologies I Use             | Full Stack Development Technologies I Use             |
| How the Pieces Connect  | How [Keyword Variant] Come Together      | How Full Stack Applications Come Together             |
| Use Cases               | Where [Keyword] Applies                  | Where Full Stack Development Applies                  |
| Who This Service Is For | Who My [Keyword] Services Are For        | Who My Full Stack Development Services Are For        |
| Deliverables            | What's Included in My [Keyword] Services | What's Included in My Full Stack Development Services |
| Benefits & Outcomes     | Benefits of [Keyword Variant]            | Benefits of Full Stack Web Development                |
| Why Hire Me             | Why Hire Me as a [Role Keyword]?         | Why Hire Me as a Full Stack Developer?                |
| Case Studies            | [Keyword] Projects & Examples            | Full Stack Development Projects & Examples            |
| FAQ                     | [Keyword] Services FAQs                  | Full Stack Development Services FAQs                  |
| You May Also Need       | Related [Keyword] Services               | Related Full Stack Development Services               |
| Related Articles        | [Keyword] Guides & Resources             | Full Stack Development Guides & Resources             |

### `headingKeywords` fields (per service)

| Field           | TS key           | Full stack example         | Used in                                                                                                    |
| --------------- | ---------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Primary keyword | `keyword`        | Full Stack Development     | What I Do, Problems, Process, Technologies, Use Cases, Audiences, Deliverables, Case Studies, FAQ, Related |
| Keyword variant | `keywordVariant` | Full Stack Web Development | Capabilities, Benefits                                                                                     |
| Pieces keyword  | `piecesKeyword`  | Full Stack Applications    | How the Pieces Connect                                                                                     |
| Role keyword    | `roleKeyword`    | Full Stack Developer       | Why Hire Me                                                                                                |

```typescript
headingKeywords: {
  keyword: "Full Stack Development",
  keywordVariant: "Full Stack Web Development",
  piecesKeyword: "Full Stack Applications",
  roleKeyword: "Full Stack Developer",
},
```

**Note:** `whatWeDo.heading` is kept for legacy/SEO body copy but is **not** the section H2 anymore.

### H2 supporting paragraphs

Each scroll section (except hero and What I Do) can set a service-specific paragraph under the H2 via `sectionSupport` in the service `.ts` file. Components read it through `getServiceSectionSupport(service, key)`. Pages without `sectionSupport` fall back to sensible defaults.

```typescript
sectionSupport: {
  capabilities: "Full stack web development capabilities cover every layer…",
  problems: "Most full stack development problems come from…",
  // …capabilities, problems, process, technologies, piecesConnect,
  // useCases, audiences, deliverables, benefits, whyHire,
  // caseStudies, faqs, relatedServices, relatedPosts
},
```

Hero uses `hero.description`. What I Do uses `editorialIntro` + `whatWeDo.paragraphs`. Why Hire falls back to `whyHire.intro` when `sectionSupport.whyHire` is omitted.

---

## Section 1 — Hero banner

**UI label:** Service name (mono)  
**Section key:** `hero`  
**Always shown:** Yes

| Element            | TS key              | Suggested length | Notes                            |
| ------------------ | ------------------- | ---------------- | -------------------------------- |
| **H1**             | `hero.heading`      | 4–8 words        | Primary keyword; only H1 on page |
| Supporting content | `hero.description`  | **30–40 words**  | Value prop under H1              |
| Primary button     | `hero.primaryCta`   | 3–5 words        | → `/contact/`                    |
| Secondary button   | `hero.secondaryCta` | 3–5 words        | → `/work/` or `/contact/`        |
| Tech chips         | `hero.technologies` | 4–6 items        | Stack credibility                |

**Default CTAs (reuse when possible):**

- Primary: `Discuss your project` → `/contact/`
- Secondary: `View selected work` → `/work/`

---

## Section 2 — What I do

**UI label:** WHAT I DO  
**Section key:** `whatWeDo` + `editorialIntro` + `whatWeBuild`  
**Always shown:** Yes

| Element              | TS key                                                  | Suggested length               | Notes                                          |
| -------------------- | ------------------------------------------------------- | ------------------------------ | ---------------------------------------------- |
| **H2**               | _(from template)_                                       | —                              | `getServiceSectionHeadings(service).whatWeDo`  |
| Editorial statement  | `editorialIntro.statement`                              | 15–25 words                    | Bold lead line                                 |
| Editorial supporting | `editorialIntro.supporting`                             | 30–40 words                    | One paragraph                                  |
| Body paragraphs      | `whatWeDo.paragraphs`                                   | **3 × ~50 words** (~150 total) | **Page shows paragraphs 1–2 only**             |
| Overview             | `overview`                                              | 35–45 words                    | Used in meta/context; keep aligned with H2     |
| Highlight question   | _(fixed UI copy)_                                       | —                              | "What makes this [service] service different?" |
| Highlight list       | `Highlight question -> how service different` (first 3) | **3 × 4–6 words**              | Checklist with icons                           |

---

## Section 3 — Service capabilities

**UI H2:** `[Keyword Variant] Capabilities` (from template)  
**UI supporting (dynamic):** "30-40 words approx"
**Section key:** `capabilities`  
**Always shown:** Yes

| Element              | TS key                                      | Suggested length   | Notes                                        |
| -------------------- | ------------------------------------------- | ------------------ | -------------------------------------------- |
| **H2**               | `headingKeywords.keywordVariant` + template | —                  | e.g. Full Stack Web Development Capabilities |
| Supporting line      | _(fixed in UI)_                             | ~20 words          | Same on all pages                            |
| Capability cards     | `capabilities[]`                            | **9 items**        | Grid of service areas                        |
| Card title           | `capabilities[].title`                      | **H3** — 3–6 words | Keyword-friendly                             |
| Card description     | `capabilities[].description`                | **15–20 words**    | One sentence each                            |
| Related service link | `capabilities[].relatedServiceSlug`         | optional           | Internal link to another service             |

---

## Section 4 — Problems I solve

**UI H2 (fixed):** Common [Keyword] Challenges I Solve  
**UI supporting (dynamic):** "30-40 words approx"
**Section key:** `problems`  
**Count:** **6 cards** (2-column grid)

| Element             | TS key                   | Suggested length |
| ------------------- | ------------------------ | ---------------- |
| **H3** (pain title) | `problems[].title`       | 4–8 words        |
| Description         | `problems[].description` | 20–30 words      |

---

## Section 5 — My process

**UI H2 (fixed):** My [Keyword] Process
**UI supporting (dynamic):** "30-40 words approx"
**Section key:** `process`  
**Count:** **8 steps** (locked)

| Element          | TS key                  | Suggested length |
| ---------------- | ----------------------- | ---------------- |
| Step title       | `process[].title`       | 3–5 words        |
| Step description | `process[].description` | 20–30 words      |

---

## Section 6 — Technologies & tools

**UI H2 (fixed):** [Keyword] Technologies I Use
**UI supporting (dynamic):** "30-40 words approx"
**Section key:** `technologies`  
**Count:** 4–5 groups

| Element       | TS key                    | Suggested length |
| ------------- | ------------------------- | ---------------- |
| Category name | `technologies[].category` | 2–4 words        |
| Tool chips    | `technologies[].items`    | 3–6 per group    |

---

## Section 7 — How the pieces connect (System)

**UI H2 (fixed):** How [Keyword Variant] Come Together
**UI supporting (dynamic):** "30-40 words approx"
**Section key:** `piecesConnect` (uses `whatWeDo.paragraphs` + `industries`)  
**Always shown:** Yes

| Element          | TS key                      | Suggested length          | Notes                  |
| ---------------- | --------------------------- | ------------------------- | ---------------------- |
| Body copy        | `whatWeDo.paragraphs` (1–2) | Reuses first 2 paragraphs | Same text as What I Do |
| Industries label | _(fixed)_                   | "Where this shows up"     |                        |
| Industry chips   | `industries`                | **4 items** × 2–4 words   | e.g. SaaS, E-commerce  |

---

## Section 8 — Use cases

**UI H2 (fixed):** Where [Keyword] Applies
**UI supporting (dynamic):** "30-40 words approx"
**Section key:** `useCases`  
**Count:** **6 items** (locked)

| Element     | TS key                   | Suggested length |
| ----------- | ------------------------ | ---------------- |
| **H3**      | `useCases[].title`       | 3–5 words        |
| Description | `useCases[].description` | 20–30 words      |

---

## Section 9 — Who this service is for

**UI H2 (fixed):** Who My [Keyword] Services Are For  
**UI supporting (dynamic):** "30-40 words approx"
**Section key:** `audiences`  
**Count:** **4 cards**

| Element     | TS key                    | Suggested length |
| ----------- | ------------------------- | ---------------- |
| **H3**      | `audiences[].title`       | 4–8 words        |
| Description | `audiences[].description` | 25–35 words      |

---

## Section 10 — Deliverables

**UI H2 (dynamic):** What's Included in My [Keyword] Services  
**UI supporting (dynamic):** "30-40 words approx"
**Section key:** `deliverables`  
**Count:** 6–8 items

| Element     | TS key                       | Suggested length |
| ----------- | ---------------------------- | ---------------- |
| **H3**      | `deliverables[].title`       | 3–6 words        |
| Description | `deliverables[].description` | 15–20 words      |

---

## Section 11 — Benefits & outcomes

**UI H2 (fixed):** Benefits of [Keyword Variant]
**UI supporting (dynamic):** "30-40 words approx"
**Section key:** `benefits`  
**Count:** **6 items** — 3 `benefit` + 3 `outcome`

| Element     | TS key                   | Suggested length       |
| ----------- | ------------------------ | ---------------------- |
| **H3**      | `benefits[].title`       | 4–7 words              |
| Type        | `benefits[].kind`        | `benefit` or `outcome` |
| Description | `benefits[].description` | 25–35 words            |

**Rule:** No fake metrics or invented stats.

---

## Section 12 — Why hire me

**UI H2 (fix):** Why Hire Me as a [Role Keyword]?
**UI supporting (dynamic):** "30-40 words approx"  
**Section key:** `whyHire`  
**Count:** 4 reason cards + 3 highlights

| Element            | TS key                          | Suggested length        |
| ------------------ | ------------------------------- | ----------------------- | ------------------------- |
| Role title         | `whyHire.roleTitle`             | 2–4 words               | e.g. "Frontend Developer" |
| Intro              | `whyHire.intro`                 | 35–45 words             |
| Reason tag         | `whyHire.reasons[].tag`         | 1 word                  | e.g. Speed, Precision     |
| Reason title       | `whyHire.reasons[].title`       | 4–7 words               |
| Reason description | `whyHire.reasons[].description` | 30–40 words             |
| Highlight strip    | `whyHire.highlights`            | 3 × label + short value |

---

## Section 13 — FAQ

**UI H2 (fix):** [Keyword] Services FAQs
**Section key:** `faqs`  
**Count:** 6–8 Q&A pairs

| Element  | TS key            | Suggested length |
| -------- | ----------------- | ---------------- | --------------------------- |
| Question | `faqs[].question` | 6–12 words       | Long-tail, natural language |
| Answer   | `faqs[].answer`   | 50–80 words      | Direct, helpful             |

**Tip:** Pull questions from `seoBrief.longTailQuestions` first.
