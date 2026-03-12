// Notion 관련 타입 정의

import { PageObjectResponse } from "@notionhq/client";

// 노션 페이지 속성 타입
export type NotionPageProperties = PageObjectResponse["properties"];
export type PropertyValue<T extends string> = Extract<NotionPageProperties[string], { type: T }>;

export type AllowedPropertyTypes =
  | "title"
  | "rich_text"
  | "select"
  | "multi_select"
  | "status"
  | "date"
  | "number"
  | "files"
  | "relation"
  | "rollup";

export type PropertyValueMap = {
  title: PropertyValue<"title">["title"];
  rich_text: PropertyValue<"rich_text">["rich_text"];
  select: PropertyValue<"select">["select"];
  multi_select: PropertyValue<"multi_select">["multi_select"];
  status: PropertyValue<"status">["status"];
  date: PropertyValue<"date">["date"];
  number: PropertyValue<"number">["number"];
  files: PropertyValue<"files">["files"];
  relation: PropertyValue<"relation">["relation"];
  rollup: PropertyValue<"rollup">["rollup"];
};

export interface Category {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  pageIds: string[];
}

// 노션 페이지의 기본 메타데이터
interface PageBasicInfo {
  id: string;
  title: string;
  slug: string; // 32자 연속된 문자열
  description: string;
  summary?: string;
  category?: string;
  tags: string[];
  date: string;
  status: string;
  thumbnail?: string;
}

// 이전/다음 페이지 ID 포함 메타데이터
export interface PageRawMetadata extends PageBasicInfo {
  prevPageId: string;
  nextPageId: string;
}

// 관계 페이지 참조 정보
export interface PageReference {
  id: string;
  title: string;
  slug: string;
}

// 관계 페이지 참조 정보가 포함된 페이지 메타데이터 (칼럼 명 따라 post로 명명)
export interface PageMetadata extends PageBasicInfo {
  prevPost?: PageReference;
  nextPost?: PageReference;
}

// 모든 정보가 포함된 완전한 포스트 데이터 (콘텐츠 포함)
export interface PostDetail extends PageMetadata {
  content: string;
  readingTime: number;
  wordCount: number;
}

// 책 페이지 기본 메타데이터
interface BookBasicInfo {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  category?: string;
  date: string; // 리뷰 작성일
  publishedAt?: string; // 도서 출판일
  status: string;
  cover?: string;
  rating?: number;
}

// 책 목록에 사용하는 메타데이터
export interface BookMetadata extends BookBasicInfo {}

// 책 상세 페이지 데이터
export interface BookDetail extends BookMetadata {
  content: string;
  readingTime: number;
  wordCount: number;
}

// 관계 포스트 처리 결과
export interface RelatedPostsResult {
  prevPost?: PageReference;
  nextPost?: PageReference;
}
