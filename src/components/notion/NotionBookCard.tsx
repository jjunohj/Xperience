"use client";

import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookMetadata } from "@/src/data/types/notion";
import { fadeInSlideToRight } from "@/src/data/constants/animations";
import Pill from "../common/Pill";
import IconText from "../common/IconText";
import CalenderIcon from "../icons/CalenderIcon";

interface NotionBookCardProps {
  book: BookMetadata;
}

export default function NotionBookCard({ book }: NotionBookCardProps) {
  const secondary = book.description?.trim() || (book.author ? `by ${book.author}` : "");

  return (
    <Link href={`/book/${book.slug}`}>
      <motion.div
        className="group flex min-h-72 w-full flex-col overflow-hidden p-4 sm:min-h-96"
        variants={fadeInSlideToRight}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative flex w-full flex-1 flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {book.cover && (
            <>
              {/* 블러 처리된 표지 배경 */}
              <Image
                src={book.cover}
                alt=""
                fill
                draggable={false}
                sizes="320px"
                aria-hidden="true"
                className="scale-110 object-cover opacity-35 blur-xl dark:opacity-30"
              />
              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent dark:from-black/40 dark:via-black/20" />
            </>
          )}

          {/* 중앙 표지 영역 (남는 공간 차지) */}
          <div className="relative z-10 flex flex-1 items-center justify-center p-5 sm:p-6">
            {book.cover ? (
              <div className="relative aspect-[2/3] h-32 overflow-hidden border border-neutral-300 bg-neutral-200 shadow-[0_14px_20px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-[1.02] dark:border-neutral-600 dark:bg-neutral-700 sm:h-48">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  draggable={false}
                  sizes="128px"
                  className="object-cover"
                />
                <div className="absolute left-0 top-0 h-full w-[6px] bg-black/[0.18]" />
              </div>
            ) : (
              <span className="text-sm text-neutral-400 dark:text-neutral-600">No Cover</span>
            )}
          </div>

          {/* 하단 푸터: 콘텐츠 길이에 따라 자연 높이로 늘어남 */}
          <div className="relative z-10 flex w-full min-h-32 flex-col justify-between gap-2 bg-white bg-opacity-60 p-3 dark:bg-black dark:bg-opacity-30 sm:min-h-[128px] sm:p-4">
            <div className="flex flex-col items-start space-y-2">
              <h2 className="line-clamp-2 text-sm font-semibold group-hover:drop-shadow-base-bold sm:text-xl">
                {book.title}
              </h2>
              {secondary && (
                <span className="line-clamp-2 text-xs font-light group-hover:drop-shadow-base-bold sm:text-sm">
                  {secondary}
                </span>
              )}
              {book.category && (
                <div className="flex flex-wrap gap-2">
                  <Pill className="bg-neutral-50 px-1.5 py-0.5 text-xs font-light dark:bg-neutral-900">
                    {book.category}
                  </Pill>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <IconText
                className="gap-1 text-xs font-light group-hover:drop-shadow-base-bold sm:text-sm"
                Icon={CalenderIcon}
                text={format(parseISO(book.date), "yyyy년 MM월 dd일")}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
