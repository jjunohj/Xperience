import { isFullPage } from "@notionhq/client";
import type { PageObjectResponse, QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

import { NOTION_BOOK_DB_ID, NOTION_CATEGORY_DB_ID, NOTION_POST_DB_ID, notion } from "./client";

// 노션 쿼리 상수 (업로드 상태, 날짜 내림차순)
const POSTS_QUERY_CONFIG: Omit<QueryDatabaseParameters, "database_id"> = {
  filter: { property: "status", status: { equals: "Upload" } },
  sorts: [{ property: "date", direction: "descending" }],
};

const BOOKS_UPLOAD_QUERY_CONFIG: Omit<QueryDatabaseParameters, "database_id"> = {
  filter: { property: "status", status: { equals: "Upload" } },
  sorts: [{ property: "date", direction: "descending" }],
};

const BOOK_SHELF_VISIBLE_STATUSES = ["Upload", "Writing", "Reading"] as const;
const BOOKS_SHELF_QUERY_CONFIG: Omit<QueryDatabaseParameters, "database_id"> = {
  filter: {
    or: BOOK_SHELF_VISIBLE_STATUSES.map((status) => ({
      property: "status",
      status: { equals: status },
    })),
  },
  sorts: [{ property: "date", direction: "descending" }],
};

export async function queryAllPages() {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.databases.query({
      database_id: NOTION_POST_DB_ID,
      start_cursor: cursor,
      ...POSTS_QUERY_CONFIG,
    });
    results.push(...(res.results.filter(isFullPage) as PageObjectResponse[]));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}

export async function queryAllBooks() {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.databases.query({
      database_id: NOTION_BOOK_DB_ID,
      start_cursor: cursor,
      ...BOOKS_UPLOAD_QUERY_CONFIG,
    });
    results.push(...(res.results.filter(isFullPage) as PageObjectResponse[]));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}

export async function queryBookShelfPages() {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.databases.query({
      database_id: NOTION_BOOK_DB_ID,
      start_cursor: cursor,
      ...BOOKS_SHELF_QUERY_CONFIG,
    });
    results.push(...(res.results.filter(isFullPage) as PageObjectResponse[]));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}

export async function queryAllCategories() {
  const results: PageObjectResponse[] = [];

  const res = await notion.databases.query({
    database_id: NOTION_CATEGORY_DB_ID,
  });
  results.push(...(res.results.filter(isFullPage) as PageObjectResponse[]));

  return results;
}
