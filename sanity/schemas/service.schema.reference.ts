/**
 * Sanity schema reference for the Services module.
 * Copy into your Sanity Studio schema folder when wiring CMS (alongside blog types).
 *
 * Document type: `service`
 * Singleton: `servicesSettings` (optional hub overrides)
 */

export const serviceDocumentSchemaReference = `
import { defineArrayMember, defineField, defineType } from "sanity";

/** Reusable SEO object — align with blog SeoFields */
export const seoFields = defineType({
  name: "seoFields",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", type: "string", title: "Meta title" }),
    defineField({ name: "metaDescription", type: "text", title: "Meta description", rows: 3 }),
    defineField({ name: "focusKeyword", type: "string", title: "Focus keyword" }),
    defineField({ name: "canonicalPath", type: "string", title: "Canonical path" }),
    defineField({ name: "keywords", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "ogTitle", type: "string" }),
    defineField({ name: "ogDescription", type: "text", rows: 2 }),
    defineField({ name: "ogImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "noIndex", type: "boolean", title: "No index" }),
  ],
});

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "shortDescription", type: "text", rows: 2 }),
    defineField({ name: "order", type: "number", initialValue: 100 }),
    defineField({ name: "icon", type: "string" }),
    defineField({ name: "cardCapabilities", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "categoryLabels", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "seoBrief",
      title: "SEO brief (internal)",
      type: "object",
      fields: [
        defineField({ name: "primaryKeyword", type: "string" }),
        defineField({ name: "searchIntent", type: "string" }),
        defineField({ name: "secondaryKeywords", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "longTailQuestions", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "relatedEntities", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "conversionIntent", type: "string" }),
      ],
    }),
    defineField({
      name: "hero",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "description", type: "text", rows: 3 }),
        defineField({ name: "primaryCta", type: "object", fields: [
          defineField({ name: "label", type: "string" }),
          defineField({ name: "href", type: "string" }),
        ]}),
        defineField({ name: "secondaryCta", type: "object", fields: [
          defineField({ name: "label", type: "string" }),
          defineField({ name: "href", type: "string" }),
        ]}),
        defineField({ name: "trustIndicators", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "technologies", type: "array", of: [{ type: "string" }] }),
      ],
    }),
    defineField({ name: "overview", type: "text", rows: 6 }),
    defineField({
      name: "whatWeDo",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }] }),
      ],
    }),
    defineField({
      name: "capabilities",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", type: "string" }),
          defineField({ name: "description", type: "text", rows: 3 }),
          defineField({ name: "relatedService", type: "reference", to: [{ type: "service" }] }),
        ],
      }],
    }),
    defineField({
      name: "problems",
      type: "array",
      of: [{ type: "object", fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 2 }),
      ]}],
    }),
    defineField({
      name: "process",
      type: "array",
      of: [{ type: "object", fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 2 }),
      ]}],
    }),
    defineField({
      name: "technologies",
      type: "array",
      of: [{ type: "object", fields: [
        defineField({ name: "category", type: "string" }),
        defineField({ name: "items", type: "array", of: [{ type: "string" }] }),
      ]}],
    }),
    defineField({ name: "useCases", type: "array", of: [{ type: "object", fields: [
      defineField({ name: "title", type: "string" }),
      defineField({ name: "description", type: "text", rows: 2 }),
    ]}] }),
    defineField({ name: "audiences", type: "array", of: [{ type: "object", fields: [
      defineField({ name: "title", type: "string" }),
      defineField({ name: "description", type: "text", rows: 2 }),
    ]}] }),
    defineField({ name: "deliverables", type: "array", of: [{ type: "object", fields: [
      defineField({ name: "title", type: "string" }),
      defineField({ name: "description", type: "text", rows: 2 }),
    ]}] }),
    defineField({ name: "benefits", type: "array", of: [{ type: "object", fields: [
      defineField({ name: "title", type: "string" }),
      defineField({ name: "description", type: "text", rows: 2 }),
    ]}] }),
    defineField({ name: "caseStudies", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }] }),
    defineField({ name: "faqs", type: "array", of: [{ type: "object", fields: [
      defineField({ name: "question", type: "string" }),
      defineField({ name: "answer", type: "text", rows: 4 }),
    ]}] }),
    defineField({ name: "relatedServices", type: "array", of: [{ type: "reference", to: [{ type: "service" }] }] }),
    defineField({ name: "relatedPosts", type: "array", of: [{ type: "reference", to: [{ type: "post" }] }] }),
    defineField({ name: "sectionOrder", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "seo", type: "seoFields" }),
    defineField({ name: "updatedAt", type: "datetime" }),
  ],
});
`;
