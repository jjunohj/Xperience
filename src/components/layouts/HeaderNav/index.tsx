"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { siteConfig } from "@/config";
import NavItem from "../../common/NavItem";
import LogoIcon from "../../icons/LogoIcon";
import DarkModeBtn from "./DarkModeBtn";
import MobileMenuBtn from "./MobileMenuBtn";

export default function HeaderNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 스크롤 이벤트 감지 (헤더 숨김/표시 + 배경 변경)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollThreshold = 100;

      setIsScrolled(currentScrollY > 30);

      // 헤더 표시/숨김 로직
      if (currentScrollY < scrollThreshold) {
        // 상단 근처에서는 항상 표시
        setIsHeaderVisible(true);
      } else if (scrollingDown && currentScrollY > lastScrollY + 10) {
        // 아래로 스크롤 시 숨김
        setIsHeaderVisible(false);
        setIsMenuOpen(false); // 메뉴도 함께 닫기
      } else if (!scrollingDown && lastScrollY - currentScrollY > 10) {
        // 위로 스크롤 시 표시
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 모바일 메뉴가 열려있을 때 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // 메뉴 토글
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 특정 페이지에서는 다른 스타일 적용 (콘텐츠가 바로 시작하는 페이지들)
  const isBlogPost = pathname.startsWith("/blog");
  const isAboutPage = pathname.startsWith("/about");
  const isSpecialPage = isBlogPost || isAboutPage;

  // 헤더 배경 스타일 결정
  const getHeaderBgClass = () => {
    if (isSpecialPage) {
      // 특수 페이지에서는 항상 배경이 있으므로 보더 제거
      return isScrolled
        ? "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm shadow-neutral-200/10 dark:shadow-neutral-800/20"
        : "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm";
    }
    // 일반 페이지에서도 보더 대신 그림자만 사용
    return isScrolled
      ? "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-sm shadow-neutral-200/10 dark:shadow-neutral-800/20"
      : "bg-transparent";
  };

  return (
    <>
      {/* 데스크톱 네비게이션 */}
      <nav
        className={`
        fixed left-0 right-0 z-50 w-full select-none transition-all duration-300 ease-in-out
        ${getHeaderBgClass()}
        ${isHeaderVisible ? "top-0 translate-y-0" : "-top-20 -translate-y-full"}
      `}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-4 py-4">
            {/* 로고 */}
            <NavItem
              href="/"
              className="group flex-shrink-0 text-2xl font-bold transition-all duration-300"
              aria-label="home"
            >
              <div className="relative h-8 w-8">
                <LogoIcon className="h-8 w-8 opacity-100 transition-all duration-300 group-hover:opacity-0" />
                <LogoIcon
                  enableGradient
                  className="absolute inset-0 h-8 w-8 opacity-0 transition-all duration-300 group-hover:opacity-100"
                />
              </div>
            </NavItem>

            {/* 데스크톱 메뉴 */}
            <div className="hidden items-center space-x-1 sm:flex">
              {siteConfig.menus.map((link) => (
                <NavItem
                  key={link.label}
                  href={link.path}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                >
                  {link.label}
                </NavItem>
              ))}

              {/* 다크모드 토글 */}
              <div className="ml-4 border-l border-neutral-200 pl-4 dark:border-neutral-700">
                <DarkModeBtn />
              </div>
            </div>

            {/* 모바일 메뉴 버튼 */}
            <div className="flex items-center space-x-3 sm:hidden">
              <DarkModeBtn />
              <MobileMenuBtn isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
      </nav>

      {/* 모바일 드롭다운 메뉴 */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
              onClick={toggleMenu}
            />

            {/* 메뉴 패널 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-4 right-4 top-20 z-50 rounded-xl bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:bg-neutral-900/95 sm:hidden"
            >
              <div className="space-y-2">
                <NavItem
                  href="/"
                  className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  onClick={toggleMenu}
                >
                  Home
                </NavItem>
                {siteConfig.menus.map((link) => (
                  <NavItem
                    key={link.label}
                    href={link.path}
                    className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </NavItem>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 특정 페이지에서 콘텐츠 간격을 위한 spacer */}
      {isSpecialPage && <div className="h-20" />}
    </>
  );
}
