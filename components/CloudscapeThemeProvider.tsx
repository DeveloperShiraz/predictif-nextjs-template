"use client";

import { useTheme } from "next-themes";
import { applyMode, Mode } from "@cloudscape-design/global-styles";
import { useEffect, useState } from "react";

export function CloudscapeThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      applyMode(resolvedTheme === "dark" ? Mode.Dark : Mode.Light);
    }
  }, [resolvedTheme, isMounted]);

  return <>{children}</>;
}
