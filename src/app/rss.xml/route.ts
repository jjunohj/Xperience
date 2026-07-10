import { RSS_PATH, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../../data/constants/site";
import { getPublishedPageSummaries, type PageSummary } from "../../libs/notion";
import { withTimeout } from "../../utils/with-timeout";

// 캐시: Next ISR 레이어만 사용한다. on-demand /api/revalidate의 기본 갱신 목록에도 포함됨.
export const revalidate = 3600;

const MAX_FEED_ITEMS = 20;
const RSS_FETCH_TIMEOUT_MS = 8000;

// XML 1.0에서 불법인 제어 문자는 이스케이프로도 살릴 수 없으므로 제거한다
// (하나만 섞여도 엄격한 피드 파서가 피드 전체를 거부한다)
function escapeXml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// "YYYY-MM-DD" → RFC 822 형식 (RSS pubDate 규격). 파싱 불가 날짜는 생략한다.
// 날짜만 있는 값은 UTC 자정으로 해석되면 하루가 밀려 보이므로 KST 자정으로 고정한다.
function toPubDate(date: string): string | undefined {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00+09:00` : date;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toUTCString();
}

export async function GET() {
  // 조회 에러는 getPublishedPageSummaries가 빈 배열로 폴백하고,
  // 응답 지연(hang)은 타임아웃으로 끊어 — 어느 쪽이든 5xx 대신 글 없는 채널로 디그레이드
  let posts: PageSummary[] = [];
  try {
    posts = (await withTimeout(getPublishedPageSummaries(), RSS_FETCH_TIMEOUT_MS)).slice(0, MAX_FEED_ITEMS);
  } catch (error) {
    console.error("RSS 피드용 글 조회 타임아웃:", error);
  }

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = toPubDate(post.date);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>${
        post.description
          ? `
      <description>${escapeXml(post.description)}</description>`
          : ""
      }${
        pubDate
          ? `
      <pubDate>${pubDate}</pubDate>`
          : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <atom:link href="${SITE_URL}${RSS_PATH}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
