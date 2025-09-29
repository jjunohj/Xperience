import { usePathname } from "next/navigation";

import { cn } from "@/src/libs/core";

import LinkHover from "./LinkHover";

export default function NavItem({
  href,
  children,
  className,
  ...props
}: React.ComponentProps<"a">) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <LinkHover
      {...props}
      href={href}
      className={cn(
        isActive ? "text-primary font-semibold" : "text-secondary font-normal",
        className,
      )}
    >
      {children}
    </LinkHover>
  );
}
