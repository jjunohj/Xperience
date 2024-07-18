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

export type PostLayoutProps = {
  post: Post;
};

const mdxComponents = {
  img: ZoomImage,
  pre: CodeBlock,
};

export default function PostLayout({ post }: PostLayoutProps) {
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <>
      <ReadingProgressBar />
      <article className="animate-fadeInHalf">
        <div className="border-b-1 relative mb-8 h-72 w-full animate-fadeInHalf overflow-hidden text-center shadow-2xl shadow-gray-50 drop-shadow-sm dark:shadow-neutral-800">
          <Image
            src={post.thumbnail}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 blur-sm drop-shadow-sm filter dark:brightness-75 dark:contrast-125 dark:grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-60 dark:to-black" />
          <figcaption className="absolute bottom-0 left-0 right-0 mb-16">
            <Title className="mx-4">{post.title || "Untitled Post"}</Title>
            <div className="flex w-full flex-col justify-between gap-2">
              <div className="mx-auto flex gap-2 text-neutral-600 dark:text-neutral-400">
                <IconText
                  Icon={CalenderIcon}
                  text={dayjs(post.date).format("YYYY.MM.DD")}
                />
              </div>
              <div className="mx-auto mt-2 flex gap-2 text-sm opacity-90">
                {post.tags.map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
              </div>
            </div>
          </figcaption>
        </div>
        <div className="relative flex animate-fadeInHalf justify-center gap-8">
          <div className="prose prose-neutral mx-4 w-full max-w-xl font-spoqa dark:prose-dark sm:mx-0 sm:max-w-2xl lg:max-w-3xl">
            <MDXContent components={mdxComponents} />
          </div>
        </div>
      </article>
      <Toc />
    </>
  );
}
