"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import NotionAdjacentPostNav from "~/components/notion/NotionAdjacentPostNav";
import NotionToc from "~/components/notion/NotionToc";
import ReadingProgressBar from "~/components/ReadingProgressBar";
import VideoPlayer from "~/components/mdx/VideoPlayer";
import CodeBlock from "~/components/mdx/CodeBlock";
import ZoomImage from "~/components/mdx/ZoomImage";
import { fadeInUp } from "@/src/data/constants/animations";
import { PostDetail } from "@/src/data/types/notion";

interface NotionPostLayoutProps {
  post: PostDetail;
}

export default function NotionPostLayout({ post }: NotionPostLayoutProps) {
  return (
    <div className="relative">
      <ReadingProgressBar />

      {/* JSON-LD 구조화 데이터 - Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title || "포스트",
            description: post.description || "Xperiences",
            image: post.thumbnail || "/og-image.png",
            author: {
              "@type": "Person",
              name: "xuuno",
              url: "https://blog.xuuno.me/about",
              sameAs: ["https://github.com/jjunohj"],
            },
            publisher: {
              "@type": "Organization",
              name: "Xperiences",
              url: "https://blog.xuuno.me",
              logo: { "@type": "ImageObject", url: "https://blog.xuuno.me/og-image.png", width: 1200, height: 630 },
            },
            datePublished: post.date || new Date().toISOString(),
            dateModified: post.date || new Date().toISOString(),
            mainEntityOfPage: { "@type": "WebPage", "@id": `https://blog.xuuno.me/blog/${post.slug}` },
            url: `https://blog.xuuno.me/blog/${post.slug}`,
            wordCount: post.wordCount || 0,
            timeRequired: `PT${post.readingTime || 1}M`,
            keywords: post.tags?.join(", ") || "",
            articleSection: post.category || "기타",
            inLanguage: "ko-KR",
            isPartOf: { "@type": "Blog", name: "Xperiences", url: "https://blog.xuuno.me/blog" },
          }),
        }}
      />

      {/* JSON-LD 구조화 데이터 - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://blog.xuuno.me" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://blog.xuuno.me/blog" },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title || "포스트",
                item: `https://blog.xuuno.me/blog/${post.slug}`,
              },
            ],
          }),
        }}
      />

      {/* 히어로 이미지 헤더 */}
      <header className="relative h-72 w-full overflow-hidden text-center shadow-2xl shadow-gray-50 drop-shadow-sm dark:shadow-neutral-800 md:h-80 xl:mb-12 xl:h-[32rem]">
        <Image
          src={post.thumbnail || "/og-image.png"}
          alt={post.title || "블로그 포스트"}
          fill
          className="absolute inset-0 object-cover blur-sm brightness-75 filter dark:brightness-75 dark:contrast-125 dark:grayscale"
          sizes="100vw"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
        />

        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent dark:from-black/70 dark:via-black/30" />

        {/* 통합된 중앙 콘텐츠 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex max-w-4xl flex-col items-center space-y-3 px-4 md:space-y-4 lg:space-y-6">
            {/* 카테고리 */}
            {post.category && (
              <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur-sm dark:bg-black/80 dark:text-brand-300 md:px-4 md:py-2 md:text-sm">
                {post.category}
              </span>
            )}

            {/* 제목 */}
            <h1 className="text-center text-3xl font-bold leading-tight text-white drop-shadow-lg md:text-4xl xl:text-6xl">
              {post.title || "제목 없음"}
            </h1>

            {/* 설명 - 반응형 */}
            {post.description && (
              <p className="max-w-2xl text-center text-sm text-white/90 drop-shadow-md md:text-lg lg:text-xl">
                {post.description}
              </p>
            )}

            {/* 태그 - 반응형 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-white/20 px-2 py-1 text-xs text-white backdrop-blur-sm transition-colors hover:bg-white/30 md:px-3"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 4 && (
                  <span className="inline-block rounded-full bg-white/15 px-2 py-1 text-xs text-white/80 backdrop-blur-sm md:px-3">
                    +{post.tags.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* 메타 정보 - 반응형 */}
            <div className="flex items-center justify-center gap-4 text-xs text-white/80 md:gap-6 md:text-sm">
              <time dateTime={post.date} className="flex items-center">
                <svg className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="md:hidden">{post.date ? dayjs(post.date).format("MM.DD") : "날짜 없음"}</span>
                <span className="hidden md:inline">
                  {post.date ? dayjs(post.date).format("YYYY년 MM월 DD일") : "날짜 없음"}
                </span>
              </time>

              <div className="flex items-center">
                <svg className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {post.readingTime || 1}분
              </div>

              <div className="flex items-center">
                <svg className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                {(post.wordCount || 0).toLocaleString()}자
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 - 목차와 아티클 분리 */}
      <div className="xl:mx-auto xl:flex xl:max-w-7xl">
        {/* 사이드바 목차 */}
        <NotionToc layout="sidebar" />

        {/* 플로팅 목차 (모바일/태블릿용) */}
        <div className="xl:hidden">
          <NotionToc layout="floating" />
        </div>

        <motion.article
          className="mx-auto max-w-4xl px-4 py-8 xl:flex-1"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* 콘텐츠 */}
          {post.content && (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw,
                  [
                    rehypeSanitize,
                    {
                      ...defaultSchema,
                      attributes: {
                        ...defaultSchema.attributes,
                        img: [...(defaultSchema.attributes?.img || []), ["data-size"]],
                      },
                    },
                  ],
                ]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");

                    if (!inline && match) {
                      const codeContent = String(children).replace(/\n$/, "");

                      // 코드 블럭에서 첫 번째 줄이 주석으로 된 캡션인지 확인
                      const lines = codeContent.split("\n");
                      let title = null;
                      let actualCode = codeContent;

                      if (
                        lines[0]?.trim().startsWith("//") ||
                        lines[0]?.trim().startsWith("#") ||
                        lines[0]?.trim().startsWith("/*")
                      ) {
                        const firstLine = lines[0].trim();
                        // 주석 기호 제거하여 캡션 추출
                        if (firstLine.startsWith("//")) {
                          title = firstLine.replace("//", "").trim();
                        } else if (firstLine.startsWith("#")) {
                          title = firstLine.replace("#", "").trim();
                        } else if (firstLine.startsWith("/*")) {
                          title = firstLine.replace("/*", "").replace("*/", "").trim();
                        }

                        // 캡션이 있으면 실제 코드에서 제거
                        if (title) {
                          actualCode = lines.slice(1).join("\n");
                        }
                      }

                      return (
                        <CodeBlock title={title}>
                          <SyntaxHighlighter
                            style={tomorrow as any}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              fontSize: "13px",
                              lineHeight: "1.4",
                              borderRadius: "0px",
                              background: "transparent",
                              border: "none",
                              margin: 0,
                              padding: 0,
                            }}
                            {...(props as any)}
                          >
                            {actualCode}
                          </SyntaxHighlighter>
                        </CodeBlock>
                      );
                    }

                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  img({ src, alt }: any) {
                    // 비디오 처리: alt 텍스트가 video:로 시작하는 경우
                    if (alt && alt.startsWith("video:")) {
                      const caption = alt.replace("video:", "").trim();
                      return <VideoPlayer url={src as string} caption={caption} />;
                    }

                    // alt 텍스트에서 사이즈 정보 추출
                    let imageSize = "";
                    let cleanAlt = alt || "";

                    // [size:sm], [size:md], [size:lg] 패턴 확인
                    const sizeMatch = /^\[size:(sm|md|lg)\](.*)/.exec(cleanAlt);
                    if (sizeMatch) {
                      imageSize = sizeMatch[1];
                      cleanAlt = sizeMatch[2].trim();
                    }

                    // 사이즈에 따른 이미지 크기 결정
                    let imageWidth = 800;
                    let imageHeight = 400;
                    let containerClasses = "";

                    switch (imageSize) {
                      case "sm":
                        containerClasses = "mx-auto max-w-sm";
                        imageWidth = 400;
                        imageHeight = 300;
                        break;
                      case "md":
                        containerClasses = "mx-auto max-w-2xl";
                        imageWidth = 600;
                        imageHeight = 400;
                        break;
                      case "lg":
                        containerClasses = "w-full";
                        imageWidth = 1200;
                        imageHeight = 600;
                        break;
                      default:
                        // 기본값: 전체 너비
                        containerClasses = "w-full";
                        imageWidth = 800;
                        imageHeight = 400;
                    }

                    return (
                      <figure className="my-8 block">
                        <div className={containerClasses}>
                          <ZoomImage
                            src={src as string}
                            alt={cleanAlt}
                            width={imageWidth}
                            height={imageHeight}
                            className="h-auto w-full rounded-lg object-cover"
                          />
                        </div>
                        {cleanAlt && (
                          <figcaption className="mt-3 text-center text-sm italic text-neutral-600 dark:text-neutral-400">
                            {cleanAlt}
                          </figcaption>
                        )}
                      </figure>
                    );
                  },
                  a({ href, children, ...props }) {
                    const isExternal = href?.startsWith("http");
                    return (
                      <Link
                        href={href || ""}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="text-brand-600 hover:underline dark:text-brand-400"
                        {...props}
                      >
                        {children}
                      </Link>
                    );
                  },
                  p({ children, ...props }: any) {
                    // 이미지가 포함된 p 태그를 div로 변환
                    if (typeof children !== "string" && children?.props?.src) {
                      return <div {...props}>{children}</div>;
                    }
                    return <p {...props}>{children}</p>;
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          )}

          {!post.content && (
            <div className="my-16 text-center">
              <div className="mx-auto max-w-md">
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mb-2 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  콘텐츠를 불러올 수 없습니다
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">게시글 내용을 불러오는 중 문제가 발생했습니다.</p>
              </div>
            </div>
          )}

          {/* 인접 포스트 네비게이션 */}
          <NotionAdjacentPostNav prevPost={post.prevPost} nextPost={post.nextPost} />

          {/* 푸터 */}
          <footer className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <Link href="/blog" className="flex items-center text-brand-600 hover:underline dark:text-brand-400">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                블로그 목록으로 돌아가기
              </Link>
            </div>
          </footer>
        </motion.article>
      </div>
    </div>
  );
}
