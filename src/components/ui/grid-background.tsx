"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

export function GridBackground({
  className,
  animated = false,
  children,
}: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        animated ? "grid-bg-animated" : "grid-bg",
        className
      )}
    >
      {/* Static Gradient Mesh Background - Reduced blur radii for GPU optimization */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-primary/10 blur-[60px]" />
        <div className="absolute right-1/4 top-1/3 h-[280px] w-[280px] rounded-full bg-cyan-500/8 blur-[50px]" />
      </div>

      {/* Floating Orbs - Desktop only, reduced blur */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div
          className="absolute left-[10%] top-[15%] h-24 w-24 rounded-full bg-gradient-to-br from-primary/15 to-cyan-500/8 blur-lg animate-float will-change-transform"
        />
        <div
          className="absolute right-[15%] top-[25%] h-20 w-20 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/8 blur-lg animate-float-delayed will-change-transform"
        />
        <div
          className="absolute bottom-[20%] left-[20%] h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500/15 to-primary/8 blur-md animate-float-slow will-change-transform"
        />
      </div>

      {/* Particles - Reduced from 10 to 4 */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <div className="absolute left-[15%] top-[20%] h-1 w-1 rounded-full bg-primary/60 animate-particle-1 will-change-transform" />
        <div className="absolute left-[45%] top-[60%] h-1.5 w-1.5 rounded-full bg-cyan-400/50 animate-particle-2 will-change-transform" />
        <div className="absolute left-[70%] top-[30%] h-1 w-1 rounded-full bg-purple-400/60 animate-particle-3 will-change-transform" />
        <div className="absolute left-[85%] top-[70%] h-1 w-1 rounded-full bg-primary/50 animate-particle-4 will-change-transform" />
      </div>

      {/* Scan Line Effect - Desktop only when animated */}
      {animated && (
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
          <div className="absolute left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-scan will-change-transform" />
        </div>
      )}

      {/* Circuit Lines - Simplified to 2 lines, desktop only */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-0 top-[20%] h-[1px] w-1/3 bg-gradient-to-r from-primary/20 via-primary/40 to-transparent animate-circuit-glow" />
        <div className="absolute right-0 bottom-[15%] h-[1px] w-1/4 bg-gradient-to-l from-cyan-500/20 via-cyan-500/40 to-transparent animate-circuit-glow-delayed" />
      </div>

      {/* Gradient overlays for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Vignette effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,4,11,0.4)_70%,rgba(3,4,11,0.8)_100%)]" />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
