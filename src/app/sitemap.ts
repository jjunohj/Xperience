import type { MetadataRoute } from "next";
import { getAllBookMetadata, getAllPageMetadata } from "../libs/notion";

export const revalidate = 3600;

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
      url: `${baseUrl}/book`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  try {
    const [pages, books] = await Promise.all([getAllPageMetadata(), getAllBookMetadata()]);

    const blogPages: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${baseUrl}/blog/${page.slug}`,
      lastModified: page.date || currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
      url: `${baseUrl}/book/${book.slug}`,
      lastModified: book.date || book.publishedAt || currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

    return [...staticPages, ...blogPages, ...bookPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
