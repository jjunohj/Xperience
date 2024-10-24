import { useEffect, useState } from "react";

import useDarkMode from "@/src/libs/useDarkMode";
import IconButton from "./common/IconButton";

export default function DarkModeBtn(props: React.ComponentProps<"button">) {
  const [mounted, setMounted] = useState(false);
  const { isThemeDark, toggleTheme } = useDarkMode();

  useEffect(() => setMounted(true), []);

  return (
    <IconButton {...props} aria-label="Toggle Dark Mode" onClick={toggleTheme}>
      {!mounted ? (
        <></>
      ) : isThemeDark ? (
        <span className="pt-2 text-xl sm:pt-4 sm:text-2xl">🌙</span>
      ) : (
        <span className="pt-2 text-xl sm:pt-4 sm:text-2xl">☀️</span>
      )}
    </IconButton>
  );
}
