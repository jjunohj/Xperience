"use client";

import useSearch from "@/src/libs/useSearch";
import SearchInput from "./_components/SearchInput";

export default function BlogPage() {
  const { searchValue, searchHandler } = useSearch();

  //   const filteredBlogPosts = postList.filter((post) =>
  //     post.title.toLowerCase().includes(searchValue.toLowerCase()),
  //   );

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold lg:text-5xl">Blog</h1>
        <span className="text-sm font-light text-gray-600 dark:text-gray-400">
          다시 보고 싶은 기술들을 나의 언어로 공유합니다.
        </span>
      </div>
      <SearchInput
        className="relative mt-4 w-full"
        placeholder="카테고리, 태그, 게시글 검색"
        onChange={searchHandler}
      />
    </div>
  );
}
