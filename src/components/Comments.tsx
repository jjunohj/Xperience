"use client";

import React, { useEffect, useRef } from "react";

import useDarkMode from "@/src/libs/useDarkMode";

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const { isThemeDark } = useDarkMode();
  const theme = isThemeDark ? "github-dark" : "github-light";

  useEffect(() => {
    if (ref.current && ref.current.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.async = true;
      script.setAttribute("repo", "jjunohj/archive-comments");
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("label", "💬댓글");
      script.setAttribute("theme", theme);
      script.setAttribute("crossorigin", "anonymous");
      ref.current.appendChild(script);
    }
  }, [theme]);

  useEffect(() => {
    const utterancesFrame = ref.current?.querySelector<HTMLIFrameElement>(".utterances-frame");
    if (utterancesFrame) {
      utterancesFrame.contentWindow?.postMessage(
        {
          type: "set-theme",
          theme,
        },
        "https://utteranc.es",
      );
    }
  }, [theme]);

  return (
    <section className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-700">
      <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">Comments</h2>
      <div ref={ref} className="min-h-40" />
    </section>
  );
}
