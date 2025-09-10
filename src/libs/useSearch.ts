"use client";

import debounce from "lodash.debounce";
import React, { useCallback, useState } from "react";

export default function useSearch(
  callback?: (value: string) => void,
  wait = 300,
) {
  const [searchValue, setSearchValue] = useState("");

  const searchHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const debouncedHandler = debounce((value: string) => {
        callback?.(value);
        setSearchValue(value);
      }, wait);
      
      debouncedHandler(e.target.value);
    },
    [callback, wait],
  );

  return { searchValue, searchHandler };
}
