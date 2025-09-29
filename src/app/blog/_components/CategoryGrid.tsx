"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/libs/core";
import { staggerOne } from "@/src/data/constants/animations";
import { Category } from "~/data/types/notion";
import CategoryCard from "./CategoryCard";

interface CategoryGridProps {
  categories: Category[];
  selectedCategory?: string | null;
  onCategorySelectAction?: (category: string | null) => void;
  showAll?: boolean;
  className?: string;
}

export default function CategoryGrid({
  categories,
  selectedCategory,
  onCategorySelectAction,
  showAll = true,
  className,
}: CategoryGridProps) {
  const totalCount = categories.reduce((sum, category) => sum + (category.pageIds?.length || 0), 0);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      onCategorySelectAction?.(null);
    } else if (categoryName === "All") {
      onCategorySelectAction?.(null);
    } else {
      onCategorySelectAction?.(categoryName);
    }
  };

  const allCategory: Category = {
    id: "all",
    name: "All",
    thumbnail: "/og-image.png",
    pageIds: [],
    description: "All",
  };

  return (
    <motion.div
      className={cn(
        "flex w-full max-w-6xl items-center space-x-4 overflow-x-auto overflow-y-visible no-scrollbar",
        "px-2 py-4 lg:space-x-6",
        className,
      )}
      variants={staggerOne}
    >
      <AnimatePresence>
        {showAll && (
          <CategoryCard
            key="all"
            category={allCategory}
            count={totalCount}
            isSelected={selectedCategory === null}
            onClickAction={handleCategoryClick}
          />
        )}

        {categories.map((category, index) => (
          <CategoryCard
            key={category.id || `category-${index}-${category.name}`}
            category={category}
            count={category.pageIds?.length || 0}
            isSelected={selectedCategory === category.name}
            onClickAction={handleCategoryClick}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
