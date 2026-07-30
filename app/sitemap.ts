import type { MetadataRoute } from "next";

// Update BASE_URL once you have a real domain
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jay-portfolio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
