"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// FIX: Omit children from HTMLMotionProps and redefine it as ReactNode
// This resolves the "Type 'MotionValueNumber' is not assignable to type 'ReactNode'" error
interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "default" | "glass" | "elevated" | "glow" | "tactical";
  hoverEffect?: boolean;
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hoverEffect = false, children, ...props }, ref) => {
    const divRef = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = React.useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current || variant !== "tactical") return;

      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    // Merge internal ref with external ref
    React.useImperativeHandle(ref, () => divRef.current as HTMLDivElement);

    const variants = {
      default: "bg-card border border-border/50",
      glass: "glass-panel",
      elevated: "bg-secondary border border-border shadow-xl",
      glow: "bg-card/80 border border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]",
      tactical: "bg-black/40 border border-white/5 relative overflow-hidden",
    };

    return (
      <motion.div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "rounded-xl p-6",
          variants[variant],
          hoverEffect && variant !== "tactical" && "transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-1",
          className
        )}
        initial={hoverEffect ? { y: 0 } : undefined}
        {...props}
      >
        {/* Spotlight Effect for Tactical Variant */}
        {variant === "tactical" && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300"
            style={{
              opacity,
              background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--primary-rgb), 0.15), transparent 40%)`,
            }}
          />
        )}

        {/* Border Spotlight */}
        {variant === "tactical" && (
          <div
            className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
            style={{
              opacity,
              background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--primary-rgb), 0.4), transparent 40%)`,
              maskImage: "linear-gradient(black, black), content-box",
              maskComposite: "exclude",
              // Webkit prefix for compatibility
              WebkitMaskImage: "linear-gradient(black, black), content-box",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
          />
        )}

        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight font-[family-name:var(--font-rajdhani)] uppercase text-white drop-shadow-md",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };