import dayjs from "dayjs";
import { useMDXComponent } from "next-contentlayer/hooks";
import { Post } from "@/src/libs/types";

import Title from "@/src/components/common/Title";
import IconText from "@/src/components/common/IconText";
import CalenderIcon from "@/src/components/icons/CalenderIcon";
import Hr from "@/src/components/common/Hr";
import CodeBlock from "../mdx/CodeBlock";
import ZoomImage from "../mdx/ZoomImage";
import ReadingProgressBar from "../ReadingProgressBar";

export type PostLayoutProps = {
  post: Post;
};

const mdxComponents = {
  img: ZoomImage,
  pre: CodeBlock,
};

export default function PostLayout({ post }: PostLayoutProps) {
  const MDXContent = useMDXComponent(post.body?.code || "");

  return (
    <>
      <ReadingProgressBar />
      <section className="animate-fadeInHalf">
        <div className="mx-auto mb-4 max-w-3xl text-center animate-fadeInHalf">
          <Title>{post.title || "Untitled Post"}</Title>
          <div className="mt-2 flex w-full flex-col justify-between md:flex-row md:items-center">
            <div className="mx-auto flex gap-2 text-neutral-600 dark:text-neutral-400">
              <IconText
                Icon={CalenderIcon}
                text={
                  post.date ? dayjs(post.date).format("YYYY.MM.DD") : "No date"
                }
              />
            </div>
          </div>
          <Hr className="mt-4" />
        </div>
        <div className="relative gap-8 lg:flex animate-fadeInHalf">
          <div className="prose prose-neutral w-full max-w-3xl font-spoqa dark:prose-dark">
            <MDXContent components={mdxComponents} />
          </div>
        </div>
        <div className="mt-12 space-y-8 lg:mt-24 animate-fadeInHalf"></div>
      </section>
    </>
  );
}
