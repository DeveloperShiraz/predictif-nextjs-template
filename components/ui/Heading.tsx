import { FC } from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const headingVariants = cva(
  "text-foreground lg:text-left leading-tight tracking-tighter",
  {
    variants: {
      size: {
        default: "text-4xl md:text-5xl lg:text-6xl font-extrabold",
        lg: "text-5xl md:text-6xl lg:text-7xl font-extrabold",
        sm: "text-2xl md:text-3xl lg:text-4xl font-extrabold",
        xsm: "text-lg md:text-xl lg:text-2xl font-normal",
        xxsm: "text-sm md:text-lg lg:text-lg font-normal",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof headingVariants> { }

const Heading: FC<HeadingProps> = ({ children, className, size, ...props }) => {
  return (
    <h1 {...props} className={cn(headingVariants({ size, className }))}>
      {children}
    </h1>
  );
};

Heading.displayName = "Heading";

export default Heading;
