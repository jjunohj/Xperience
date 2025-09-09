"use client";

import { cn } from "@/src/libs/core";

interface LinkButtonProps extends React.ComponentProps<"button"> {
  href: string;
}

export default function LinkButton({
  className,
  href,
  children,
  ...props
}: LinkButtonProps) {
  const handleClick = () => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </button>
  );
}
