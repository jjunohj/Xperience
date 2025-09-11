import { cn } from "@/src/libs/core";

interface MobileMenuBtnProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function MobileMenuBtn({ isMenuOpen, toggleMenu }: MobileMenuBtnProps) {
  return (
    <button
      onClick={toggleMenu}
      className="rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
      aria-expanded={isMenuOpen}
    >
      <div className="relative h-5 w-5">
        <span
          className={cn(
            "absolute block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out",
            isMenuOpen ? "translate-y-2 rotate-45" : "translate-y-1",
          )}
        />
        <span
          className={cn(
            "absolute block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out",
            isMenuOpen ? "opacity-0" : "translate-y-2",
          )}
        />
        <span
          className={cn(
            "absolute block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out",
            isMenuOpen ? "translate-y-2 -rotate-45" : "translate-y-3",
          )}
        />
      </div>
    </button>
  );
}
