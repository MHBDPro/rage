"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] clip-cut-corner",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-[0_0_20px_rgba(239,68,68,0.4)] clip-cut-corner",
        outline:
          "border border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary clip-cut-corner",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 clip-cut-corner",
        ghost:
          "bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md", // Ghost stays standard
        link:
          "text-primary underline-offset-4 hover:underline rounded-md", // Link stays standard
        gold:
          "bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:brightness-110 shadow-[0_0_20px_rgba(251,191,36,0.4)] clip-cut-corner",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10 !p-0 clip-cut-corner",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  children?: React.ReactNode;
  scrambleHover?: boolean; // New prop to enable/disable text scramble
}

// Scramble text effect helper
const useScrambleText = (text: string, active: boolean) => {
  const [displayText, setDisplayText] = React.useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  React.useEffect(() => {
    if (!active || typeof text !== 'string') return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [active, text]);

  // Reset when not active
  React.useEffect(() => {
    if (!active) setDisplayText(text);
  }, [active, text]);

  return displayText;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, scrambleHover = true, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const textChild = typeof children === "string" ? children : "";
    const shouldScramble = scrambleHover && textChild.length > 0 && !isLoading;
    const scrambledText = useScrambleText(textChild, isHovered && shouldScramble);
    const displayedText = shouldScramble ? scrambledText : children;

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        {...props}
      >
        {/* Background Scan Effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[scan_1s_ease-in-out_infinite]" />

        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <span className="relative z-10 flex items-center gap-2">
          {displayedText}
        </span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
