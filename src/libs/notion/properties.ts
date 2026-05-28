import type { AllowedPropertyTypes, NotionPageProperties, PropertyValueMap } from "@/src/data/types/notion";

import { getNotionImageUrl } from "./transformers";

export function getPlainText(richText: PropertyValueMap["title"] | PropertyValueMap["rich_text"] | undefined): string {
  return richText?.map((text) => text.plain_text).join("") || "";
}

export function getStatus(status: PropertyValueMap["status"] | undefined): string {
  return status?.name || "";
}

export function getSelect(select: PropertyValueMap["select"] | undefined): string {
  return select?.name || "";
}

export function getMultiSelect(multiSelect: PropertyValueMap["multi_select"] | undefined): string[] {
  return multiSelect?.map((item) => item.name) || [];
}

export function getDate(date: PropertyValueMap["date"] | undefined): string {
  return date?.start || "";
}

export function getNumber(number: PropertyValueMap["number"] | undefined): number | undefined {
  if (typeof number !== "number") return undefined;
  return number;
}

export function getFileUrl(files: PropertyValueMap["files"] | undefined, pageId: string): string | undefined {
  if (!files || files.length === 0) return undefined;

  const file = files[0];
  if ("file" in file && file.file?.url) {
    const url = file.file.url;
    // Notion 호스팅 파일은 공개 페이지 URL로 변환하여 만료 문제 해결
    return getNotionImageUrl(url, pageId);
  } else if ("external" in file && file.external?.url) {
    return file.external.url;
  }

  return undefined;
}

// relation은 배열로 떨어지지만, 실제로는 하나의 관계만 설정하므로 첫 번째 ID만 사용, 단일 문자열로 반환
export function getRelations(relation: PropertyValueMap["relation"] | undefined): string[] {
  if (!relation || relation.length === 0) return [];
  return relation.map((item) => item.id);
}

export function getRollupCategory(rollup: PropertyValueMap["rollup"] | undefined): string {
  if (!rollup || rollup.type !== "array") return "";
  return rollup.array.map((item) => (item.type === "title" ? item.title[0].plain_text : ""))[0];
}

export const getProperty = <T extends AllowedPropertyTypes>(
  props: NotionPageProperties,
  key: string,
  type: T,
): PropertyValueMap[T] | undefined => {
  const prop = props[key];
  if (prop?.type === type) {
    return (prop as any)[type] as PropertyValueMap[T];
  }
  return undefined;
};
