"use client";

import { useState, useCallback } from "react";
import SearchInput from "./SearchInput";
import Categories from "./Categories";
import PostListItem from "@/src/components/PostListItem";
import { Post } from "contentlayer/generated";
import { Category } from "@/src/libs/types";

interface BlogClientProps {
  allBlogPosts: Post[];
  allCategories: Category[];
}

export default function BlogClient({ allBlogPosts, allCategories }: BlogClientProps) {
  const [searchValue, setSearchValue] = useState("");

  const searchHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  const filteredBlogPosts = allBlogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const filteredCategories = allCategories.filter((category) =>
    category.title.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <>
      <SearchInput
        className="relative mt-4 w-full"
        placeholder="카테고리, 게시글 검색"
        onChange={searchHandler}
      />
      <h3 className="mt-4 text-2xl font-extrabold sm:mt-8 sm:text-3xl">
        Categories
      </h3>
      <Categories categories={filteredCategories} />
      <h2 className="mt-4 text-2xl font-extrabold sm:mt-8 sm:text-3xl">
        Posts
      </h2>
      <div className="mt-2 flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-12">
        {filteredBlogPosts.map((post) => (
          <PostListItem key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}