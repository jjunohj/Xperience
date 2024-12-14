import type { MetadataRoute } from "next";
import { allBlogPosts } from "../constants/dataset";

export default function Sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://blog.xuuno.me";

  const urls: MetadataRoute.Sitemap = allBlogPosts.map((post) => ({
    url: `${baseUrl}${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "daily",
    priority: 1,
  }));

  return [
    {
      url: "https://blog.xuuno.me",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://blog.xuuno.me/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...urls,
  ];
}
