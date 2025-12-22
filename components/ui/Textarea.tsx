import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "underlined";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex w-full bg-transparent text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-0",
          variant === "default"
            ? "min-h-[80px] rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 focus:border-blue-600 dark:focus:border-white transition-all duration-300"
            : "min-h-[60px] px-0 py-1 border-0 border-b border-zinc-200 dark:border-zinc-700 focus:border-b focus:border-blue-600 dark:focus:border-white transition-colors duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
