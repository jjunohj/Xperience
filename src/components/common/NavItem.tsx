import { usePathname } from "next/navigation";

import { $ } from "@/src/libs/core";

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
      className={$(
        isActive ? "text-primary font-semibold" : "text-secondary font-normal",
        className,
      )}
    >
      {children}
    </LinkHover>
  );
}
