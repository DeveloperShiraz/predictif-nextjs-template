"use client";

import { ThemeProvider } from "next-themes";
import { FC, ReactNode, useEffect, useState } from "react";
import { configureAmplify } from "@/amplifyConfig";
import { AuthProvider } from "@/contexts/AuthContext";

interface ProvidersProps {
  children: ReactNode;
  className?: string;
}

// Initial configuration
configureAmplify();

const Providers: FC<ProvidersProps> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [initialTheme, setInitialTheme] = useState("system");

  useEffect(() => {
    // Check for user's stored preference
    const storedTheme = localStorage.getItem("theme");

    // Check for system preference if no stored theme
    if (!storedTheme) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setInitialTheme(prefersDark ? "dark" : "system");
    } else {
      setInitialTheme(storedTheme);
    }

    setIsConfigured(true);
  }, []);

  if (!isConfigured) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme={initialTheme}
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
      >
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
