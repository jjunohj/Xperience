import { useEffect, useState } from "react";

import useDarkMode from "@/src/libs/useDarkMode";
import IconButton from "./common/IconButton";

export default function DarkModeBtn(props: React.ComponentProps<"button">) {
  const [mounted, setMounted] = useState(false);
  const { isThemeDark, toggleTheme } = useDarkMode();

  useEffect(() => setMounted(true), []);

  return (
    <IconButton
      className="font-arizonia text-2xl"
      {...props}
      aria-label="Toggle Dark Mode"
      onClick={toggleTheme}
    >
      {!mounted ? (
        <></>
      ) : isThemeDark ? (
        <span className="pt-2 text-2xl sm:pt-4 sm:text-3xl">🌙</span>
      ) : (
        <span className="pt-2 text-2xl sm:pt-4 sm:text-3xl">☀️</span>
      )}
    </IconButton>
  );
}
