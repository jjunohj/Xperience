"use client";

import { useState } from "react";

export interface FilterState {
  searchTerm: string;
  selectedCategory: string | null;
  selectedTags: string[];
}

export function useFilters(initialState?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedCategory: null,
    selectedTags: [],
    ...initialState,
  });

  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCategory: null,
      selectedTags: [],
    });
  };

  const hasActiveFilters =
    filters.searchTerm !== "" || filters.selectedCategory !== null || filters.selectedTags.length > 0;

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
}