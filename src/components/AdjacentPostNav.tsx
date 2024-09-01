import React from "react";
import { useMemo } from "react";
import { Post } from "contentlayer/generated";
import { allBlogPosts } from "../constants/dataset";
import AdjacentPost from "./AdjacentPost";

const AdjacentPostNav = ({ post }: { post: Post }) => {
  const { prevPost, nextPost } = useMemo(() => {
    const getPostNumber = (fileName) => parseInt(fileName.split("-")[0], 10);

    const sameCategoryPosts = allBlogPosts
      .filter((p) => p.category === post.category)
      .sort(
        (a, b) =>
          getPostNumber(a._raw.sourceFileName) -
          getPostNumber(b._raw.sourceFileName),
      );

    const currentIndex = sameCategoryPosts.findIndex((p) => p._id === post._id);

    return {
      prevPost: currentIndex > 0 ? sameCategoryPosts[currentIndex - 1] : null,
      nextPost:
        currentIndex < sameCategoryPosts.length - 1
          ? sameCategoryPosts[currentIndex + 1]
          : null,
    };
  }, [post]);

  return (
    <nav
      aria-label="Adjacent Posts Navigation"
      className="flex w-full max-w-xl flex-col items-stretch justify-between gap-4 sm:max-w-2xl sm:flex-row sm:items-center sm:gap-8 lg:max-w-3xl"
    >
      {prevPost && <AdjacentPost post={prevPost} direction="previous" />}
      {nextPost && <AdjacentPost post={nextPost} direction="next" />}
    </nav>
  );
};

export default React.memo(AdjacentPostNav);
