// 개발 환경에서만 사용하는 간단한 메모리 캐시

// 캐시 데이터 인터페이스
export interface CacheData<T = unknown> {
  data: T;
  timestamp: number;
}

const DEV_CACHE_TTL = 5 * 60 * 1000; // 5분

/**
 * 메모리 캐시로부터 데이터 가져오기
 * @param cacheMap 캐시 맵
 * @param key 캐시 키
 * @returns 캐시된 데이터 또는 null
 */
export const getFromDevCache = <T>(
  cacheMap: Map<string, CacheData>,
  key: string,
): T | null => {
  if (process.env.NODE_ENV === "development") {
    const cached = cacheMap.get(key);
    if (cached && Date.now() - cached.timestamp < DEV_CACHE_TTL) {
      return cached.data as T;
    }
  }
  return null;
};

/**
 * 메모리 캐시에 데이터 저장
 * @param cacheMap 캐시 맵
 * @param key 캐시 키
 * @param data 저장할 데이터
 */
export const setToDevCache = <T>(
  cacheMap: Map<string, CacheData>,
  key: string,
  data: T,
): void => {
  if (process.env.NODE_ENV === "development") {
    cacheMap.set(key, { data, timestamp: Date.now() });
  }
};
