"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, ChevronUp, Search } from "lucide-react";
import { cn } from "~/libs/core";
import CategoryGrid from "./CategoryGrid";
import RefreshIcon from "~/components/icons/RefreshIcon";
import Tags from "./Tags";
import SearchInput from "./SearchInput";
import { FilterState } from "~/hooks/useFilters";

import { Category } from "~/data/types/notion";

interface FilterPanelProps {
  categories: Category[];
  tags: Array<{ name: string; count: number }>;

  // 현재 필터 상태
  filters: FilterState;
  onFiltersChangeAction: (filters: FilterState) => void;

  // UI 설정
  showCategoryGrid?: boolean;
  showTag?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export default function FilterPanel({
  categories,
  tags,
  filters,
  onFiltersChangeAction,
  showCategoryGrid = true,
  showTag = true,
  defaultExpanded = true,
  className,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const hasActiveFilters = filters.searchTerm || filters.selectedCategory || filters.selectedTags.length > 0;

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChangeAction({ ...filters, searchTerm });
  };

  const handleCategorySelect = (category: string | null) => {
    onFiltersChangeAction({ ...filters, selectedCategory: category });
  };

  const handleTagSelect = (tag: string) => {
    if (!filters.selectedTags.includes(tag)) {
      onFiltersChangeAction({
        ...filters,
        selectedTags: [...filters.selectedTags, tag],
      });
    }
  };

  const handleTagRemove = (tag: string) => {
    onFiltersChangeAction({
      ...filters,
      selectedTags: filters.selectedTags.filter((t) => t !== tag),
    });
  };

  const handleTagsClear = () => {
    onFiltersChangeAction({ ...filters, selectedTags: [] });
  };

  return (
    <div className={cn("space-y-4", className)}>
            className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-2 text-lg font-light text-neutral-900 transition-colors dark:text-neutral-100"
      </div>

      {!isExpanded && hasActiveFilters && (
        <div className="flex flex-wrap gap-2 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
          {filters.searchTerm && (
            <span className="bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200 inline-flex items-center gap-1 rounded px-2 py-1 text-xs">
              <Search size={10} />
              {filters.searchTerm}
            </span>
          )}

          {filters.selectedCategory && (
            <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
              <Filter size={10} />
              {filters.selectedCategory}
            </span>
          )}

          {filters.selectedTags.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              #{filters.selectedTags.length}개 태그
            </span>
          )}
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            {/* 카테고리 필터 */}
            {showCategoryGrid && (
              <div className="space-y-3">
                <h3 className="mt-4 text-xl font-extrabold text-neutral-900 dark:text-neutral-100 sm:mt-8 sm:text-2xl">
                  Categories
                </h3>

                <CategoryGrid
                  categories={categories}
                  selectedCategory={filters.selectedCategory}
                  onCategorySelectAction={handleCategorySelect}
                />
              </div>
            )}

            {/* 태그 필터 */}
            {showTag && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="mt-4 text-xl font-extrabold text-neutral-900 dark:text-neutral-100 sm:mt-8 sm:text-2xl">
                    Tags
                    <button
                      onClick={handleTagsClear}
                      className="ml-2 p-1 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                      title="태그 선택 초기화"
                    >
                      <RefreshIcon width={14} height={14} />
                    </button>
                  </h3>
                </div>

                {/* 태그 */}
                <Tags
                  tags={tags}
                  selectedTags={filters.selectedTags}
                  onTagSelectAction={handleTagSelect}
                  onTagRemoveAction={handleTagRemove}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
