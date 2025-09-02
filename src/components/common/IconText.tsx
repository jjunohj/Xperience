import React, { type JSX } from "react";

import { cn } from "@/src/libs/core";

export interface IconTextProps {
  Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  iconSize?: number;
  text?: React.ReactNode;
  className?: string;
}

export default function IconText({
  Icon,
  iconSize = 14,
  text,
  className,
}: IconTextProps) {
  return (
    <div
      className={cn(
        "flex items-center ",
        className ?? "gap-1 text-xs",
        `h-[${iconSize}px]`,
      )}
    >
      <Icon width={iconSize} height={iconSize} />
      <span className={cn("text-center", `h-[${iconSize}px]`)}>{text}</span>
    </div>
  );
}
