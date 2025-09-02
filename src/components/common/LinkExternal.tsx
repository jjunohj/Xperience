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
        " text-gray-600 transition hover:text-secondary dark:text-gray-400",
        className,
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
