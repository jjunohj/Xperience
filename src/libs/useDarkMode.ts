import { useTheme } from "next-themes";

export default function useDarkMode() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const setThemeDark = () => setTheme("dark");
  const setThemeLight = () => setTheme("light");

  const isThemeDark = currentTheme === "dark";

  return {
    theme: currentTheme,
    isThemeDark,
    setThemeDark,
    setThemeLight,
    toggleTheme: () => {
      if (isThemeDark) {
        setThemeLight();
      } else {
        setThemeDark();
      }
    },
  };
}
