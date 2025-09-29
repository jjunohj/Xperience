import type { MetadataRoute } from "next";
import { getAllPageMetadata } from "../libs/notion";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://blog.xuuno.me";
  const currentDate = new Date().toISOString();

  // 기본 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  try {
    const pages = await getAllPageMetadata();

    const blogPages: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${baseUrl}/blog/${page.slug}`,
      lastModified: page.date || currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...blogPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
