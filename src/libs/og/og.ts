import type { OgData } from "~/data/types/notion";
import { getRedis } from "~/libs/redis";

const OG_TTL_SECONDS = 60 * 60 * 24 * 14; // 성공: 14일
const OG_FAIL_TTL_SECONDS = 60 * 60 * 6; // 실패/없음: 6시간 (부정 캐시)
const FETCH_TIMEOUT_MS = 5000;
const MAX_HTML_BYTES = 200_000;
const USER_AGENT = "Mozilla/5.0 (compatible; XperiencesBot/1.0; +https://blog.xuuno.me)";

function cacheKey(url: string): string {
  return `og:${encodeURIComponent(url)}`;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function absolutize(maybeRelative: string, baseUrl: string): string {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return maybeRelative;
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'");
}

// content를 양쪽 속성 순서(property/content, content/property) 모두에서 추출
function extractMeta(html: string, key: string, attr: "property" | "name"): string | undefined {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+${attr}=["']${escaped}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${escaped}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1].trim());
  }
  return undefined;
}

function extractTitleTag(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1] ? decodeEntities(m[1].trim()) : undefined;
}

function extractFavicon(html: string, baseUrl: string): string | undefined {
  const linkTag = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*>/i);
  if (linkTag) {
    const href = linkTag[0].match(/href=["']([^"']+)["']/i)?.[1];
    if (href) return absolutize(href, baseUrl);
  }
  return absolutize("/favicon.ico", baseUrl);
}

/**
 * HTML과 원본 URL로부터 OG 데이터를 추출한다. 순수 함수(픽스처 테스트 대상).
 * 어떤 입력에도 title은 항상 존재한다(폴백: <title> -> hostname).
 */
export function parseOg(html: string, url: string): OgData {
  const title = extractMeta(html, "og:title", "property") ?? extractTitleTag(html) ?? hostname(url);
  const description = extractMeta(html, "og:description", "property") ?? extractMeta(html, "description", "name");
  const imageRaw = extractMeta(html, "og:image", "property");
  const image = imageRaw ? absolutize(imageRaw, url) : undefined;
  const siteName = extractMeta(html, "og:site_name", "property") ?? hostname(url);
  const favicon = extractFavicon(html, url);

  return { url, title, description, image, favicon, siteName };
}

// 실패 시 폴백 OgData (제목=도메인, 이미지 없음 -> 컴팩트 카드로 렌더)
function fallbackOg(url: string): OgData {
  return {
    url,
    title: hostname(url),
    siteName: hostname(url),
    favicon: absolutize("/favicon.ico", url),
  };
}

async function fetchHtml(url: string): Promise<string | null> {
  // http/https만 허용 (file:, data: 등 차단)
  try {
    const protocol = new URL(url).protocol;
    if (protocol !== "http:" && protocol !== "https:") return null;
  } catch {
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml,*/*" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) return null;

    // 본문을 스트리밍으로 읽어 MAX_HTML_BYTES에 도달하면 중단(대용량 페이지 메모리/대역폭 보호)
    const reader = res.body?.getReader();
    if (!reader) return null;

    const chunks: Uint8Array[] = [];
    let received = 0;
    while (received < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
    }
    await reader.cancel().catch(() => {}); // 남은 본문 다운로드 중단

    const merged = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    return new TextDecoder("utf-8").decode(merged.subarray(0, MAX_HTML_BYTES));
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * URL의 OG 데이터를 best-effort로 반환. 항상 OgData를 resolve(실패 시 폴백).
 * Redis 캐시 HIT 시 네트워크 호출 없음. Redis 없거나 실패해도 동작.
 */
export async function getOgData(url: string): Promise<OgData> {
  let redis: ReturnType<typeof getRedis> | null = null;
  try {
    redis = getRedis();
    const cached = await redis.get<OgData>(cacheKey(url));
    if (cached) return cached;
  } catch {
    redis = null; // Redis env 없음/실패 -> 캐시 없이 진행
  }

  const html = await fetchHtml(url);
  const data = html ? parseOg(html, url) : fallbackOg(url);

  if (redis) {
    try {
      await redis.set(cacheKey(url), data, { ex: html ? OG_TTL_SECONDS : OG_FAIL_TTL_SECONDS });
    } catch {
      /* 캐시 저장 실패는 무시 */
    }
  }

  return data;
}
