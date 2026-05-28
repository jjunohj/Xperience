"use client";

import { motion } from "framer-motion";

export default function ContentHeader({ title }: { title: string }) {
  return (
    <div className="flex h-fit w-full flex-col">
      <motion.h1
        className="mb-2 text-3xl font-bold text-black dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h1>
      <hr className="mb-4" />
    </div>
  );
}
