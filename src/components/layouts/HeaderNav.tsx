"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config";
import NavItem from "../common/NavItem";
import DarkModeBtn from "../DarkModeBtn";

export default function HeaderNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  };

  const isActiveNav = (navPath: string) => {
    if (navPath === "/") return pathname === "/";

    return pathname.startsWith(navPath);
  };

  return (
    <nav className="text-secondary absolute top-0 z-10 flex w-full select-none items-end p-4">
      {/* PC */}
      <div className="hidden items-center sm:flex">
        <NavItem
          href="/"
          className="font-arizonia mr-4 px-3 py-1.5 text-3xl font-semibold"
          aria-label="logo"
        >
          J
        </NavItem>
        {siteConfig.menus.map((link) => (
          <NavItem
            key={link.label}
            href={link.path}
            className="px-3 pt-2 text-lg"
          >
            {link.label}
          </NavItem>
        ))}
      </div>
      {/* MW */}
      <div className="flex sm:hidden">
        <button onClick={toggleMenu}>
          <div className="font-arizonia px-3 py-1.5 text-2xl font-semibold">
            J
          </div>
        </button>
        {isMenuOpen &&
          [{ label: "Home", path: "/" }, ...siteConfig.menus].map((link) => (
            <NavItem
              key={link.label}
              href={link.path}
              className="animate-fadeInHalf px-3 pt-2 text-sm transition-all"
            >
              {link.label}
            </NavItem>
          ))}
      </div>
      <div className="my-auto ml-auto mr-2">
        <DarkModeBtn />
      </div>
    </nav>
  );
}
