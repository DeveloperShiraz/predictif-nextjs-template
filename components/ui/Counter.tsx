"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const Counter: React.FC = () => {
  const [counter, setCounter] = useState<number>(1);
  const { theme } = useTheme();

  const handleIncrement = () => {
    setCounter((prevCounter) => prevCounter + 1);
  };

  const handleDecrement = () => {
    setCounter((prevCounter) => prevCounter - 1);
  };

  const displayCounter = counter > 0;
  const isDark = theme === "dark";

  return (
    <div className="flex items-center">
      <div
        className={cn(
          "flex rounded-md overflow-hidden border",
          isDark ? "border-gray-600 bg-[#0067b0]" : "border-gray-200 bg-white"
        )}
      >
        <button
          onClick={handleIncrement}
          className={cn(
            "px-3 py-1 text-sm font-medium transition-colors",
            isDark ? "text-black hover:bg-white/10" : "text-blue-600 hover:bg-gray-100",
            "border-r",
            isDark ? "border-gray-600" : "border-gray-200"
          )}
        >
          +
        </button>

        {displayCounter && (
          <div
            className={cn(
              "px-3 py-1 text-sm font-medium flex items-center justify-center",
              isDark ? "text-white" : "text-black",
              "border-r",
              isDark ? "border-gray-600" : "border-gray-200"
            )}
          >
            {counter}
          </div>
        )}

        {displayCounter && (
          <button
            onClick={handleDecrement}
            className={cn(
              "px-3 py-1 text-sm font-medium transition-colors",
              isDark ? "text-black hover:bg-white/10" : "text-blue-600 hover:bg-gray-100"
            )}
          >
            -
          </button>
        )}
      </div>
    </div>
  );
};

export default Counter;
