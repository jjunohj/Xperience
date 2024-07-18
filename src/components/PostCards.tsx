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
      className="flex w-full flex-col items-center gap-3 sm:w-fit"
    >
      <motion.div
        variants={staggerHalf}
        className="flex w-full grid-cols-4 flex-col gap-4 overflow-clip sm:grid sm:grid-flow-dense sm:gap-6"
      >
        {allBlogPosts.slice(0, 4).map((post, idx) => (
          <PostCard key={idx} {...post} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PostCards;
