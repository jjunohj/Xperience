"use client";

import React, { useEffect, useRef } from "react";

import useDarkMode from "@/src/libs/useDarkMode";

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const { isThemeDark } = useDarkMode();

  useEffect(() => {
    if (ref.current && ref.current.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.async = true;
      script.setAttribute("repo", "jjunohj/archive-comments");
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("label", "💬댓글");
      script.setAttribute("crossorigin", "anonymous");
      ref.current.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const utterancesFrame =
      document.querySelector<HTMLIFrameElement>(".utterances-frame");
    if (utterancesFrame) {
      utterancesFrame.contentWindow?.postMessage(
        {
          type: "set-theme",
          theme: isThemeDark ? "github-dark" : "github-light",
        },
        "https://utteranc.es",
      );
    }
  }, [isThemeDark]);

  return <div ref={ref}></div>;
}
