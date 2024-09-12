"use client";

import React, { useEffect, useRef } from "react";

const Comments = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.async = true;
      script.setAttribute("repo", "jjunohj/archive-comments");
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("theme", "preferred-color-scheme");
      script.setAttribute("label", "💬댓글");
      script.setAttribute("crossorigin", "anonymous");
      ref.current.appendChild(script);
    }
  }, []);

  return <div ref={ref} className="mt-8"></div>;
};

export default Comments;
