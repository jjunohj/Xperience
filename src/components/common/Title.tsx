import { $ } from "@/src/libs/core";

export default function Title({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={$(
        "break-keep text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl",
        className,
      )}
    />
  );
}
