"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

const Providers = ({ children }) => {
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};

export default Providers;
