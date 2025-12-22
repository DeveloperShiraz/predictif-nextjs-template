"use client";

import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Add this CSS to your globals.css
// .animate-underline {
//   position: relative;
// }
//
// .animate-underline::after {
//   content: '';
//   position: absolute;
//   width: 0;
//   height: 2px;
//   bottom: 0;
//   left: 50%;
//   background-color: #000;
//   transition: all 0.3s ease-in-out;
//   transform: translateX(-50%);
// }
//
// .animate-underline:focus::after {
//   width: 100%;
// }
//
// .dark .animate-underline::after {
//   background-color: #fff;
// }

export const inputVariants = cva(
  "flex w-full bg-transparent text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-0 border-0",
  {
    variants: {
      variant: {
        default:
          "h-9 rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-1 focus:border-blue-600 dark:focus:border-white transition-all duration-300",

        underlined: `h-8 px-0 py-1 
          border-b border-zinc-200 dark:border-zinc-700
          focus:border-b border-b-[1px] focus:border-blue-600 dark:focus:border-white
          transition-colors duration-300`,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
