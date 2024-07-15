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
        className="flex w-full flex-col sm:grid sm:grid-flow-dense sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
      >
        {allBlogPosts.map((post, idx) => (
          <PostCard key={idx} {...post} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PostCards;
