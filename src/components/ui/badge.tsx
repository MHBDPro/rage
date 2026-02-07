import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border border-primary/30 bg-primary/10 text-primary",
        secondary:
          "border border-border bg-secondary text-secondary-foreground",
        success:
          "border border-green-500/30 bg-green-500/10 text-green-500",
        destructive:
          "border border-destructive/30 bg-destructive/10 text-destructive",
        warning:
          "border border-amber-500/30 bg-amber-500/10 text-amber-500",
        gold:
          "border border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
        outline:
          "border border-border text-foreground",
        available:
          "border border-green-500/50 bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
        taken:
          "border border-red-500/50 bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
        locked:
          "border border-yellow-500/50 bg-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
