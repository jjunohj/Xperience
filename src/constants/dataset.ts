import { Post, allPosts } from "contentlayer/generated";

import { reducePost } from "~/libs/post";
import { Category } from "~/libs/types";

export const allCategoriesName = allPosts
  .filter((post) => post._raw.sourceFilePath.includes("/index.mdx"))
  .map((post) => post.slug.split("/")[2]);

export const allBlogPosts: Post[] = allPosts
  .filter(
    (post) =>
      post._raw.sourceFilePath.includes("blog") &&
      !post._raw.sourceFilePath.includes("/index.mdx"),
  )
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const reducedAllBlogPosts = allBlogPosts.map(reducePost);

export const allCategories: Category[] = allPosts
  .filter((post) => post._raw.sourceFilePath.includes("/index.mdx"))
  .map((categories) => ({
    ...categories,
    category: categories.slug.split("/")[2],
    posts: allBlogPosts
      .filter((post) => categories.slug.includes(post.category))
      .map(reducePost)
      .reverse(),
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const allTags = Array.from(
  [...allBlogPosts].reduce((ac, v) => {
    v.tags.forEach((tag) => ac.add(tag));
    return ac;
  }, new Set<string>([])),
).filter(Boolean);
