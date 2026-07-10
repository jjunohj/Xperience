import { APIResponseError, isFullPage } from "@notionhq/client";
import { cache } from "react";

import type { BookDetail, BookMetadata, PageReference } from "@/src/data/types/notion";
import { slugToPageId } from "../../utils/notion-slug";
import { calculateReadingTime, calculateWordCount } from "../../utils/post";
import { getFromDevCache, setToDevCache } from "../cache";
import { resolveLinkCards } from "../og/og";

import { devCache, notion } from "./client";
import { extractNotionBookData } from "./extractors";
import { queryAllBooks, queryBookShelfPages } from "./queries";
import { getPageContentAsMarkdown } from "./transformers";

// publishedAt(책 실물 출간일)은 페이지 갱신 시점과 무관하므로 sitemap lastmod에 싣지 않는다
export type SitemapBookMetadata = Pick<BookMetadata, "slug" | "date">;

/**
 * 사이트맵 생성용 경량 책 메타데이터 조회
 * - 정렬은 쿼리 층위(queryAllBooks)의 date 내림차순을 그대로 신뢰한다.
 * - 쿼리 층위와 별개로 Upload 게이트를 한 번 더 검사한다 (M-10 이중 게이트).
 */
export async function getSitemapBookMetadata(): Promise<SitemapBookMetadata[]> {
  try {
    const pages = await queryAllBooks();
    return pages.flatMap((page) => {
      // 한 페이지의 프로퍼티 이상이 목록 전체를 비우지 않도록 페이지 단위로 격리
      try {
        const { slug, date, status } = extractNotionBookData(page);
        return status === "Upload" && slug ? [{ slug, date }] : [];
      } catch (error) {
        console.error(`책 요약 추출 실패 (${page.id}):`, error);
        return [];
      }
    });
  } catch (error) {
    // list 계열이지만 소비자(sitemap)를 깨뜨리지 않도록 빈 목록으로 폴백 (M-14 선택)
    console.error("사이트맵용 책 메타데이터 조회 실패:", error);
    return [];
  }
}

export async function getAllBookMetadata(): Promise<BookMetadata[]> {
  try {
    const cachedData = getFromDevCache<BookMetadata[]>(devCache, "books-metadata");
    if (cachedData) {
      console.log("🎯 [DEV 캐시 HIT] 모든 책 메타데이터");
      return cachedData;
    }

    const pages = await queryAllBooks();

    const books = pages
      .map((page) => extractNotionBookData(page))
      .sort((a, b) => {
        const aDate = a.date || a.publishedAt || "";
        const bDate = b.date || b.publishedAt || "";
        return aDate < bDate ? 1 : -1;
      });

    console.log(`✅ 총 ${books.length} 개의 책 메타데이터 처리 완료`);
    setToDevCache<BookMetadata[]>(devCache, "books-metadata", books);

    return books;
  } catch (error) {
    console.error("책 목록 처리 실패:", error);
    return [];
  }
}

export async function getBookShelfMetadata(): Promise<BookMetadata[]> {
  try {
    const cachedData = getFromDevCache<BookMetadata[]>(devCache, "books-shelf-metadata");
    if (cachedData) {
      console.log("🎯 [DEV 캐시 HIT] 책장 메타데이터");
      return cachedData;
    }

    const pages = await queryBookShelfPages();
    const books = pages
      .map((page) => extractNotionBookData(page))
      .sort((a, b) => {
        const aDate = a.date || a.publishedAt || "";
        const bDate = b.date || b.publishedAt || "";
        return aDate < bDate ? 1 : -1;
      });

    console.log(`✅ 총 ${books.length} 개의 책장 메타데이터 처리 완료`);
    setToDevCache<BookMetadata[]>(devCache, "books-shelf-metadata", books);

    return books;
  } catch (error) {
    console.error("책장 목록 처리 실패:", error);
    return [];
  }
}

/**
 * 읽은 날짜 기준으로 정렬된 책 목록에서 이전/다음 책 참조를 도출
 * - 목록은 newest-first 정렬이므로 idx+1 = 이전(더 오래 전 읽은 책), idx-1 = 다음(더 최근 읽은 책)
 */
async function getAdjacentBooks(slug: string): Promise<{ prevBook?: PageReference; nextBook?: PageReference }> {
  const books = await getAllBookMetadata();
  const published = books.filter((book) => book.status === "Upload");
  const idx = published.findIndex((book) => book.slug === slug);

  if (idx === -1) {
    return {};
  }

  const toReference = (book: BookMetadata): PageReference => ({
    id: book.id,
    title: book.title,
    slug: book.slug,
  });

  return {
    prevBook: idx < published.length - 1 ? toReference(published[idx + 1]) : undefined,
    nextBook: idx > 0 ? toReference(published[idx - 1]) : undefined,
  };
}

export const getBookDetail = cache(async function (slug: string): Promise<BookDetail | null> {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const cachedData = getFromDevCache<BookDetail>(devCache, `book-detail-${decodedSlug}`);
    if (cachedData) {
      console.log("🎯 [DEV 캐시 HIT] 책 상세 데이터 조회: ", decodedSlug);
      return cachedData;
    }

    const pageId = slugToPageId(decodedSlug);
    const page = await notion.pages.retrieve({ page_id: pageId });

    if (!isFullPage(page)) {
      return null;
    }

    const metadata = extractNotionBookData(page);

    if (metadata.status !== "Upload") {
      return null;
    }

    const [content, adjacent] = await Promise.all([getPageContentAsMarkdown(pageId), getAdjacentBooks(decodedSlug)]);
    const linkCards = await resolveLinkCards(content);

    const bookDetail: BookDetail = {
      ...metadata,
      content,
      readingTime: calculateReadingTime(content),
      wordCount: calculateWordCount(content),
      linkCards,
      ...adjacent,
    };

    setToDevCache<BookDetail>(devCache, `book-detail-${decodedSlug}`, bookDetail);
    return bookDetail;
  } catch (error) {
    console.error("책 상세 조회 실패:", error);

    if (error instanceof APIResponseError) {
      if (error.code === "rate_limited" || error.code === "object_not_found") {
        return null;
      }
    }

    return null;
  }
});
