"use client";

import { Globe } from "lucide-react";
import { useState } from "react";
import type { OgData } from "~/data/types/notion";
import { getHostname } from "~/utils/url";

interface LinkCardProps {
  url: string;
  data?: OgData;
}

export default function LinkCard({ url, data }: LinkCardProps) {
  // favicon/썸네일 URL이 404 등으로 깨지면 각각 Globe 폴백 / 숨김 처리
  const [faviconError, setFaviconError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = data?.title || getHostname(url);
  const description = data?.description;
  const image = data?.image;
  const favicon = data?.favicon;
  const site = data?.siteName || getHostname(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose my-6 flex max-w-lg overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 no-underline transition-colors hover:border-brand-400 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-brand-500"
    >
      {/* 텍스트 영역 (세로 중앙 정렬) */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-4">
        <p className="line-clamp-2 font-medium text-neutral-900 dark:text-neutral-100">{title}</p>
        {description && <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>}
        {/* [favicon] 사이트명 — 설명 바로 아래, 항상 붙어서 */}
        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          {favicon && !faviconError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 shrink-0 rounded-sm"
              loading="lazy"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span className="truncate">{site}</span>
        </div>
      </div>

      {/* 썸네일 — 최소 반응형에서도 유지, 폭만 축소 */}
      {image && !imageError && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          loading="lazy"
          className="w-24 shrink-0 self-stretch object-cover sm:w-32 md:w-44"
          onError={() => setImageError(true)}
        />
      )}
    </a>
  );
}
