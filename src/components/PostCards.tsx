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
      className="mt-16 flex w-full flex-col items-center gap-3 sm:w-fit"
    >
      <h2 className="mb-4 text-2xl font-extrabold tracking-tight">
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
