import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import type { BookMetadata, Category, PageRawMetadata } from "@/src/data/types/notion";
import { pageIdToSlug } from "../../utils/notion-slug";

import {
  getDate,
  getFileUrl,
  getMultiSelect,
  getNumber,
  getPlainText,
  getProperty,
  getRelations,
  getRollupCategory,
  getSelect,
  getStatus,
} from "./properties";

export function extractNotionRawData(pageData: PageObjectResponse): PageRawMetadata {
  const { properties } = pageData;

  return {
    id: pageData.id,
    title: getPlainText(getProperty(properties, "title", "title")),
    description: getPlainText(getProperty(properties, "description", "rich_text")),
    summary: getPlainText(getProperty(properties, "summary", "rich_text")),
    category: getRollupCategory(getProperty(properties, "category_name", "rollup")),
    tags: getMultiSelect(getProperty(properties, "tags", "multi_select")),
    date: getDate(getProperty(properties, "date", "date")),
    status: getStatus(getProperty(properties, "status", "status")),
    thumbnail: getFileUrl(getProperty(properties, "thumbnail", "files"), pageData.id),
    slug: pageIdToSlug(pageData.id),
    prevPageId: getRelations(getProperty(properties, "prev_post", "relation"))[0], // 관계 페이지는 1개 제한 걸어놔서 무조건 0번째 인덱스 사용
    nextPageId: getRelations(getProperty(properties, "next_post", "relation"))[0], // 관계 페이지는 1개 제한 걸어놔서 무조건 0번째 인덱스 사용
  };
}

export function extractNotionBookData(pageData: PageObjectResponse): BookMetadata {
  const { properties } = pageData;
  const reviewDate = getDate(getProperty(properties, "date", "date"));
  const publishedAt = getDate(getProperty(properties, "published_at", "date"));

  return {
    id: pageData.id,
    title: getPlainText(getProperty(properties, "title", "title")),
    slug: pageIdToSlug(pageData.id),
    description: getPlainText(getProperty(properties, "summary", "rich_text")),
    author: getPlainText(getProperty(properties, "author", "rich_text")),
    category: getSelect(getProperty(properties, "category", "select")),
    date: reviewDate,
    publishedAt: publishedAt,
    status: getStatus(getProperty(properties, "status", "status")),
    cover: getFileUrl(getProperty(properties, "cover", "files"), pageData.id),
    rating: getNumber(getProperty(properties, "rating", "number")),
  };
}

export function convertToCategory(pageData: PageObjectResponse): Category {
  const { properties } = pageData;

  return {
    id: pageData.id,
    name: getPlainText(getProperty(properties, "name", "title")),
    description: getPlainText(getProperty(properties, "description", "rich_text")),
    thumbnail: getFileUrl(getProperty(properties, "thumbnail", "files"), pageData.id),
    pageIds: getRelations(getProperty(properties, "pages", "relation")),
  };
}
