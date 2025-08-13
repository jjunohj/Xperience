import type { MetadataRoute } from "next";
import { allBlogPosts, allCategories } from "../constants/dataset";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://blog.xuuno.me";
  const currentDate = new Date().toISOString();

  const postUrls: MetadataRoute.Sitemap = allBlogPosts.map((post, index) => ({
    url: `${baseUrl}${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: index < 10 ? ("weekly" as const) : ("monthly" as const),
    priority: Math.max(0.9 - index * 0.01, 0.5), // 최신 글일수록 높은 priority
  }));

  const categoryUrls: MetadataRoute.Sitemap = allCategories.map((category) => ({
    url: `${baseUrl}${category.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...categoryUrls,
    ...postUrls,
  ];
}
