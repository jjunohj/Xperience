"use client";

import PostListItem from "@/src/components/PostListItem";
import IconText from "@/src/components/common/IconText";
import Tag from "@/src/components/common/Tag";
import Title from "@/src/components/common/Title";
import { allCategories } from "@/src/constants/dataset";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import CalenderIcon from "~/components/icons/CalenderIcon";
import ListIcon from "~/components/icons/ListIcon";
import { fadeInUp, staggerOne } from "~/constants/animations";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = allCategories.find((p) => p.category === params.slug);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="border-b-1 relative mb-8 h-80 w-full animate-fadeInHalf overflow-hidden text-center shadow-2xl shadow-gray-50 drop-shadow-sm dark:shadow-neutral-800">
        <Image
          src={category.thumbnail}
          alt={category.title}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 blur-sm drop-shadow-sm filter dark:brightness-75 dark:contrast-125 dark:grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-60 dark:to-black" />
        <figcaption className="absolute bottom-0 left-0 right-0 mb-20">
          <Title className="mx-4">
            {category.title || "Untitled category"}
          </Title>
          <div className="mt-4 flex flex-col items-center gap-1">
            <p className="text-primary font-light">{category.description}</p>
            <div className="text-primary flex justify-center gap-2">
              <IconText
                Icon={CalenderIcon}
                text={dayjs(category.date).format("YY.MM.DD")}
              />
              <IconText
                Icon={ListIcon}
                text={`${category.posts.length} 게시글`}
              />
            </div>
            <div className="mx-auto mt-1 flex gap-2 text-sm opacity-90">
              {category.tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </figcaption>
      </div>
      <div className="mx-auto w-full max-w-6xl sm:col-span-2">
        <motion.section
          className="mt-8 space-y-4 sm:mt-16"
          variants={staggerOne}
          initial="initial"
          animate="animate"
        >
          {category.posts.map((post, i) => (
            <motion.div key={post.slug} variants={fadeInUp}>
              <div className="flex space-x-6 px-4 sm:px-8">
                <div className="pt-4 text-lg font-bold sm:text-xl">
                  {i + 1}.
                </div>
                <PostListItem post={post} />
              </div>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </div>
  );
}
