import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

import { CacheData } from "../cache";

if (!process.env.NOTION_API_KEY) throw new Error("NOTION_API_KEY 환경변수 없음");
if (!process.env.NOTION_CATEGORY_DB_ID) throw new Error("NOTION_CATEGORY_DB_ID 환경변수 없음");
if (!process.env.NOTION_POST_DB_ID) throw new Error("NOTION_POST_DB_ID 환경변수 없음");

export const NOTION_POST_DB_ID = process.env.NOTION_POST_DB_ID;
export const NOTION_CATEGORY_DB_ID = process.env.NOTION_CATEGORY_DB_ID;
export const NOTION_BOOK_DB_ID = process.env.NOTION_BOOK_DB_ID || "31cc324b92cc8091a003ca8be309f3f1";

// Notion client 초기화
export const notion = new Client({ auth: process.env.NOTION_API_KEY });
export const n2m = new NotionToMarkdown({ notionClient: notion });

// 개발 환경용 메모리 캐시
export const devCache = new Map<string, CacheData>();
