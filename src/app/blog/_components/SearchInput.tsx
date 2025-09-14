"use client";

import React from "react";
import { X, Search } from "lucide-react";
import { cn } from "~/libs/core";

interface SearchInputProps {
  value: string;
  onChangeAction: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ value, onChangeAction, placeholder = "검색...", className }: SearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
        className={cn(
          "block w-full rounded-full border px-4 py-2 font-light",
          "border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-800",
          "focus:outline-none focus:ring-1 focus:ring-neutral-200 dark:focus:ring-neutral-500",
          "pr-10",
        )}
      />
      {value ? (
        <button
          onClick={() => onChangeAction("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          <X size={16} />
        </button>
      ) : (
        <Search size={16} className="text-secondary absolute right-3 top-3 h-5 w-5" />
      )}
    </div>
  );
}
