import { APIResponseError, isFullPage } from "@notionhq/client";
import { cache } from "react";

import type { OgData, PageMetadata, PageReference, PostDetail, RelatedPostsResult } from "@/src/data/types/notion";
import { NOTION_BOOKMARK_MARKER } from "@/src/data/constants/notion";
import { pageIdToSlug, slugToPageId } from "../../utils/notion-slug";
import { calculateReadingTime, calculateWordCount } from "../../utils/post";
import { getFromDevCache, setToDevCache } from "../cache";
import { getOgData } from "../og/og";

import { devCache, notion } from "./client";
import { extractNotionRawData } from "./extractors";
import { getPlainText, getProperty, getStatus } from "./properties";
import { queryAllPages } from "./queries";
import { getPageContentAsMarkdown } from "./transformers";

export type SitemapPageMetadata = Pick<PageMetadata, "slug" | "date">;

// 변환된 마크다운에서 북마크 마커 URL을 수집해 OG를 병렬 조회한다.
const BOOKMARK_LINK_PATTERN = new RegExp(`\\[${NOTION_BOOKMARK_MARKER}\\]\\(([^)]+)\\)`, "g");

async function resolveLinkCards(markdown: string): Promise<Record<string, OgData>> {
  const urls = new Set<string>();
  for (const match of markdown.matchAll(BOOKMARK_LINK_PATTERN)) {
    if (match[1]) urls.add(match[1]);
  }
  if (urls.size === 0) return {};

  const entries = await Promise.all(Array.from(urls).map(async (url) => [url, await getOgData(url)] as const));
  return Object.fromEntries(entries);
}

/**
 * 관계 페이지 ID를 받아 참조 정보를 반환하는 함수
 * @param prevPageId 이전 포스트 페이지 ID
 * @param nextPageId 다음 포스트 페이지 ID
 * @returns { prevPost, nextPost } 이전, 다음 포스트 참조 정보 반환
 */
async function getRelatedPosts(prevPageId: string, nextPageId: string): Promise<RelatedPostsResult> {
  async function getRelatedPost(pageId: string): Promise<PageReference | undefined> {
    if (!pageId) {
      return undefined;
    }

    try {
      const page = await notion.pages.retrieve({
        page_id: pageId,
      });
      if (isFullPage(page)) {
        const status = getStatus(getProperty(page.properties, "status", "status"));
        if (status === "Upload") {
          const title = getPlainText(getProperty(page.properties, "title", "title"));
          return {
            id: pageId,
            title: title,
            slug: pageIdToSlug(pageId),
          };
        }
      }
    } catch (error) {
      console.error(`Error fetching post ${pageId}:`, error);
    }

    return undefined;
  }

  const [prevPost, nextPost] = await Promise.all([getRelatedPost(prevPageId), getRelatedPost(nextPageId)]);

  return { prevPost, nextPost };
}

/**
 * 사이트맵 생성용 경량 페이지 메타데이터 조회
 * - 상세/연관 포스트 조회를 생략해 타임아웃 위험을 줄인다.
 */
export async function getSitemapPageMetadata(): Promise<SitemapPageMetadata[]> {
  try {
    const pages = await queryAllPages();
    return pages.map((page) => {
      const { slug, date } = extractNotionRawData(page);
      return { slug, date };
    });
  } catch (error) {
    console.error("사이트맵용 페이지 메타데이터 조회 실패:", error);
    return [];
  }
}

/**
 * DB의 모든 페이지 메타데이터 조회 (마크다운 변환 X, 관계 페이지 포함)
 * @returns PageMetaData[]
 */
export async function getAllPageMetadata(): Promise<PageMetadata[]> {
  try {
    const cachedData = getFromDevCache<PageMetadata[]>(devCache, "pages-metadata");
    if (cachedData) {
      console.log("🎯 [DEV 캐시 HIT] 모든 페이지 메타데이터");
      return cachedData;
    }

    const pages = await queryAllPages();

    const metadata = await Promise.all(
      pages.map(async (page) => {
        const pageData = page;
        const basicMetadata = extractNotionRawData(pageData);

        const { prevPost, nextPost } = await getRelatedPosts(basicMetadata.prevPageId, basicMetadata.nextPageId);

        return {
          id: basicMetadata.id,
          title: basicMetadata.title,
          slug: basicMetadata.slug,
          description: basicMetadata.description,
          summary: basicMetadata.summary,
          thumbnail: basicMetadata.thumbnail,
          date: basicMetadata.date,
          category: basicMetadata.category,
          tags: basicMetadata.tags,
          status: basicMetadata.status,
          prevPost,
          nextPost,
        };
      }),
    );

    console.log("💬 [Notion DB] 조회된 노션 페이지 개수:", metadata.length);

    const validPreviews = metadata.filter((meta) => meta !== null) as PageMetadata[];
    console.log(`✅ 총 ${validPreviews.length} 개의 페이지 메타데이터 처리 완료`);

    setToDevCache<PageMetadata[]>(devCache, "pages-metadata", validPreviews);

    return validPreviews;
  } catch (error) {
    console.error("포스트 미리보기 처리 실패:", error);
    throw new Error("Notion에서 포스트 미리보기를 조회하는 데 실패했습니다.");
  }
}

/**
 * 해당하는 slug의 포스트 상세 데이터 반환
 * @param slug 포스트 슬러그 (32자 연속된 문자열)
 * @returns PostDetail
 */
export const getPostDetail = cache(async function (slug: string): Promise<PostDetail | null> {
  try {
    const decodedSlug = decodeURIComponent(slug);

    // 개발 서버 캐시 확인
    const cachedData = getFromDevCache<PostDetail>(devCache, `post-detail-${decodedSlug}`);
    if (cachedData) {
      console.log("🎯 [DEV 캐시 HIT] 포스트 상세 데이터 조회: ", decodedSlug);
      return cachedData;
    }

    const pageId = slugToPageId(decodedSlug);

    console.log("💬 [Notion DB] 단일 페이지 조회: ", pageId);
    const page = await notion.pages.retrieve({ page_id: pageId });

    if (!isFullPage(page)) {
      console.log("❌ 페이지 속성을 찾을 수 없음: ", pageId);
      return null;
    }

    const pageData = page;

    const status = getStatus(getProperty(pageData.properties, "status", "status"));
    if (status !== "Upload") {
      console.log(`❌ 업로드되지 않은 포스트: ${decodedSlug}, 현재 상태: ${status}`);
      return null;
    }

    // 각 속성값 추출
    const basicMetadata = extractNotionRawData(pageData);

    const { prevPost, nextPost } = await getRelatedPosts(basicMetadata.prevPageId, basicMetadata.nextPageId);

    const content = await getPageContentAsMarkdown(pageId);
    const linkCards = await resolveLinkCards(content);

    const fullPost: PostDetail = {
      id: basicMetadata.id,
      title: basicMetadata.title,
      slug: basicMetadata.slug,
      description: basicMetadata.description,
      summary: basicMetadata.summary,
      thumbnail: basicMetadata.thumbnail,
      date: basicMetadata.date,
      category: basicMetadata.category,
      tags: basicMetadata.tags,
      status: basicMetadata.status,
      content,
      readingTime: calculateReadingTime(content),
      wordCount: calculateWordCount(content),
      linkCards,
      prevPost,
      nextPost,
    };

    console.log("✅ 마크다운 변환 완료:", fullPost.title);

    // 개발 서버 캐시 저장
    setToDevCache<PostDetail>(devCache, `post-detail-${decodedSlug}`, fullPost);

    return fullPost;
  } catch (error) {
    console.error("단일 페이지 조회 및 변환 실패:", error);

    if (error instanceof APIResponseError) {
      if (error.code === "rate_limited") {
        console.log("❌ API 호출 제한됨 (Rate Limited): ", slug);
        return null;
      }

      if (error.code === "object_not_found") {
        console.log("❌ 페이지를 찾을 수 없음: ", slug);
        return null;
      }
    }

    return null;
  }
});
