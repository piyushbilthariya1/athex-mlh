import * as React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "secondary-on-dark" | "text-link" | "icon-circular" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap font-sans text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:pointer-events-none disabled:bg-[var(--color-primary-disabled)] disabled:text-[var(--color-muted)]";
    
    const variants = {
      primary: "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-active)] px-5 h-10 rounded-[var(--radius-md)]",
      secondary: "bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)] hover:bg-[var(--color-surface-soft)] px-5 h-10 rounded-[var(--radius-md)]",
      "secondary-on-dark": "bg-[var(--color-surface-dark-elevated)] text-[var(--color-on-dark)] border border-transparent hover:brightness-110 px-5 h-10 rounded-[var(--radius-md)]",
      "text-link": "bg-transparent text-[var(--color-ink)] hover:underline px-0 h-auto",
      "icon-circular": "bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)] hover:bg-[var(--color-surface-soft)] w-[36px] h-[36px] rounded-full p-0 flex items-center justify-center",
      ghost: "bg-transparent"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };