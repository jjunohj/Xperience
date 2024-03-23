import dayjs from "dayjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMDXComponent } from "next-contentlayer/hooks";

import { siteConfig } from "@/config";
import { fadeInHalf, staggerHalf } from "@/src/constants/animations";
import { Post, TableOfContents } from "@/src/libs/types";

import AuthorContacts from "@/src/components/common/AuthorContacts";
import Hr from "@/src/components/common/Hr";
import IconText from "@/src/components/common/IconText";
import Tag from "@/src/components/common/Tag";
import Title from "@/src/components/common/Title";
import CalenderIcon from "@/src/components/icons/CalenderIcon";
import ClockIcon from "@/src/components/icons/ClockIcon";
import CodeBlock from "../mdx/CodeBlock";
import ZoomImage from "../mdx/ZoomImage";
import ReadingProgressBar from "../ReadingProgressBar";
// import { BlogSEO } from '../SEO';
// import SeriesCard from '../SeriesCard';
// import TocBanner from '../TocBanner';
// import TocTop from '../TocTop';

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
      <section className="animate-fadeInHalf">
        {" "}
        {/* Use the Tailwind animation class */}
        {/* Post Header */}
        <div className="mx-auto mb-4 max-w-3xl text-center animate-fadeInHalf">
          {" "}
          {/* Apply animation class */}
          <Title>{post.title}</Title>
          <div className="mt-2 flex w-full flex-col justify-between md:flex-row md:items-center">
            <div className="mx-auto flex gap-2 text-neutral-600 dark:text-neutral-400">
              <IconText
                Icon={CalenderIcon}
                text={dayjs(post.date).format("YYYY.MM.DD")}
              />
            </div>
          </div>
          <Hr className="mt-4" />
        </div>
        {/* Post Content */}
        <div className="relative gap-8 lg:flex animate-fadeInHalf">
          <div className="prose prose-neutral w-full max-w-3xl font-spoqa dark:prose-dark">
            <MDXContent components={mdxComponents} />
          </div>{" "}
          {/* Apply animation class */}
          <div className="prose prose-neutral w-full max-w-3xl font-spoqa dark:prose-dark">
            {/* MDXContent and other elements */}
          </div>
        </div>
        {/* Post Footer */}
        <div className="mt-12 space-y-8 lg:mt-24 animate-fadeInHalf">
          {" "}
          {/* Apply animation class */}
          {/* Footer content */}
        </div>
      </section>
    </>
  );
}
