import * as React from "react";
import { useTheme } from "next-themes";
import { RadixIcons } from "@/components/Icons";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("cursor-pointer", className)}
    >
      {theme === "dark" ? (
        <RadixIcons.SunIcon className="h-6 w-6 text-white" />
      ) : (
        <RadixIcons.MoonIcon className="h-6 w-6 text-black" />
      )}
    </div>
  );
}

ThemeToggle.displayName = "ThemeToggle";
