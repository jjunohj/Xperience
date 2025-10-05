import { APIResponseError, Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { cache } from "react";
import type {
  PageObjectResponse,
  ImageBlockObjectResponse,
  CodeBlockObjectResponse,
  VideoBlockObjectResponse,
  FileBlockObjectResponse,
  EmbedBlockObjectResponse,
  BlockObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import type {
  RelatedPostsResult,
  AllowedPropertyTypes,
  NotionPageProperties,
  PropertyValue,
  PropertyValueMap,
  PostDetail,
  PageRawMetadata,
  PageReference,
  PageMetadata,
  Category,
} from "@/src/data/types/notion";
import { CacheData, getFromDevCache, setToDevCache } from "./cache";
import { calculateReadingTime, calculateWordCount } from "../utils/post";
import { pageIdToSlug, slugToPageId } from "../utils/notion-slug";

if (!process.env.NOTION_API_KEY) throw new Error("NOTION_API_KEY 환경변수 없음");
if (!process.env.NOTION_CATEGORY_DB_ID) throw new Error("NOTION_CATEGORY_DB_ID 환경변수 없음");
if (!process.env.NOTION_POST_DB_ID) throw new Error("NOTION_POST_DB_ID 환경변수 없음");

// Notion client 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

// 개발 환경용 메모리 캐시
const devCache = new Map<string, CacheData>();

// 노션 쿼리 상수 (업로드 상태, 날짜 내림차순)
const POSTS_QUERY_CONFIG: Omit<QueryDatabaseParameters, "database_id"> = {
  filter: { property: "status", status: { equals: "Upload" } },
  sorts: [{ property: "date", direction: "descending" }],
};

/**
 * Notion API 이미지 URL을 공개 페이지 URL로 변환
 * @param notionUrl Notion API에서 제공하는 원본 이미지 URL
 * @param pageId 페이지 또는 블록 ID
 * @returns 만료되지 않는 공개 페이지 이미지 URL
 */
function getNotionImageUrl(notionUrl: string | undefined, pageId: string): string | undefined {
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

// 이미지 블록 변환
n2m.setCustomTransformer("image", async (block: BlockObjectResponse) => {
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
});

// 코드 블록 변환
n2m.setCustomTransformer("code", async (block: BlockObjectResponse) => {
  const codeBlock = block as CodeBlockObjectResponse;
  const code = codeBlock.code.rich_text?.[0]?.plain_text || "";
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
});

// 비디오 블록 변환
n2m.setCustomTransformer("video", async (block: BlockObjectResponse) => {
  const videoBlock = block as VideoBlockObjectResponse;
  const originalUrl = videoBlock.video.type === "file" ? videoBlock.video.file.url : videoBlock.video.external.url;
  const caption = videoBlock.video.caption?.[0]?.plain_text || "";

  if (!originalUrl) return "";

  // Notion 호스팅 비디오 URL을 공개 페이지 URL로 변환
  const url = getNotionImageUrl(originalUrl, block.id) || originalUrl;

  // video: 플래그 넣어서, 이미지 마크다운 문법 활용해서 전달
  return `![video:${caption}](${url})\n`;
});

// 파일 블록 변환
n2m.setCustomTransformer("file", async (block: BlockObjectResponse) => {
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
});

// 임베드 블록 변환
n2m.setCustomTransformer("embed", async (block: BlockObjectResponse) => {
  const embedBlock = block as EmbedBlockObjectResponse;
  const url = embedBlock.embed.url || "";
  const caption = embedBlock.embed.caption?.[0]?.plain_text || "";

  if (!url) return "";

  if (caption) {
    return `[🔗 ${caption}](${url})\n*${caption}*\n`;
  }
  return `[🔗 Embed](${url})\n`;
});

async function queryAllPages() {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_POST_DB_ID,
      start_cursor: cursor,
      ...POSTS_QUERY_CONFIG,
    });
    results.push(...(res.results.filter(isFullPage) as PageObjectResponse[]));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}

async function queryAllCategories() {
  const results: PageObjectResponse[] = [];

  const res = await notion.databases.query({
    database_id: process.env.NOTION_CATEGORY_DB_ID,
  });
  results.push(...(res.results.filter(isFullPage) as PageObjectResponse[]));

  return results;
}

function getPlainText(richText: PropertyValueMap["title"] | PropertyValueMap["rich_text"] | undefined): string {
  return richText?.map((text) => text.plain_text).join("") || "";
}

function getStatus(status: PropertyValueMap["status"] | undefined): string {
  return status?.name || "";
}

function getMultiSelect(multiSelect: PropertyValueMap["multi_select"] | undefined): string[] {
  return multiSelect?.map((item) => item.name) || [];
}

function getDate(date: PropertyValueMap["date"] | undefined): string {
  return date?.start || "";
}

function getFileUrl(files: PropertyValueMap["files"] | undefined, pageId: string): string | undefined {
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
function getRelations(relation: PropertyValueMap["relation"] | undefined): string[] {
  if (!relation || relation.length === 0) return [];
  return relation.map((item) => item.id);
}

function getRollupCategory(rollup: PropertyValueMap["rollup"] | undefined): string {
  if (!rollup || rollup.type !== "array") return "";
  return rollup.array.map((item) => (item.type === "title" ? item.title[0].plain_text : ""))[0];
}

const getProperty = <T extends AllowedPropertyTypes>(
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

function extractNotionRawData(pageData: PageObjectResponse): PageRawMetadata {
  const { properties } = pageData;

  return {
    id: pageData.id,
    title: getPlainText(getProperty(properties, "title", "title")),
    description: getPlainText(getProperty(properties, "description", "rich_text")),
    summary: getPlainText(getProperty(properties, "summary", "rich_text")),
    category: getRollupCategory(getProperty(properties, "category_name", "rollup")),
    tags: getMultiSelect(getProperty(properties, "tags", "multi_select")),
    date: getDate(getProperty(properties, "date", "date")),
    status: getStatus(getProperty(properties, "status", "status")),
    thumbnail: getFileUrl(getProperty(properties, "thumbnail", "files"), pageData.id),
    slug: pageIdToSlug(pageData.id),
    prevPageId: getRelations(getProperty(properties, "prev_post", "relation"))[0], // 관계 페이지는 1개 제한 걸어놔서 무조건 0번째 인덱스 사용
    nextPageId: getRelations(getProperty(properties, "next_post", "relation"))[0], // 관계 페이지는 1개 제한 걸어놔서 무조건 0번째 인덱스 사용
  };
}

function convertToCategory(pageData: PageObjectResponse): Category {
  const { properties } = pageData;

  return {
    id: pageData.id,
    name: getPlainText(getProperty(properties, "name", "title")),
    description: getPlainText(getProperty(properties, "description", "rich_text")),
    thumbnail: getFileUrl(getProperty(properties, "thumbnail", "files"), pageData.id),
    pageIds: getRelations(getProperty(properties, "pages", "relation")),
  };
}

/**
 * 관계 페이지 ID를 받아 참조 정보를 반환하는 함수
 * @param prevPageId 이전 포스트 페이지 ID
 * @param nextPageId 다음 포스트 페이지 ID
 * @returns { prevPost, nextPost } 이전, 다음 포스트 참조 정보 반환
 */
async function getRelatedPosts(prevPageId: string, nextPageId: string): Promise<RelatedPostsResult> {
  async function getRelatedPost(pageId: string): Promise<PageReference | undefined> {
    if (!pageId) {
      return undefined;
    }

    try {
      const page = await notion.pages.retrieve({
        page_id: pageId,
      });
      if (isFullPage(page)) {
        const status = getStatus(getProperty(page.properties, "status", "status"));
        if (status === "Upload") {
          const title = getPlainText(getProperty(page.properties, "title", "title"));
          return {
            id: pageId,
            title: title,
            slug: pageIdToSlug(pageId),
          };
        }
      }
    } catch (error) {
      console.error(`Error fetching post ${pageId}:`, error);
    }

    return undefined;
  }

  const [prevPost, nextPost] = await Promise.all([getRelatedPost(prevPageId), getRelatedPost(nextPageId)]);

  return { prevPost, nextPost };
}

/**
 * 해당하는 페이지를 마크다운으로 변환하여 반환
 * @param pageId Notion 페이지 ID
 * @returns 마크다운 문자열
 */
async function getPageContentAsMarkdown(pageId: string): Promise<string> {
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

/**
 * DB의 모든 페이지 메타데이터 조회 (마크다운 변환 X, 관계 페이지 포함)
 * @returns PageMetaData[]
 */
export async function getAllPageMetadata(): Promise<PageMetadata[]> {
  try {
    const cachedData = getFromDevCache<PageMetadata[]>(devCache, "pages-metadata");
    if (cachedData) {
      console.log("🎯 [DEV 캐시 HIT] 모든 페이지 메타데이터");
      return cachedData;
    }

    const pages = await queryAllPages();

    const metadata = await Promise.all(
      pages.map(async (page) => {
        const pageData = page;
        const basicMetadata = extractNotionRawData(pageData);

        const { prevPost, nextPost } = await getRelatedPosts(basicMetadata.prevPageId, basicMetadata.nextPageId);

        return {
          id: basicMetadata.id,
          title: basicMetadata.title,
          slug: basicMetadata.slug,
          description: basicMetadata.description,
          summary: basicMetadata.summary,
          thumbnail: basicMetadata.thumbnail,
          date: basicMetadata.date,
          category: basicMetadata.category,
          tags: basicMetadata.tags,
          status: basicMetadata.status,
          prevPost,
          nextPost,
        };
      }),
    );

    console.log("💬 [Notion DB] 조회된 노션 페이지 개수:", metadata.length);

    const validPreviews = metadata.filter((meta) => meta !== null) as PageMetadata[];
    console.log(`✅ 총 ${validPreviews.length} 개의 페이지 메타데이터 처리 완료`);

    setToDevCache<PageMetadata[]>(devCache, "pages-metadata", validPreviews);

    return validPreviews;
  } catch (error) {
    console.error("포스트 미리보기 처리 실패:", error);
    throw new Error("Notion에서 포스트 미리보기를 조회하는 데 실패했습니다.");
  }
}

/**
 * DB의 카테고리 데이터 조회
 * @returns Category[]
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const cachedData = getFromDevCache<Category[]>(devCache, "categories");
    if (cachedData) {
      console.log("🎯 [DEV 캐시 HIT] 카테고리 데이터");
      return cachedData;
    }

    const pages = await queryAllCategories();

    const categories = await Promise.all(
      pages.map(async (page) => {
        return convertToCategory(page);
      }),
    );

    console.log("💬 [Notion DB] 조회된 카테고리 개수:", categories.length);

    const validCategories = categories.filter((category) => category !== null) as Category[];
    console.log(`✅ 총 ${validCategories.length} 개의 카테고리 데이터 처리 완료`);

    setToDevCache<Category[]>(devCache, "categories", validCategories);

    return validCategories;
  } catch (error) {
    console.error("카테고리 데이터 조회 실패:", error);
    throw new Error("Notion에서 카테고리 데이터를 조회하는 데 실패했습니다.");
  }
}

/**
 * Upload된 포스트가 있는 카테고리만 조회
 * @returns Category[]
 */
export async function getCategoriesWithUploadedPosts(): Promise<Category[]> {
  try {
    const cachedData = getFromDevCache<Category[]>(devCache, "categories-with-posts");
    if (cachedData) {
      console.log("🎯 [DEV 캐시 HIT] Upload된 포스트가 있는 카테고리");
      return cachedData;
    }

    const uploadedPosts = await getAllPageMetadata();
    const uploadedCategoryNames = new Set(
      uploadedPosts.map((post) => post.category).filter(Boolean), // 빈 카테고리 제외
    );

    const allCategories = await getCategories();
    const categoriesWithPosts = allCategories.filter((category) => uploadedCategoryNames.has(category.name));

    console.log(`✅ Upload된 포스트가 있는 카테고리: ${categoriesWithPosts.length}개`);

    setToDevCache<Category[]>(devCache, "categories-with-posts", categoriesWithPosts);

    return categoriesWithPosts;
  } catch (error) {
    console.error("Upload된 포스트가 있는 카테고리 조회 실패:", error);
    throw new Error("Notion에서 Upload된 포스트가 있는 카테고리를 조회하는 데 실패했습니다.");
  }
}

/**
 * 해당하는 slug의 포스트 상세 데이터 반환
 * @param slug 포스트 슬러그 (32자 연속된 문자열)
 * @returns PostDetail
 */
export const getPostDetail = cache(async function (slug: string): Promise<PostDetail | null> {
  try {
    const decodedSlug = decodeURIComponent(slug);

    // 개발 서버 캐시 확인
    const cachedData = getFromDevCache<PostDetail>(devCache, `post-detail-${decodedSlug}`);
    if (cachedData) {
      console.log("🎯 [DEV 캐시 HIT] 포스트 상세 데이터 조회: ", decodedSlug);
      return cachedData;
    }

    const pageId = slugToPageId(decodedSlug);

    console.log("💬 [Notion DB] 단일 페이지 조회: ", pageId);
    const page = await notion.pages.retrieve({ page_id: pageId });

    if (!isFullPage(page)) {
      console.log("❌ 페이지 속성을 찾을 수 없음: ", pageId);
      return null;
    }

    const pageData = page;

    const status = getStatus(getProperty(pageData.properties, "status", "status"));
    if (status !== "Upload") {
      console.log(`❌ 업로드되지 않은 포스트: ${decodedSlug}, 현재 상태: ${status}`);
      return null;
    }

    // 각 속성값 추출
    const basicMetadata = extractNotionRawData(pageData);

    const { prevPost, nextPost } = await getRelatedPosts(basicMetadata.prevPageId, basicMetadata.nextPageId);

    const content = await getPageContentAsMarkdown(pageId);

    const fullPost: PostDetail = {
      id: basicMetadata.id,
      title: basicMetadata.title,
      slug: basicMetadata.slug,
      description: basicMetadata.description,
      summary: basicMetadata.summary,
      thumbnail: basicMetadata.thumbnail,
      date: basicMetadata.date,
      category: basicMetadata.category,
      tags: basicMetadata.tags,
      status: basicMetadata.status,
      content,
      readingTime: calculateReadingTime(content),
      wordCount: calculateWordCount(content),
      prevPost,
      nextPost,
    };

    console.log("✅ 마크다운 변환 완료:", fullPost.title);

    // 개발 서버 캐시 저장
    setToDevCache<PostDetail>(devCache, `post-detail-${decodedSlug}`, fullPost);

    return fullPost;
  } catch (error) {
    console.error("단일 페이지 조회 및 변환 실패:", error);

    if (error instanceof APIResponseError) {
      if (error.code === "rate_limited") {
        console.log("❌ API 호출 제한됨 (Rate Limited): ", slug);
        return null;
      }

      if (error.code === "object_not_found") {
        console.log("❌ 페이지를 찾을 수 없음: ", slug);
        return null;
      }
    }

    return null;
  }
});
