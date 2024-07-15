"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const Providers = ({ children }) => {
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  dayjs.locale("ko");

  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};

export default Providers;
