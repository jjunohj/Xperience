import { useEffect, useState } from "react";
import useDarkMode from "@/src/libs/useDarkMode";
import { cn } from "@/src/libs/core";

export default function DarkModeBtn(props: React.ComponentProps<"button">) {
  const [mounted, setMounted] = useState(false);
  const { isThemeDark, toggleTheme } = useDarkMode();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        {...props}
        className={cn(
          "rounded-lg p-2 transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800",
          props.className,
        )}
        disabled
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      {...props}
      className={cn(
        "group rounded-lg p-2 transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800",
        props.className,
      )}
      aria-label={isThemeDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      onClick={toggleTheme}
    >
      <div className="relative h-5 w-5 overflow-hidden">
        {/* 태양 아이콘 */}
        <svg
          className={cn(
            "absolute inset-0 h-5 w-5 transform transition-all duration-300 ease-in-out",
            isThemeDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>

        {/* 달 아이콘 */}
        <svg
          className={cn(
            "absolute inset-0 h-5 w-5 transform transition-all duration-300 ease-in-out",
            isThemeDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  );
}
