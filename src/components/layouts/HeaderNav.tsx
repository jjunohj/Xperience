"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config";
import { $ } from "@/src/libs/core";

import LogoIcon from "../icons/LogoIcon";
import NavItem from "../common/NavItem";
import { useDelayedRender } from "@/src/libs/useDelayedRender";
import DarkModeBtn from "../DarkModeBtn";

export default function HeaderNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { mounted: isMenuMounted, rendered: isMenuRendered } = useDelayedRender(
    isMenuOpen, //isMenuActive
    {
      enterDelay: 20,
      exitDelay: 300,
    },
  );

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = ""; // 모바일 화면에서 메뉴바 닫았을 시 스크롤 가능
    } else {
      setIsMenuOpen(true);
      document.body.style.overflow = "hidden"; // 모바일 화면에서 메뉴바 열었을 시 스크롤 불가능
    }
  };

  const isActiveNav = (navPath: string) => {
    if (navPath === "/") return pathname === "/";

    return pathname.startsWith(navPath);
  };

  useEffect(() => {
    return function cleanup() {
      document.body.style.overflow = ""; // 컴포넌트가 언마운트 될 때 스크롤 가능하도록 변경
    };
  }, []);

  return (
    <nav className="text-secondary flex w-full select-none items-end p-4 sm:p-6 sm:py-8 md:pb-12">
      {/* PC */}
      <div className="hidden items-end sm:flex">
        <NavItem href="/" className="mr-2" aria-label="logo">
          <LogoIcon width={40} />
        </NavItem>
        {siteConfig.menus.map((link) => (
          <NavItem key={link.label} href={link.path} className="px-3 py-1.5">
            {link.label}
          </NavItem>
        ))}
      </div>
      {/* MW */}
      <div className="flex sm:hidden">
        <button onClick={toggleMenu}>
          <LogoIcon width={40} />
        </button>
        {isMenuMounted && (
          <ul
            className={$(
              "bg-primary absolute inset-x-0 -bottom-4 top-[108px] z-50 flex flex-col px-6 transition-all",
              isMenuRendered ? "opacity-100" : "opacity-0",
            )}
          >
            {[{ label: "Home", path: "/" }, ...siteConfig.menus].map(
              (link, i) => (
                <Link
                  key={link.label}
                  href={link.path}
                  className={$(
                    "border-b border-neutral-200 py-4 font-semibold transition-all dark:border-neutral-700",
                    isMenuRendered
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0",
                    isActiveNav(link.path) ? "text-yellow-400" : "text-primary",
                  )}
                  style={{ transitionDelay: `${150 + i * 25}ms` }}
                >
                  {link.label}
                </Link>
              ),
            )}
          </ul>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DarkModeBtn />
      </div>
    </nav>
  );
}
