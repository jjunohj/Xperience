import { isValidElement, type ReactNode } from "react";
import { NOTION_BOOKMARK_MARKER } from "~/data/constants/notion";

/**
 * 북마크 링크 카드 렌더링용 공용 헬퍼.
 * blog(NotionPostLayout)·book(BookPostLayout)의 react-markdown `a`/`p` 렌더러가 공유한다.
 */

// React children(문자열/숫자/엘리먼트/배열)을 평탄화해 순수 텍스트로 변환
export function flattenToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenToText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return flattenToText(node.props.children);
  return "";
}

// 링크 children 텍스트가 북마크 센티넬인지 검사
export function isBookmarkMarker(children: ReactNode): boolean {
  return flattenToText(children) === NOTION_BOOKMARK_MARKER;
}

// react-markdown이 만든 a 요소(매핑 컴포넌트)의 props.children이 마커인지 검사
export function isBookmarkParagraphChild(child: ReactNode): boolean {
  return isValidElement<{ children?: ReactNode }>(child) && isBookmarkMarker(child.props.children);
}

// 정규화(퍼센트 인코딩)된 href를 원본 키로 되돌려 linkCards를 조회하기 위한 헬퍼
export function decodeHrefSafe(href: string): string {
  try {
    return decodeURIComponent(href);
  } catch {
    return href;
  }
}
