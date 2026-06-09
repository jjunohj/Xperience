import type {
  BlockObjectResponse,
  BookmarkBlockObjectResponse,
  CalloutBlockObjectResponse,
  CodeBlockObjectResponse,
  EmbedBlockObjectResponse,
  FileBlockObjectResponse,
  ImageBlockObjectResponse,
  RichTextItemResponse,
  VideoBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { CustomTransformer } from "notion-to-md/build/types";

import { NOTION_BOOKMARK_MARKER, NOTION_CALLOUT_MARKER } from "@/src/data/constants/notion";
import { getFromDevCache, setToDevCache } from "../cache";
import { devCache, n2m, notion } from "./client";

/**
 * Notion API 이미지 URL을 공개 페이지 URL로 변환
 * @param notionUrl Notion API에서 제공하는 원본 이미지 URL
 * @param pageId 페이지 또는 블록 ID
 * @returns 만료되지 않는 공개 페이지 이미지 URL
 */
export function getNotionImageUrl(notionUrl: string | undefined, pageId: string): string | undefined {
  if (!notionUrl) return undefined;
  if (!process.env.NEXT_PUBLIC_NOTION_SITE_URL) {
    console.warn("⚠️ NEXT_PUBLIC_NOTION_SITE_URL이 설정되지 않았습니다. 원본 URL을 사용합니다.");
    return notionUrl;
  }

  // 외부 URL (예: Unsplash, GitHub 등)인 경우 그대로 반환
  if (!notionUrl.includes("s3.us-west-2.amazonaws.com") && !notionUrl.includes("prod-files-secure")) {
    return notionUrl;
  }

  // URL에서 쿼리 파라미터 제거
  const encodedUrl = encodeURIComponent(notionUrl.split("?")[0]);

  // 공개 페이지 이미지 URL 형식으로 변환
  return `${process.env.NEXT_PUBLIC_NOTION_SITE_URL}/image/${encodedUrl}?table=block&id=${pageId}&cache=v2`;
}

function richTextToMarkdown(richText: RichTextItemResponse[]): string {
  return richText
    .map((content) => {
      if (content.type === "equation") {
        return `$${content.equation.expression}$`;
      }

      let text = (n2m as any).annotatePlainText(content.plain_text, content.annotations);

      if (content.href) {
        text = `[${text}](${content.href})`;
      }

      return text;
    })
    .join("");
}

function toBlockquoteMarkdown(markdown: string): string {
  return markdown
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");
}

export async function getChildrenAsMarkdown(blockId: string): Promise<string> {
  const results: BlockObjectResponse[] = [];
  let startCursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
    });

    results.push(...(response.results.filter((block) => "type" in block) as BlockObjectResponse[]));
    startCursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (startCursor);

  const mdBlocks = await n2m.blocksToMarkdown(results as any);

  return n2m.toMarkdownString(mdBlocks).parent.trim();
}

// 이미지 블록 변환
n2m.setCustomTransformer("image", (async (block: BlockObjectResponse) => {
  const imageBlock = block as ImageBlockObjectResponse;
  const originalUrl = imageBlock.image.type === "file" ? imageBlock.image.file.url : imageBlock.image.external.url;
  const caption = imageBlock.image.caption?.[0]?.plain_text || "";

  if (!originalUrl) return "";

  // Notion 호스팅 이미지 URL을 공개 페이지 URL로 변환
  const url = getNotionImageUrl(originalUrl, block.id) || originalUrl;

  // 캡션에서 사이즈 prefix 추출 ex) sm:, md:, lg:
  let size = "";
  let cleanCaption = caption;

  if (caption.startsWith("sm:")) {
    size = "sm";
    cleanCaption = caption.substring(3).trim();
  } else if (caption.startsWith("md:")) {
    size = "md";
    cleanCaption = caption.substring(3).trim();
  } else if (caption.startsWith("lg:")) {
    size = "lg";
    cleanCaption = caption.substring(3).trim();
  }

  // alt에 사이즈 정보를 마커와 함께 포함
  const altWithSize = size ? `[size:${size}]${cleanCaption}` : cleanCaption;

  return `![${altWithSize}](${url})\n`;
}) as CustomTransformer);

// 코드 블록 변환
n2m.setCustomTransformer("code", (async (block: BlockObjectResponse) => {
  const codeBlock = block as CodeBlockObjectResponse;
  const code = codeBlock.code.rich_text?.map((text) => text.plain_text).join("") || "";
  const language = codeBlock.code.language || "";
  const caption = codeBlock.code.caption?.[0]?.plain_text || "";

  // 코드블록에 대한 캡션은 주석 형태로 코드블록 위에 삽입
  let result = `\`\`\`${language}\n`;
  if (caption) {
    if (language === "javascript" || language === "typescript") {
      result += `// ${caption}\n`;
    } else if (language === "python" || language === "bash" || language === "shell") {
      result += `# ${caption}\n`;
    } else if (language === "css" || language === "scss" || language === "less") {
      result += `/* ${caption} */\n`;
    } else {
      result += `// ${caption}\n`;
    }
  }
  result += `${code}\n\`\`\``;
  return result;
}) as CustomTransformer);

// 콜아웃 블록 변환
n2m.setCustomTransformer("callout", (async (block: BlockObjectResponse) => {
  const calloutBlock = block as CalloutBlockObjectResponse;
  const icon = calloutBlock.callout.icon?.type === "emoji" ? calloutBlock.callout.icon.emoji : "💡";
  const text = richTextToMarkdown(calloutBlock.callout.rich_text);
  const children = calloutBlock.has_children ? await getChildrenAsMarkdown(block.id) : "";
  const content = [text, children].filter(Boolean).join("\n\n").trim();
  const marker = `> [!${NOTION_CALLOUT_MARKER}:${icon}]`;

  if (!content) {
    return marker;
  }

  return `${marker}\n>\n${toBlockquoteMarkdown(content)}`;
}) as CustomTransformer);

// 비디오 블록 변환
n2m.setCustomTransformer("video", (async (block: BlockObjectResponse) => {
  const videoBlock = block as VideoBlockObjectResponse;
  const originalUrl = videoBlock.video.type === "file" ? videoBlock.video.file.url : videoBlock.video.external.url;
  const caption = videoBlock.video.caption?.[0]?.plain_text || "";

  if (!originalUrl) return "";

  // Notion 호스팅 비디오 URL을 공개 페이지 URL로 변환
  const url = getNotionImageUrl(originalUrl, block.id) || originalUrl;

  // video: 플래그 넣어서, 이미지 마크다운 문법 활용해서 전달
  return `![video:${caption}](${url})\n`;
}) as CustomTransformer);

// 파일 블록 변환
n2m.setCustomTransformer("file", (async (block: BlockObjectResponse) => {
  const fileBlock = block as FileBlockObjectResponse;
  const originalUrl = fileBlock.file.type === "file" ? fileBlock.file.file.url : fileBlock.file.external.url;
  const caption = fileBlock.file.caption?.[0]?.plain_text || "";
  const name = fileBlock.file.type === "file" ? "File" : "File";

  if (!originalUrl) return "";

  // Notion 호스팅 파일 URL을 공개 페이지 URL로 변환
  const url = getNotionImageUrl(originalUrl, block.id) || originalUrl;

  if (caption) {
    return `[📎 ${caption}](${url})\n*${caption}*\n`;
  }
  return `[📎 ${name}](${url})\n`;
}) as CustomTransformer);

// 임베드 블록 변환
n2m.setCustomTransformer("embed", (async (block: BlockObjectResponse) => {
  const embedBlock = block as EmbedBlockObjectResponse;
  const url = embedBlock.embed.url || "";
  const caption = embedBlock.embed.caption?.[0]?.plain_text || "";

  if (!url) return "";

  if (caption) {
    return `[🔗 ${caption}](${url})\n*${caption}*\n`;
  }
  return `[🔗 Embed](${url})\n`;
}) as CustomTransformer);

// 북마크 블록 변환 -> 센티넬 마커. OG 조회/렌더는 posts.ts + LinkCard가 담당.
n2m.setCustomTransformer("bookmark", (async (block: BlockObjectResponse) => {
  const bookmarkBlock = block as BookmarkBlockObjectResponse;
  const url = bookmarkBlock.bookmark.url;

  if (!url) return "";

  // 단독 문단으로 떨어지도록 앞뒤 줄바꿈 보장
  return `[${NOTION_BOOKMARK_MARKER}](${url})\n`;
}) as CustomTransformer);

/**
 * 해당하는 페이지를 마크다운으로 변환하여 반환
 * @param pageId Notion 페이지 ID
 * @returns 마크다운 문자열
 */
export async function getPageContentAsMarkdown(pageId: string): Promise<string> {
  // 개발 서버 캐시 확인
  const cachedContent = getFromDevCache<string>(devCache, `markdown-${pageId}`);
  if (cachedContent) {
    console.log("🎯 [DEV] 페이지 -> 마크다운 캐시 HIT:", pageId);
    return cachedContent;
  }

  console.log("🔄 페이지 -> 마크다운 변환:", pageId);
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const content = n2m.toMarkdownString(mdBlocks).parent;

  // 개발 서버 캐시 저장
  setToDevCache<string>(devCache, `markdown-${pageId}`, content);

  return content;
}
