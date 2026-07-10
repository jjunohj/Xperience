import type { MetadataRoute } from "next";
import { SITE_URL } from "../data/constants/site";
import { getPublishedPageSummaries, getSitemapBookMetadata } from "../libs/notion";

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

// lastModified는 실제 콘텐츠 날짜가 있을 때만 싣는다 (undefined면 <lastmod> 미출력).
// 재생성마다 new Date()를 넣으면 lastmod 신호 전체가 노이즈로 학습된다.
function buildStaticPages(latestPostDate?: string, latestBookDate?: string): MetadataRoute.Sitemap {
  // 홈은 최신 글·책 카드를 모두 노출하므로 둘 중 더 최근 날짜를 쓴다
  const latestHomeDate = [latestPostDate, latestBookDate].filter(Boolean).sort().at(-1);

  return [
    {
      url: SITE_URL,
      lastModified: latestHomeDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "daily" as const,
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/book`,
      lastModified: latestBookDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      // about은 갱신 주기를 추적하지 않으므로 lastModified 생략
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [pages, books] = await withTimeout(
      Promise.all([getPublishedPageSummaries(), getSitemapBookMetadata()]),
      SITEMAP_FETCH_TIMEOUT_MS,
    );

    const blogPages: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${SITE_URL}/blog/${page.slug}`,
      lastModified: page.date || undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
      url: `${SITE_URL}/book/${book.slug}`,
      lastModified: book.date || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

    // 쿼리 층위가 date 내림차순으로 정렬하므로 첫 유효 날짜가 최신이다
    const staticPages = buildStaticPages(pages.find((page) => page.date)?.date, books.find((book) => book.date)?.date);

    return [...staticPages, ...blogPages, ...bookPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // 실패 시에도 거짓 lastmod를 싣지 않는다 (날짜 미상 = 생략)
    return buildStaticPages();
  }
}
