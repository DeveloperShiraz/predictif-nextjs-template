import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FlexBetweenProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const FlexBetween = ({ className, children, ...props }: FlexBetweenProps) => {
  return (
    <div
      className={cn("flex justify-between items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default FlexBetween;
