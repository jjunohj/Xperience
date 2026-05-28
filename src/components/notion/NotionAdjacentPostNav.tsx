"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ArrowIcon from "../icons/ArrowIcon";
import { PageReference } from "@/src/data/types/notion";

interface NotionAdjacentPostNavProps {
  prev?: PageReference;
  next?: PageReference;
  basePath?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export default function NotionAdjacentPostNav({
  prev,
  next,
  basePath = "/blog",
  prevLabel = "이전 글",
  nextLabel = "다음 글",
}: NotionAdjacentPostNavProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        {/* Previous */}
        <div className="flex-1">
          {prev ? (
            <Link href={`${basePath}/${prev.slug}`} className="group">
              <motion.div
                className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowIcon
                  direction="left"
                  className="h-5 w-5 text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">{prevLabel}</p>
                  <p className="truncate text-sm font-medium text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100">
                    {prev.title}
                  </p>
                </div>
              </motion.div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* Next */}
        <div className="flex-1">
          {next ? (
            <Link href={`${basePath}/${next.slug}`} className="group">
              <motion.div
                className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="min-w-0 flex-1 text-right">
                  <p className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">{nextLabel}</p>
                  <p className="truncate text-sm font-medium text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100">
                    {next.title}
                  </p>
                </div>
                <ArrowIcon
                  direction="right"
                  className="h-5 w-5 text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                />
              </motion.div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </nav>
  );
}
