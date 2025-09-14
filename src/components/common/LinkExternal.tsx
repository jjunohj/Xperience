import { cn } from "@/src/libs/core";

export default function LinkExternal({
  children,
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      {...props}
      className={cn(
        " text-neutral-600 transition hover:text-secondary dark:text-neutral-400",
        className,
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
