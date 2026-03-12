"use client";

import Image from "next/image";
import dayjs from "dayjs";
import { BookDetail } from "@/src/data/types/notion";

interface BookHeroHeaderProps {
  book: BookDetail;
}

function renderStars(rating?: number) {
  if (typeof rating !== "number") return null;
  const clampedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-1 text-sm text-amber-200">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < clampedRating ? "opacity-100" : "opacity-20"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function BookHeroHeader({ book }: BookHeroHeaderProps) {
  return (
    <header className="relative isolate w-full overflow-hidden border-b border-neutral-700 text-center shadow-2xl shadow-gray-50 drop-shadow-sm dark:shadow-neutral-800 xl:mb-12 xl:h-[32rem]">
      <Image
        src={book.cover || "/og-image.png"}
        alt={book.title || "도서 커버 배경"}
        fill
        className="absolute inset-0 z-0 scale-110 object-cover blur-md brightness-75 filter dark:brightness-50 dark:contrast-125"
        sizes="100vw"
        priority
      />
      <div className="from-black/62 via-black/34 dark:from-black/72 dark:via-black/44 pointer-events-none absolute inset-0 z-10 bg-gradient-to-t to-transparent" />

      <div className="md:20 relative z-20 mx-auto w-full max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pb-10 md:px-20 lg:px-36 xl:flex xl:h-full xl:items-center xl:pb-0 xl:pt-0">
        <div className="grid items-start gap-5 md:grid-cols-[132px_minmax(0,1fr)] md:items-center md:gap-7 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-10">
          <div className="mx-auto w-28 [perspective:1200px] sm:w-32 md:mx-0 md:w-full">
            <div className="relative aspect-[3/4] origin-left overflow-hidden rounded-lg border border-white/30 shadow-[0_20px_35px_-18px_rgba(0,0,0,0.8)] [transform:rotateX(0.5deg)_rotateY(-7deg)_rotateZ(-0.2deg)]">
              <Image
                src={book.cover || "/og-image.png"}
                alt={book.title || "도서 커버"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 112px, (max-width: 1024px) 132px, 180px"
                priority
              />
              <div className="absolute left-0 top-0 h-full w-[8px] bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
            </div>
          </div>

          <div className="max-w-4xl text-center text-white md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {book.category && (
                <span className="inline-block transform-gpu rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-black/80 dark:text-brand-300 md:text-sm">
                  {book.category}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-bold leading-tight drop-shadow-lg sm:text-4xl md:text-5xl xl:text-6xl">
              {book.title || "제목 없음"}
            </h1>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 md:justify-start">
              <p className="text-white/92 text-lg font-semibold sm:text-xl">{book.author || "저자 미기재"}</p>
              {renderStars(book.rating)}
            </div>

            {book.description && (
              <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-relaxed text-white/90 sm:line-clamp-none sm:text-base md:text-lg">
                {book.description}
              </p>
            )}

            <div className="text-white/88 mt-4 grid hidden grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:block md:flex md:flex-wrap md:items-center md:justify-start">
              {book.publishedAt && (
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-[2px]">
                  출판일: {dayjs(book.publishedAt).format("YYYY년 MM월 DD일")}
                </span>
              )}
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-[2px]">
                {book.date ? `읽은 날: ${dayjs(book.date).format("YYYY년 MM월 DD일")}` : "읽은 날: 미기재"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
