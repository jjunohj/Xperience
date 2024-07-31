import React from "react";

import { $ } from "@/src/libs/core";

export interface PillProps extends React.ComponentProps<"div"> {
  selected?: boolean;
}

export default function Pill({ className, selected, ...props }: PillProps) {
  return (
    <div
      {...props}
      className={$(
        "rounded-lg px-2 py-0.5 text-xs  transition-colors",
        "bg-neutral-50 hover:text-primary hover:bg-tertiary dark:bg-neutral-800",
        selected
          ? "text-primary font-semibold ring-2 ring-neutral-350"
          : "text-secondary font-light",
        className,
      )}
    />
  );
}
