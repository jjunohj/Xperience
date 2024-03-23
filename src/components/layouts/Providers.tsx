"use client";

import useKBarAction from "@/src/libs/useKBarAction";
import { KBarProvider } from "kbar";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const KBar = dynamic(() => import("@/src/components/KBar"), { ssr: false });

const Providers = ({ children }) => {
  const [isMount, setIsMount] = useState(false);
  const actions = useKBarAction();

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <ThemeProvider attribute="class">
      <KBarProvider actions={actions} options={{ enableHistory: true }}>
        {children}
        <KBar />
      </KBarProvider>
    </ThemeProvider>
  );
};

export default Providers;
