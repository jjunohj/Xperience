import { $ } from "@/src/libs/core";

export default function IconButton({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      aria-label="icon-button"
      {...props}
      type={type}
      className={$(
        "flex items-center justify-center transition-all",
        "text-secondary hover:scale-95",
        className,
      )}
    />
  );
}
