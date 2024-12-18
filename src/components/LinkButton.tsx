"use client";

import { $ } from "@/src/libs/core";

interface LinkButtonProps extends React.ComponentProps<"button"> {
  href: string;
}

const LinkButton = ({
  className,
  href,
  children,
  ...props
}: LinkButtonProps) => {
  const handleClick = () => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={$("flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default LinkButton;
