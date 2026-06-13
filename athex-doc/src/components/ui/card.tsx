import * as React from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "feature" | "dark" | "code-window";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-[var(--spacing-xl)]",
      feature: "bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] p-[var(--spacing-xl)]",
      dark: "bg-[var(--color-surface-dark)] text-[var(--color-on-dark)] rounded-[var(--radius-lg)] p-[var(--spacing-xl)]",
      "code-window": "bg-[var(--color-surface-dark)] text-[var(--color-on-dark)] rounded-[var(--radius-lg)] p-[var(--spacing-lg)]"
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };