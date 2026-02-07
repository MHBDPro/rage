"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

// Optimized: CSS transitions instead of framer-motion
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div
          className={cn(
            "relative flex items-center overflow-hidden rounded-md border bg-secondary/50",
            "transition-all duration-200", // CSS transition for box-shadow and border
            error
              ? "border-destructive"
              : "border-border hover:border-primary/40 focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]"
          )}
        >
          {icon && (
            <div className="flex items-center justify-center pl-3 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-2",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-destructive animate-fade-in-up">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
