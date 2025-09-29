"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "~/libs/core";
import { fadeInSlideToLeft } from "@/src/data/constants/animations";
import { Category } from "~/data/types/notion";

interface CategoryCardProps {
  category: Category;
  count: number;
  isSelected?: boolean;
  onClickAction?: (categoryName: string) => void;
}

export default function CategoryCard({ category, count, isSelected = false, onClickAction }: CategoryCardProps) {
  const handleClick = () => {
    onClickAction?.(category.name);
  };

  return (
    <motion.div
      variants={fadeInSlideToLeft}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0"
    >
      <button
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden rounded-2xl transition-all duration-500",
          "shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
          "focus:ring-brand-700/30 border border-neutral-200/20 dark:border-neutral-700/30",
          "h-28 w-40 sm:h-32 sm:w-48 md:h-36 md:w-56",
          "group cursor-pointer select-none backdrop-blur-sm",
          isSelected ? "ring-brand-700/40 shadow-lg ring-2 ring-offset-2" : "shadow-md",
        )}
      >
        {/* 배경 이미지와 오버레이 */}
        <div className="absolute inset-0">
          <Image
            src={category.thumbnail || "/og-image.png"}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 128px, 208px"
          />
          {/* 미니멀한 오버레이 */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] dark:bg-neutral-900/80" />
          <div className="to-brand-700/10 absolute inset-0 bg-gradient-to-br from-transparent via-transparent" />
        </div>

        {/* 콘텐츠 */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4">
          {/* 카테고리 이름 */}
          <h3 className="mb-2 text-center text-sm font-medium tracking-tight text-neutral-800 dark:text-neutral-100 sm:text-base">
            {category.name}
          </h3>

          {/* 게시물 개수 */}
          <span className="text-xs font-normal tracking-wide text-neutral-500 dark:text-neutral-400 sm:text-sm">
            {count} {count === 1 ? "Post" : "Posts"}
          </span>
        </div>

        {/* 호버 이펙트 */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="from-brand-700/5 to-brand-700/10 absolute inset-0 bg-gradient-to-br" />
        </div>
      </button>
    </motion.div>
  );
}
