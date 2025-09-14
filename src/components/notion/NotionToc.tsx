"use client";

import { cn } from "@/src/libs/core";
import { getIntersectionObserver } from "@/src/libs/observer";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

type TocLayout = "floating" | "sidebar";

interface NotionTocProps {
  layout?: TocLayout;
}

export default function NotionToc({ layout = "floating" }: NotionTocProps) {
  const [currentId, setCurrentId] = useState<string>("");
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    // Notion 마크다운에서 헤딩 추출
    const headingElements = Array.from(
      document.querySelectorAll(".prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6"),
    );

    const headingData = headingElements.map((heading, index) => {
      // ID가 없으면 생성
      if (!heading.id) {
        const id = `heading-${index}-${heading.textContent?.replace(/[^\w가-힣]/g, "-").toLowerCase()}`;
        heading.id = id;
      }

      return {
        id: heading.id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.charAt(1)),
      };
    });

    setHeadings(headingData);

    // 스크롤 감지 - 어느 정도 스크롤하면 TOC 표시
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowToc(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    // Intersection Observer 설정
    if (headingElements.length > 0) {
      const observer = getIntersectionObserver(setCurrentId);
      headingElements.forEach((heading) => {
        observer.observe(heading);
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        headingElements.forEach((heading) => {
          observer.unobserve(heading);
        });
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (headings.length === 0) return null;

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const headerOffset = 80; // 상단 여백
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // 플로팅 목차는 클릭 시 접기
      if (layout === "floating") {
        setIsExpanded(false);
      }
    }
  };

  // 플로팅 레이아웃
  if (layout === "floating") {
    return (
      <div
        className={cn(
          "fixed right-6 top-1/2 z-50 -translate-y-1/2 transform transition-all duration-300",
          showToc ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0",
        )}
      >
        <div className="relative">
          {/* 목차 컨텐츠 */}
          <div
            className={cn(
              "overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl transition-all duration-500 ease-out dark:border-neutral-700 dark:bg-neutral-800",
              isExpanded ? "max-h-96 w-72 opacity-100" : "max-h-0 w-72 opacity-0",
            )}
          >
            <div
              className={cn(
                "transition-all duration-500 ease-out",
                isExpanded ? "translate-y-0 transform opacity-100" : "-translate-y-4 transform opacity-0",
              )}
            >
              <div className="p-4">
                <h3 className="mb-3 flex items-center text-sm font-semibold text-neutral-900 dark:text-white">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                  목차
                </h3>
                <ul
                  className="max-h-64 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {headings.map((heading, index) => (
                    <li
                      key={heading.id}
                      className={cn(
                        "transition-all duration-300 ease-out",
                        isExpanded ? "translate-x-0 transform opacity-100" : "translate-x-2 transform opacity-0",
                      )}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <a
                        href={`#${heading.id}`}
                        onClick={(e) => handleSmoothScroll(e, heading.id)}
                        className={cn(
                          "group block rounded-md px-2 py-1.5 text-xs transition-all duration-200 hover:scale-[1.02] hover:bg-neutral-100 dark:hover:bg-neutral-700",
                          currentId === heading.id
                            ? "bg-blue-50 font-semibold text-blue-600 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
                          // 개선된 레벨별 들여쓰기와 시각적 구분
                          heading.level === 1
                            ? "text-sm font-medium"
                            : heading.level === 2
                              ? "ml-3 text-xs"
                              : heading.level === 3
                                ? "ml-6 text-xs opacity-90"
                                : heading.level === 4
                                  ? "ml-9 text-xs opacity-80"
                                  : heading.level === 5
                                    ? "ml-12 text-xs opacity-70"
                                    : "ml-15 text-xs opacity-60",
                        )}
                      >
                        <span className="flex items-center">
                          {heading.level > 2 && (
                            <span className="mr-2 h-1 w-1 rounded-full bg-neutral-400 opacity-50"></span>
                          )}
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                            {heading.text}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 토글 버튼 - 목차 오른쪽 위에 위치 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -top-12 right-2 z-10 rounded-full bg-white p-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 dark:bg-neutral-800"
            aria-label="목차 토글"
          >
            <svg
              className={cn(
                "h-4 w-4 text-neutral-600 transition-transform duration-300 dark:text-neutral-400",
                isExpanded ? "rotate-180" : "",
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // 사이드바 레이아웃 (컨텐츠 너비 조정)
  if (layout === "sidebar") {
    return (
      <aside className="hidden xl:block xl:w-72 xl:flex-shrink-0">
        <div className="sticky top-24 h-screen overflow-y-auto p-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-4 flex items-center text-sm font-semibold text-neutral-900 dark:text-white">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
              목차
            </h3>
            <ul
              className="max-h-96 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleSmoothScroll(e, heading.id)}
                    className={cn(
                      "group block rounded-md px-2 py-1.5 text-xs transition-all duration-200 hover:scale-[1.02] hover:bg-neutral-100 dark:hover:bg-neutral-700",
                      currentId === heading.id
                        ? "bg-blue-50 font-semibold text-blue-600 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
                      // 개선된 레벨별 들여쓰기와 시각적 구분
                      heading.level === 1
                        ? "text-sm font-medium"
                        : heading.level === 2
                          ? "ml-3 text-xs"
                          : heading.level === 3
                            ? "ml-6 text-xs opacity-90"
                            : heading.level === 4
                              ? "ml-9 text-xs opacity-80"
                              : heading.level === 5
                                ? "ml-12 text-xs opacity-70"
                                : "ml-15 text-xs opacity-60",
                    )}
                  >
                    <span className="flex items-center">
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                        {heading.text}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}
