import type { Category } from "@/src/data/types/notion";
import { getFromDevCache, setToDevCache } from "../cache";

import { devCache } from "./client";
import { convertToCategory } from "./extractors";
import { queryAllCategories } from "./queries";
import { getAllPageMetadata } from "./posts";

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
