// 외부 API(Notion 등) 호출이 응답 없이 지연될 때 플랫폼 함수 타임아웃(504)까지
// 끌려가지 않도록 제한 시간을 강제한다. sitemap·RSS 재생성 경로에서 공용.
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}
