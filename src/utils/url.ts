/**
 * URL에서 표시용 호스트명을 추출한다 (`www.` 제거).
 * 파싱 불가한 입력은 원본 문자열을 그대로 반환한다.
 */
export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
