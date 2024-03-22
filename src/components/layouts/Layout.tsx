import { ReactNode, useMemo } from "react";
import HeaderNav from "./HeaderNav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:max-w-6xl lg:px-8">
      <HeaderNav />
      {/* --- */}
      <main className="relative pb-16">{children}</main>
      {/* --- */}
      <footer className="pb-8 text-sm text-neutral-800 dark:text-neutral-400"></footer>
    </div>
  );
}
