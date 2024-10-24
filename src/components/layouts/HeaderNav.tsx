"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { siteConfig } from "@/config";
import NavItem from "../common/NavItem";
import DarkModeBtn from "../DarkModeBtn";
import LogoIcon from "../icons/LogoIcon";

export default function HeaderNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuVisible(true);
    } else {
      const timer = setTimeout(() => setIsMenuVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActiveNav = (navPath: string) => {
    if (navPath === "/") return pathname === "/";

    return pathname.startsWith(navPath);
  };

  return (
    <nav className="text-secondary z-10 w-full select-none sm:absolute sm:top-0">
      {/* PC */}
      <div className="hidden items-center p-4 sm:flex">
        <NavItem
          href="/"
          className="mr-4 px-3 py-1.5 text-3xl font-semibold"
          aria-label="logo"
        >
          <LogoIcon className="h-10 w-10" />
        </NavItem>
        {siteConfig.menus.map((link) => (
          <NavItem key={link.label} href={link.path} className="px-3 text-lg">
            {link.label}
          </NavItem>
        ))}
        <div className="my-auto ml-auto mr-2">
          <DarkModeBtn />
        </div>
      </div>

      {/* MW */}
      <div className="fixed left-0 right-0 top-0 flex items-center justify-between bg-white px-4 py-4 dark:bg-neutral-900 sm:hidden">
        <button onClick={toggleMenu}>
          <LogoIcon className="h-6 w-6 dark:fill-white" />
        </button>

        <div className="my-auto ml-auto mr-2">
          <DarkModeBtn className="h-4 w-4" />
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-2 top-14 w-24 rounded-md bg-white shadow-lg dark:bg-neutral-800"
          >
            {[{ label: "Home", path: "/" }, ...siteConfig.menus].map((link) => (
              <NavItem
                key={link.label}
                href={link.path}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                {link.label}
              </NavItem>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
