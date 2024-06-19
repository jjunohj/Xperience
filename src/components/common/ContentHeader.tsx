"use client";

import { motion } from "framer-motion";

const ContentHeader = ({ title }) => {
  return (
    <div className="flex flex-col w-full h-fit">
      <motion.h1
        className="text-3xl font-bold text-black dark:text-white mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h1>
      <hr className="mb-4" />
    </div>
  );
};

export default ContentHeader;
