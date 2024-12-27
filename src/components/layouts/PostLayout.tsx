import dayjs from "dayjs";
import { useMDXComponent } from "next-contentlayer/hooks";

import Title from "@/src/components/common/Title";
import IconText from "@/src/components/common/IconText";
import CalenderIcon from "@/src/components/icons/CalenderIcon";
import CodeBlock from "../mdx/CodeBlock";
import ZoomImage from "../mdx/ZoomImage";
import ReadingProgressBar from "../ReadingProgressBar";
import Image from "next/image";
import { Post } from "contentlayer/generated";
import Tag from "../common/Tag";
import Toc from "../Toc";
import AdjacentPostNav from "../AdjacentPostNav";
import Comments from "../Comments";
import Description from "../Description";

export type PostLayoutProps = {
  post: Post;
};

const mdxComponents = {
  img: ZoomImage,
  pre: CodeBlock,
};

function generateJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: "jjunohj",
      url: "https://github.com/jjunohj",
    },
    datePublished: post.date,
    dateModified: post.date,
    image: post.thumbnail,
    url: `https://blog.xuuno.me${post.slug}`,
    keywords: post.tags.join(", "),
  };
}

export default function PostLayout({ post }: PostLayoutProps) {
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd(post)),
        }}
      />
      <ReadingProgressBar />
      <article className="animate-fadeInHalf">
        <div className="border-b-1 relative mb-8 h-72 w-full animate-fadeInHalf overflow-hidden text-center shadow-2xl shadow-gray-50 drop-shadow-sm dark:shadow-neutral-800 md:h-96 xl:h-[32rem]">
          <Image
            src={post.thumbnail}
            alt={`${post.title}의 대표 이미지`}
            layout="fill"
            objectFit="cover"
            priority={true}
            className="absolute inset-0 blur-sm drop-shadow-sm filter dark:brightness-75 dark:contrast-125 dark:grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-60 dark:to-black" />
          <figcaption className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex w-full flex-col items-center gap-2">
                <Title className="mx-4">{post.title || "Untitled Post"}</Title>
                <Description description={post.description} className="mb-4" />
                <div className="flex gap-2 text-sm opacity-90">
                  {post.tags.map((tag) => (
                    <Tag key={tag} tag={tag} />
                  ))}
                </div>

                <div className="mt-2 flex gap-2 text-neutral-800 dark:text-neutral-200">
                  <IconText
                    Icon={CalenderIcon}
                    text={dayjs(post.date).format("YYYY.MM.DD")}
                  />
                </div>
              </div>
            </div>
          </figcaption>
        </div>
        <div className="relative flex animate-fadeInHalf justify-center gap-8">
          <div className="prose prose-neutral w-full max-w-xl font-spoqa dark:prose-dark sm:max-w-2xl lg:max-w-3xl">
            <div className="mx-4 md:mx-0">
              <MDXContent components={mdxComponents} />
            </div>
          </div>
        </div>
        <div className="relative mt-8 flex animate-fadeInHalf justify-center gap-8">
          <AdjacentPostNav post={post} />
        </div>
        <Comments />
      </article>
      <Toc />
    </>
  );
}
