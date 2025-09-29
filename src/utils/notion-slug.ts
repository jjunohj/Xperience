/**
 * Notion 페이지 ID를 슬러그로 변환
 * @param pageId Notion 페이지 ID (UUID 형식)
 * @returns 32자 연속된 슬러그 문자열
 */
export function pageIdToSlug(pageId: string): string {
  return pageId.replace(/-/g, "");
}

/**
 * 슬러그를 Notion 페이지 ID로 변환
 * @param slug 32자 연속된 슬러그 문자열
 * @returns Notion 페이지 ID (UUID 형식)
 */
export function slugToPageId(slug: string): string {
  if (slug.length !== 32) {
    throw new Error(`올바르지 않은 슬러그 길이입니다. 기대값: 32, 현재값: ${slug.length}`);
  }
  return `${slug.slice(0, 8)}-${slug.slice(8, 12)}-${slug.slice(12, 16)}-${slug.slice(16, 20)}-${slug.slice(20, 32)}`;
}
