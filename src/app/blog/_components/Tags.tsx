"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, X } from "lucide-react";
import { cn } from "~/libs/core";

interface TagData {
  name: string;
  count: number;
}

interface TagItemProps {
  tag: TagData;
  isSelected: boolean;
  onSelect: (tag: string) => void;
  onRemove: (tag: string) => void;
}

function TagItem({ tag, isSelected, onSelect, onRemove }: TagItemProps) {
  const handleClick = () => {
    if (isSelected) {
      onRemove(tag.name);
    } else {
      onSelect(tag.name);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "m-0.5 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1",
        "cursor-pointer select-none",
        isSelected
          ? "border-gray-600 bg-gray-600 text-white"
          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
      )}
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <Hash size={10} className="flex-shrink-0" />

      <span className="whitespace-nowrap font-medium">{tag.name}</span>

      <span className="ml-0.5 text-xs">{tag.count}</span>
    </motion.button>
  );
}

interface TagsProps {
  tags: TagData[];
  selectedTags: string[];
  onTagSelectAction: (tag: string) => void;
  onTagRemoveAction: (tag: string) => void;
  maxTags?: number;
  sortBy?: "name" | "count" | "random";
  className?: string;
  showEmpty?: boolean;
  emptyMessage?: string;
}

export default function Tags({
  tags,
  selectedTags,
  onTagSelectAction,
  onTagRemoveAction,
  maxTags = 50,
  sortBy = "count",
  className,
  showEmpty = true,
  emptyMessage = "태그가 없습니다",
}: TagsProps) {
  // 태그 정렬 및 제한
  const processedTags = useMemo(() => {
    let sortedTags = [...tags];

    switch (sortBy) {
      case "name":
        sortedTags.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        break;
      case "count":
        sortedTags.sort((a, b) => b.count - a.count);
        break;
      case "random":
        sortedTags.sort(() => Math.random() - 0.5);
        break;
    }

    return sortedTags.slice(0, maxTags);
  }, [tags, sortBy, maxTags]);

  if (processedTags.length === 0) {
    return showEmpty ? (
      <div className={cn("py-8 text-center text-gray-500 dark:text-gray-400", className)}>
        <Hash className="mx-auto mb-2 opacity-50" size={32} />
        <p>{emptyMessage}</p>
      </div>
    ) : null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2 p-1", className)}>
      <AnimatePresence>
        {processedTags.map((tag) => (
          <TagItem
            key={tag.name}
            tag={tag}
            isSelected={selectedTags.includes(tag.name)}
            onSelect={onTagSelectAction}
            onRemove={onTagRemoveAction}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// 선택된 태그 표시 컴포넌트
interface SelectedTagsProps {
  tags: string[];
  onRemoveAction: (tag: string) => void;
  onClearAction: () => void;
  className?: string;
}

export function SelectedTags({ tags, onRemoveAction, onClearAction, className }: SelectedTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">선택된 태그:</span>

      <div className="flex flex-wrap gap-1">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => onRemoveAction(tag)}
              className="inline-flex items-center gap-1 rounded-full bg-gray-600 px-2 py-1 text-xs text-white transition-colors hover:bg-gray-700"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Hash size={10} />
              {tag}
              <X size={10} />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {tags.length > 0 && (
        <button
          onClick={onClearAction}
          className="text-xs text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          모두 지우기
        </button>
      )}
    </div>
  );
}
