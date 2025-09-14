"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { PageMetadata } from "@/src/data/types/notion";

interface NotionPostCardProps {
  post: PageMetadata;
}

export default function NotionPostCard({ post }: NotionPostCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-neutral-800"
    >
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        {/* 썸네일 */}
        <div className="relative h-48 w-full flex-shrink-0 bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={post.thumbnail || "/og-image.png"}
            alt={post.title || "블로그 포스트"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
          />
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-1 flex-col p-6">
          {/* 카테고리 */}
          {post.category && (
            <div className="mb-2">
              <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {post.category}
              </span>
            </div>
          )}

          {/* 제목 */}
          <h2 className="mb-2 line-clamp-2 text-xl font-bold text-neutral-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            {post.title || "제목 없음"}
          </h2>

          {/* 설명 */}
          <p className="mb-4 line-clamp-3 flex-1 text-neutral-600 dark:text-neutral-300">
            {post.description || "설명이 없습니다."}
          </p>

          {/* 메타 정보 */}
          <div className="mb-4 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
            <time dateTime={post.date}>{post.date ? dayjs(post.date).format("YYYY년 MM월 DD일") : "날짜 없음"}</time>
          </div>

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && <span className="text-xs text-neutral-400">+{post.tags.length - 3}개</span>}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
