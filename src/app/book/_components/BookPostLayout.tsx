"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import NotionToc from "~/components/notion/NotionToc";
import ReadingProgressBar from "~/components/ReadingProgressBar";
import Comments from "~/components/Comments";
import VideoPlayer from "~/components/mdx/VideoPlayer";
import CodeBlock from "~/components/mdx/CodeBlock";
import NotionBlockquote from "~/components/mdx/NotionBlockquote";
import ZoomImage from "~/components/mdx/ZoomImage";
import { fadeInUp } from "@/src/data/constants/animations";
import { BookDetail } from "@/src/data/types/notion";
import BookHeroHeader from "./BookHeroHeader";

interface BookPostLayoutProps {
  book: BookDetail;
}

const SITE_ORIGIN = "https://blog.xuuno.me";

function isExternalHref(href: string): boolean {
  if (!href || href.startsWith("#") || href.startsWith("/")) {
    return false;
  }

  try {
    return new URL(href, SITE_ORIGIN).origin !== SITE_ORIGIN;
  } catch {
    return false;
  }
}

export default function BookPostLayout({ book }: BookPostLayoutProps) {
  return (
    <div className="relative">
      <ReadingProgressBar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: {
              "@type": "Book",
              name: book.title,
              author: {
                "@type": "Person",
                name: book.author || "Unknown",
              },
              image: book.cover || "/og-image.png",
              datePublished: book.publishedAt || undefined,
            },
            reviewBody: book.description || "",
            reviewRating:
              typeof book.rating === "number"
                ? {
                    "@type": "Rating",
                    ratingValue: Math.max(0, Math.min(5, Math.round(book.rating))),
                    bestRating: 5,
                  }
                : undefined,
            datePublished: book.date || new Date().toISOString(),
            author: {
              "@type": "Person",
              name: "Junho Cheong",
            },
          }),
        }}
      />

      <BookHeroHeader book={book} />

      <div className="xl:mx-auto xl:flex xl:max-w-7xl">
        <NotionToc layout="sidebar" />
        <div className="xl:hidden">
          <NotionToc layout="floating" />
        </div>

        <motion.article
          className="mx-auto max-w-4xl px-4 py-8 xl:flex-1"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {book.content ? (
            <div className="prose prose-stone max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
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
                  code({ inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");

                    if (!inline && match) {
                      const codeContent = String(children).replace(/\n$/, "");
                      const lines = codeContent.split("\n");
                      let title = null;
                      let actualCode = codeContent;

                      if (
                        lines[0]?.trim().startsWith("//") ||
                        lines[0]?.trim().startsWith("#") ||
                        lines[0]?.trim().startsWith("/*")
                      ) {
                        const firstLine = lines[0].trim();
                        if (firstLine.startsWith("//")) {
                          title = firstLine.replace("//", "").trim();
                        } else if (firstLine.startsWith("#")) {
                          title = firstLine.replace("#", "").trim();
                        } else if (firstLine.startsWith("/*")) {
                          title = firstLine.replace("/*", "").replace("*/", "").trim();
                        }

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
                    if (alt && alt.startsWith("video:")) {
                      const caption = alt.replace("video:", "").trim();
                      return <VideoPlayer url={src as string} caption={caption} />;
                    }

                    let imageSize = "";
                    let cleanAlt = alt || "";
                    const sizeMatch = /^\[size:(sm|md|lg)\](.*)/.exec(cleanAlt);
                    if (sizeMatch) {
                      imageSize = sizeMatch[1];
                      cleanAlt = sizeMatch[2].trim();
                    }

                    let imageWidth = 800;
                    let imageHeight = 400;
                    let containerClasses = "w-full";

                    if (imageSize === "sm") {
                      containerClasses = "mx-auto max-w-sm";
                      imageWidth = 400;
                      imageHeight = 300;
                    } else if (imageSize === "md") {
                      containerClasses = "mx-auto max-w-2xl";
                      imageWidth = 600;
                      imageHeight = 400;
                    } else if (imageSize === "lg") {
                      containerClasses = "w-full";
                      imageWidth = 1200;
                      imageHeight = 600;
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
                    const normalizedHref = href || "#";
                    const isExternal = isExternalHref(normalizedHref);

                    return (
                      <Link
                        href={normalizedHref}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="text-amber-700 underline-offset-2 hover:underline dark:text-amber-300"
                        {...props}
                      >
                        {children}
                      </Link>
                    );
                  },
                  blockquote({ node, ...props }: any) {
                    return <NotionBlockquote {...props} />;
                  },
                  p({ children, ...props }: any) {
                    if (typeof children !== "string" && children?.props?.src) {
                      return <div {...props}>{children}</div>;
                    }
                    return <p {...props}>{children}</p>;
                  },
                }}
              >
                {book.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="my-16 rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
              <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                콘텐츠를 불러오지 못했습니다.
              </p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">잠시 후 다시 시도해주세요.</p>
            </div>
          )}

          <Comments />

          <footer className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-700">
            <Link
              href="/book"
              className="inline-flex items-center font-medium text-amber-700 hover:underline dark:text-amber-300"
            >
              ← Books로 돌아가기
            </Link>
          </footer>
        </motion.article>
      </div>
    </div>
  );
}
