import { Post } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import CalenderIcon from "./icons/CalenderIcon";
import { fadeInUp } from "../constants/animations";

const PostCard = (post: Post) => {
  return (
    <motion.a
      href={post.url}
      className="overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800"
      variants={fadeInUp}
      whileHover={{ scale: 1.05, transformOrigin: "center" }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative h-72 w-56 overflow-hidden rounded-2xl">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={224}
          height={288}
          draggable={false}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 dark:bg-black dark:bg-opacity-20" />

        <div className="absolute bottom-0 left-0 flex h-[136px] w-full flex-col items-start justify-start gap-2 bg-white bg-opacity-60 p-4 dark:bg-black dark:bg-opacity-30">
          <div className="flex items-center gap-2">
            <CalenderIcon className="w-4 -translate-y-[1.5px]" />
            <span className="text-xs text-black dark:text-white">
              {format(parseISO(post.date), "yyyy.MM.dd")}
            </span>
          </div>

          <h2 className="text-md font-semibold text-black dark:text-white">
            {post.title}
          </h2>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="bg-primary rounded px-2 py-1 text-xs font-semibold text-black dark:text-white">
            {post.category}
          </span>
        </div>
      </div>
    </motion.a>
  );
};

export default PostCard;
