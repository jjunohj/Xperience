"use client";

import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { cn } from "@/src/libs/core";
import useWatchTimeout from "@/src/libs/useWatchTimeout";

import CheckIcon from "@/src/components/icons/CheckIcon";

export default function CodeBlock({
  children,
  title,
}: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useWatchTimeout(copied, 1500, () => {
    setCopied(false);
  });

  const handleCopy = async () => {
    const text = ref.current?.querySelector("code")?.innerText;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("코드를 복사했습니다.", { icon: "⌨️" });
    } catch (e) {
      console.error(e);
      toast.error("코드 복사에 실패했습니다.");
    }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-[var(--prism-background)]"
      ref={ref}
    >
      {title && (
        <div className="absolute left-5 top-3 z-10 text-xs text-neutral-400">
          {title}
        </div>
      )}
      <div className={cn("relative", title ? "pt-10" : "pt-5", "px-5 pb-5")}>
        {children}
      </div>
      <button
        className={cn(
          "absolute right-3 flex h-7 w-7 items-center justify-center rounded-md",
          "bg-neutral-700/70 text-neutral-300 hover:bg-neutral-600 hover:text-white",
          "opacity-0 transition-all group-hover:opacity-100",
          "focus:opacity-100 focus:outline-none",
          title ? "top-10" : "top-5",
        )}
        aria-label="copy-button"
        onClick={handleCopy}
      >
        {copied ? (
          <CheckIcon />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="14"
            width="14"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path>
            <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
