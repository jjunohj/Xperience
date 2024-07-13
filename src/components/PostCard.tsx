import { Post } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import CalenderIcon from "./icons/CalenderIcon";
import { fadeInUp } from "../constants/animations";
import IconText from "./common/IconText";

const PostCard = (post: Post) => {
  return (
    <motion.a
      href={post.url}
      className="w-full overflow-hidden rounded-xl shadow-sm drop-shadow-xl dark:bg-neutral-800 sm:bg-neutral-200"
      variants={fadeInUp}
      whileHover={{ scale: 1.05, transformOrigin: "center" }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative h-24 w-full rounded-2xl sm:h-72 sm:w-56">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={224}
          height={288}
          draggable={false}
          className="h-24 w-1/3 object-cover  dark:brightness-75 dark:contrast-125 dark:grayscale sm:h-72 sm:w-56"
        />
        <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent to-white opacity-50 dark:to-black sm:hidden" />
        <div className="absolute inset-0 dark:bg-black dark:bg-opacity-20" />

        <div className="absolute bottom-0 right-0 flex h-full w-2/3 flex-col items-start justify-start gap-1.5 bg-white bg-opacity-60 p-4 dark:bg-black dark:bg-opacity-30 sm:left-0 sm:h-[136px] sm:w-full sm:gap-2">
          <IconText
            Icon={CalenderIcon}
            text={format(parseISO(post.date), "yyyy.MM.dd")}
          />

          <h2 className="text-sm font-semibold text-black dark:text-white sm:text-base">
            {post.title}
          </h2>
        </div>

        <div className="absolute bottom-4 left-4 hidden sm:block">
          <span className="bg-primary rounded px-2 py-1 text-xs font-semibold text-black dark:text-white">
            {post.category}
          </span>
        </div>
      </div>
    </motion.a>
  );
};

export default PostCard;
