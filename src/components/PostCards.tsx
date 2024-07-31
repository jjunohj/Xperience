"use client";

import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import { staggerHalf } from "../constants/animations";
import { allBlogPosts } from "../constants/dataset";

const PostCards = () => {
  return (
    <motion.section
      variants={staggerHalf}
      initial="initial"
      animate="animate"
      className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-16 sm:w-fit"
    >
      <h2 className="text-base font-semibold sm:mb-4 sm:text-2xl sm:tracking-tight">
        RECENT POSTS
      </h2>
      <motion.div variants={staggerHalf} className="flex w-full flex-col gap-4">
        {allBlogPosts.slice(0, 4).map((post, idx) => (
          <PostCard key={idx} {...post} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PostCards;
