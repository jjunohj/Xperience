"use client";

import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PageMetadata } from "@/src/data/types/notion";
import { fadeInSlideToRight } from "@/src/data/constants/animations";
import Pill from "../common/Pill";
import IconText from "../common/IconText";
import CalenderIcon from "../icons/CalenderIcon";

interface NotionPostCardProps {
  post: PageMetadata;
}

export default function NotionPostCard({ post }: NotionPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        className="group h-72 w-full overflow-hidden p-4 sm:h-96"
        variants={fadeInSlideToRight}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative h-full w-full overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={224}
              height={288}
              draggable={false}
              className="h-full w-full object-cover group-hover:drop-shadow-base-bold dark:brightness-90"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
              <span className="text-sm text-neutral-400 dark:text-neutral-600">No Image</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 flex h-32 w-full flex-col justify-between bg-white bg-opacity-60 p-3 dark:bg-black dark:bg-opacity-30 sm:h-[128px] sm:p-4">
            <div className="flex flex-col items-start space-y-2">
              <h2 className="line-clamp-2 text-sm font-semibold group-hover:drop-shadow-base-bold sm:text-xl">
                {post.title}
              </h2>
              <span className="line-clamp-2 text-xs font-light group-hover:drop-shadow-base-bold sm:text-sm">
                {post.description}
              </span>
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <Pill key={tag} className="bg-neutral-50 px-1.5 py-0.5 text-xs font-light dark:bg-neutral-900">
                    {tag}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <IconText
                className="gap-1 text-xs font-light group-hover:drop-shadow-base-bold sm:text-sm"
                Icon={CalenderIcon}
                text={format(parseISO(post.date), "yyyy년 MM월 dd일")}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
