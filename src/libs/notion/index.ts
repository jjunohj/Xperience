// 도메인별 모듈에서 export된 공개 API를 그대로 re-export.
// 기존 `src/libs/notion.ts` 호출처와의 호환성을 위해 import 경로는 유지된다.

export {
  getAllBookMetadata,
  getBookDetail,
  getBookShelfMetadata,
  getSitemapBookMetadata,
  type SitemapBookMetadata,
} from "./books";

export { getCategories, getCategoriesWithUploadedPosts } from "./categories";

export { getAllPageMetadata, getPostDetail, getSitemapPageMetadata, type SitemapPageMetadata } from "./posts";
