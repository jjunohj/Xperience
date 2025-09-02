import Link from "next/link";

import { cn } from "@/src/libs/core";

export default function LinkHover({
  ref: _,
  className,
  href,
  children,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <Link
      {...props}
      href={href ?? "/"}
      className={cn(
        "flex items-center transition-all hover:scale-95",
        className,
      )}
    >
      {children}
    </Link>
  );
}
