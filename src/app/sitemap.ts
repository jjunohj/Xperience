import type { MetadataRoute } from "next";
import { getSitemapBookMetadata, getSitemapPageMetadata } from "../libs/notion";

export const revalidate = 3600;
const SITEMAP_FETCH_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Sitemap generation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}

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
    const [pages, books] = await withTimeout(
      Promise.all([getSitemapPageMetadata(), getSitemapBookMetadata()]),
      SITEMAP_FETCH_TIMEOUT_MS,
    );

    const blogPages: MetadataRoute.Sitemap = pages
      .filter((page) => Boolean(page.slug))
      .map((page) => ({
        url: `${baseUrl}/blog/${page.slug}`,
        lastModified: page.date || currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    const bookPages: MetadataRoute.Sitemap = books
      .filter((book) => Boolean(book.slug))
      .map((book) => ({
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
