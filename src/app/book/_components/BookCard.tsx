"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { BookMetadata } from "@/src/data/types/notion";

interface BookCardProps {
  book: BookMetadata;
}

function renderStars(rating?: number) {
  if (typeof rating !== "number") return null;
  const clampedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400"
      aria-label={`평점 ${clampedRating}점`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < clampedRating ? "opacity-100" : "opacity-20"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
    >
      <Link href={`/book/${book.slug}`} className="flex h-full flex-col">
        <div className="relative h-56 w-full overflow-hidden border-b border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
          <Image
            src={book.cover || "/og-image.png"}
            alt=""
            fill
            className="scale-110 object-cover opacity-35 blur-xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent dark:from-black/35 dark:via-black/20" />

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="relative h-full w-32 overflow-hidden border border-neutral-300 bg-neutral-200 shadow-[0_14px_20px_-12px_rgba(0,0,0,0.6)] dark:border-neutral-600 dark:bg-neutral-700">
              <Image
                src={book.cover || "/og-image.png"}
                alt={book.title || "도서 커버"}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.01]"
                sizes="128px"
              />
              <div className="bg-black/18 absolute left-0 top-0 h-full w-[6px]" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          {book.category && (
            <div>
              <span className="inline-block rounded bg-brand-100 px-2 py-1 text-xs font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                {book.category}
              </span>
            </div>
          )}

          <div className="flex items-end gap-2">
            <h3 className="line-clamp-1 text-xl font-bold text-neutral-900 transition-colors dark:text-neutral-100">
              {book.title || "제목 없음"}
            </h3>
            <p className="shrink-0 text-sm text-neutral-600 dark:text-neutral-300">{book.author || "저자 미기재"}</p>
          </div>

          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {book.description || "아직 작성된 리뷰 요약이 없습니다."}
          </p>

          {renderStars(book.rating)}

          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {book.publishedAt ? `출판 ${dayjs(book.publishedAt).format("YYYY년 MM월 DD일")}` : ""}
            {book.date ? ` · 작성 ${dayjs(book.date).format("YYYY년 MM월 DD일")}` : ""}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
