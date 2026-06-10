import { NOTION_BOOKMARK_MARKER } from "~/data/constants/notion";
import type { OgData } from "~/data/types/notion";
import { getRedis } from "~/libs/redis";
import { getHostname } from "~/utils/url";

const OG_TTL_SECONDS = 60 * 60 * 24 * 14; // 성공: 14일
const OG_FAIL_TTL_SECONDS = 60 * 60 * 6; // 실패/없음: 6시간 (부정 캐시)
const FETCH_TIMEOUT_MS = 5000;
const MAX_HTML_BYTES = 200_000;
const MAX_REDIRECTS = 5;
const USER_AGENT = "Mozilla/5.0 (compatible; XperiencesBot/1.0; +https://blog.xuuno.me)";
// 사설/루프백/링크로컬/메타데이터(169.254.169.254 등) 호스트 차단 (SSRF 완화)
// IPv4 사설/루프백 + IPv6 루프백(::1)/링크로컬(fe80:)/ULA(fc00::/7) 포함. 콜론 요구로 도메인 오탐 방지.
const BLOCKED_HOST_PATTERN =
  /^(localhost|0\.0\.0\.0|\[?::1\]?|\[?fe80:|\[?f[cd][0-9a-f]{2}:|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.)/i;

// 파서 로직이 바뀌면 이 버전을 올려 기존 캐시를 무효화한다.
const OG_CACHE_VERSION = "v2";

function cacheKey(url: string): string {
  return `og:${OG_CACHE_VERSION}:${encodeURIComponent(url)}`;
}

// http/https + 비차단 호스트만 허용 (리다이렉트 각 홉마다 호출해 체인 SSRF 차단)
function isSafeFetchUrl(url: string): boolean {
  try {
    const { protocol, hostname: host } = new URL(url);
    if (protocol !== "http:" && protocol !== "https:") return false;
    if (BLOCKED_HOST_PATTERN.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}

function absolutize(maybeRelative: string, baseUrl: string): string {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return maybeRelative;
  }
}

function fromCodePointSafe(cp: number): string {
  try {
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : "";
  } catch {
    return "";
  }
}

function decodeEntities(s: string): string {
  return (
    s
      // 숫자 문자 참조 (16진수 &#xHHHH; / 10진수 &#NNNN;) — 한글 등 모든 유니코드 처리
      .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => fromCodePointSafe(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, dec: string) => fromCodePointSafe(parseInt(dec, 10)))
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
  ); // amp는 마지막에 (새 엔티티 생성 방지)
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
  // 아이콘 link 태그가 없으면 undefined — 브라우저가 알아서 /favicon.ico를 요청하므로
  // 강제로 경로를 넣지 않는다(존재하지 않을 때의 404 방지 + LinkCard의 Globe 폴백 활성화).
  return undefined;
}

/**
 * HTML과 원본 URL로부터 OG 데이터를 추출한다. 순수 함수(픽스처 테스트 대상).
 * 어떤 입력에도 title은 항상 존재한다(폴백: <title> -> hostname).
 */
export function parseOg(html: string, url: string): OgData {
  const title = extractMeta(html, "og:title", "property") ?? extractTitleTag(html) ?? getHostname(url);
  const description = extractMeta(html, "og:description", "property") ?? extractMeta(html, "description", "name");
  // og:image는 http(s)만 허용 (data: URI가 Redis에 캐싱/렌더되는 것 방지)
  const imageRaw = extractMeta(html, "og:image", "property");
  const imageAbs = imageRaw ? absolutize(imageRaw, url) : undefined;
  const image = imageAbs && /^https?:\/\//i.test(imageAbs) ? imageAbs : undefined;
  const siteName = extractMeta(html, "og:site_name", "property") ?? getHostname(url);
  const favicon = extractFavicon(html, url);

  return { url, title, description, image, favicon, siteName };
}

// 실패 시 폴백 OgData (제목=도메인, 이미지 없음 -> 컴팩트 카드로 렌더)
function fallbackOg(url: string): OgData {
  return {
    url,
    title: getHostname(url),
    siteName: getHostname(url),
  };
}

async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    let currentUrl = url;

    // 리다이렉트를 수동으로 따라가며 홉마다 호스트를 재검증 (리다이렉트 체인 SSRF 차단).
    // 타임아웃은 체인 전체에 대한 단일 예산(FETCH_TIMEOUT_MS)으로 적용된다.
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      if (!isSafeFetchUrl(currentUrl)) return null;

      const res = await fetch(currentUrl, {
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml,*/*" },
        redirect: "manual",
      });

      // 3xx 리다이렉트: Location을 절대화해 다음 홉에서 재검증
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) return null;
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }

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
        // 마지막 청크가 경계를 넘으면 잘라서 push (received가 MAX_HTML_BYTES를 넘지 않도록)
        const remaining = MAX_HTML_BYTES - received;
        chunks.push(value.length <= remaining ? value : value.subarray(0, remaining));
        received += Math.min(value.length, remaining);
      }
      await reader.cancel().catch(() => {}); // 남은 본문 다운로드 중단

      const merged = new Uint8Array(received);
      let offset = 0;
      for (const chunk of chunks) {
        merged.set(chunk, offset);
        offset += chunk.length;
      }
      return new TextDecoder("utf-8").decode(merged);
    }

    return null; // 리다이렉트 한도 초과
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

// 변환된 마크다운에서 북마크 마커 URL을 수집해 OG를 병렬 조회한다.
// 마커는 항상 한 줄 단독(`[marker](url)\n`)이라 줄 끝 닫는 괄호까지 욕심껏 매칭 -> URL 내 괄호 보존
const BOOKMARK_LINK_PATTERN = new RegExp(`\\[${NOTION_BOOKMARK_MARKER}\\]\\((.+)\\)\\s*$`, "gm");

/**
 * 마크다운 본문의 북마크 마커 URL들을 수집해 url -> OgData 맵을 만든다.
 * blog(getPostDetail)·book(getBookDetail)이 공유한다.
 */
export async function resolveLinkCards(markdown: string): Promise<Record<string, OgData>> {
  const urls = new Set<string>();
  for (const match of markdown.matchAll(BOOKMARK_LINK_PATTERN)) {
    if (match[1]) urls.add(match[1]);
  }
  if (urls.size === 0) return {};

  // getOgData는 보통 throw하지 않지만, 단일 URL 실패가 포스트 전체 렌더를 막지 않도록 방어
  const entries = await Promise.all(
    Array.from(urls).map(async (url) => {
      try {
        return [url, await getOgData(url)] as const;
      } catch {
        return [url, fallbackOg(url)] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}
