/**
 * 읽기 시간 계산 (평균 200단어/분 기준)
 * @param content 포스트 내용
 * @returns 읽기 시간 (분)
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 단어 수 계산 (러프하게 공백 기준)
 * @param content 포스트 내용
 * @returns 단어 수
 */
export function calculateWordCount(content: string): number {
  return content.split(/\s+/).length;
}
