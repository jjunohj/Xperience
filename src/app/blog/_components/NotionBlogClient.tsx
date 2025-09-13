"use client";

import { useMemo } from "react";
import NotionPostCard from "./NotionPostCard";
import FilterPanel from "./FilterPanel";
import { motion } from "framer-motion";
import { fadeInUp, staggerOne } from "@/src/data/constants/animations";
import { PageMetadata, Category } from "@/src/data/types/notion";
import { useFilters } from "@/src/hooks/useFilters";

interface NotionBlogClientProps {
  pages: PageMetadata[];
  categories: Category[];
}

export default function NotionBlogClient({ pages, categories }: NotionBlogClientProps) {
  const { filters, updateFilters, clearFilters, hasActiveFilters } = useFilters();

  const tags = useMemo(() => {
    const tagCount: Record<string, number> = {};

    pages.forEach((page) => {
      page.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [pages]);

  // 필터링된 페이지
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const matchesCategory = !filters.selectedCategory || page.category === filters.selectedCategory;
      const matchesTags =
        filters.selectedTags.length === 0 || filters.selectedTags.some((tag) => page.tags.includes(tag));

      if (!matchesCategory || !matchesTags) {
        return false;
      }

      if (!filters.searchTerm) {
        return true;
      }

      const lowercasedSearchTerm = filters.searchTerm.toLowerCase();
      const searchableContent = [page.title, page.description, page.category || "", ...(page.tags || [])]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(lowercasedSearchTerm);
    });
  }, [pages, filters]);

  return (
    <div className="space-y-8">
      {/* 필터 패널 */}
      <FilterPanel
        categories={categories}
        tags={tags}
        filters={filters}
        onFiltersChangeAction={updateFilters}
        showCategoryGrid={true}
        showTag={true}
        defaultExpanded={true}
      />

      <h2 className="mt-4 text-2xl font-extrabold sm:mt-8 sm:text-3xl">Posts</h2>

      {/* 포스트 목록 */}
      <div className="space-y-4">
        {/* 포스트 그리드 */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerOne}
          initial="initial"
          animate="animate"
        >
          {filteredPages.length > 0 ? (
            filteredPages.map((page) => (
              <motion.div key={page.id} variants={fadeInUp}>
                <NotionPostCard post={page} />
              </motion.div>
            ))
          ) : (
            <motion.div className="col-span-full py-16 text-center" variants={fadeInUp}>
              <div className="mx-auto max-w-md">
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>

                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">검색 결과가 없습니다</h3>

                <p className="mb-4 text-gray-500 dark:text-gray-400">
                  {hasActiveFilters ? "다른 검색어나 필터 조건을 시도해보세요." : "게시글이 없습니다."}
                </p>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    모든 필터 제거
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
