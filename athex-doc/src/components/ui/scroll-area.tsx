import * as React from "react";
import { cn } from "@/utils/cn";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-auto",
          "[&::-webkit-scrollbar]:w-1.5",
          "[&::-webkit-scrollbar]:h-1.5",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-[#ececec]/30",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "hover:[&::-webkit-scrollbar-thumb]:bg-[#ececec]/60",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";