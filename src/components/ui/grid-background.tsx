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
        "relative min-h-screen w-full overflow-hidden bg-[#071018]",
        animated ? "grid-bg-animated" : "grid-bg",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_16%_10%,rgba(16,185,129,0.2),transparent_34%),radial-gradient(circle_at_84%_10%,rgba(249,115,22,0.2),transparent_34%),linear-gradient(180deg,#071018_0%,#07111a_42%,#050b14_100%)]" />
        <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(16,185,129,0.12)_0%,rgba(249,115,22,0.1)_48%,transparent_100%)]" />
        <div className="absolute left-1/2 top-[-28%] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_220deg,rgba(249,115,22,0.25),rgba(16,185,129,0.16),rgba(249,115,22,0.2))] blur-3xl" />
        <div className="absolute left-1/2 top-[16%] h-[460px] w-[460px] -translate-x-1/2 rounded-full border border-accent/45 shadow-[0_0_90px_rgba(249,115,22,0.2)]" />
        <div className="absolute left-1/2 top-[20%] h-[360px] w-[360px] -translate-x-1/2 rounded-full border border-primary/45 shadow-[0_0_90px_rgba(16,185,129,0.22)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div
          className="absolute left-[10%] top-[18%] h-32 w-32 rounded-full bg-gradient-to-br from-primary/24 to-primary/5 blur-2xl animate-float will-change-transform"
        />
        <div
          className="absolute right-[14%] top-[24%] h-32 w-32 rounded-full bg-gradient-to-br from-accent/24 to-accent/5 blur-2xl animate-float-delayed will-change-transform"
        />
        <div
          className="absolute bottom-[16%] left-[20%] h-20 w-20 rounded-full bg-gradient-to-br from-primary/18 to-primary/5 blur-xl animate-float-slow will-change-transform"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.16),transparent_66%)] opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-[8%] bottom-[10%] h-[220px] rounded-[100%] border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]" />

      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute inset-x-0 top-[18%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-[26%] h-[1px] bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
      </div>

      {animated && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[20%] h-[360px] w-[360px] -translate-x-1/2 rounded-full border border-primary/30 animate-pulse" />
          <div className="absolute left-1/2 top-[16%] h-[460px] w-[460px] -translate-x-1/2 rounded-full border border-accent/20 animate-pulse [animation-delay:350ms]" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,6,11,0.48)_72%,rgba(2,4,8,0.9)_100%)]" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
