"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { RadixIcons } from "@/components/Icons";
import { Button } from "./ui/Button";
import { Box } from "@mui/material";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    // Initialize with system theme if no theme is set
    if (!localStorage.getItem("theme")) {
      setTheme("system");
    }
  }, [setTheme]);

  // Use system theme if theme is set to "system", otherwise use the selected theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  if (!isMounted) {
    return null; // Return null during initial mount
  }

  return (
    <Box className={`bg-transparent ${className}`}>
      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        {isDarkMode ? (
          <RadixIcons.SunIcon className="h-5 w-5" />
        ) : (
          <RadixIcons.MoonIcon className="h-5 w-5" />
        )}
      </Button>
    </Box>
  );
}

ThemeToggle.displayName = "ThemeToggle";
