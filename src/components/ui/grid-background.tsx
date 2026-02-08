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
        "relative min-h-screen w-full overflow-hidden bg-[#071018] [contain:layout_paint_style]",
        animated ? "grid-bg-animated" : "grid-bg",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.1),transparent_42%),radial-gradient(circle_at_16%_10%,rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_84%_10%,rgba(249,115,22,0.16),transparent_36%),linear-gradient(180deg,#071018_0%,#07111a_46%,#050b14_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(16,185,129,0.1)_0%,rgba(249,115,22,0.08)_50%,transparent_100%)]" />
        <div className="absolute left-1/2 top-[-26%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_220deg,rgba(249,115,22,0.18),rgba(16,185,129,0.12),rgba(249,115,22,0.16))] blur-2xl" />
        <div className="absolute left-1/2 top-[16%] h-[440px] w-[440px] -translate-x-1/2 rounded-full border border-accent/35 shadow-[0_0_60px_rgba(249,115,22,0.16)]" />
        <div className="absolute left-1/2 top-[20%] h-[340px] w-[340px] -translate-x-1/2 rounded-full border border-primary/35 shadow-[0_0_60px_rgba(16,185,129,0.18)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-[10%] top-[18%] h-28 w-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl animate-float" />
        <div className="absolute right-[14%] top-[24%] h-28 w-28 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 blur-xl animate-float-delayed" />
        <div className="absolute bottom-[16%] left-[20%] hidden h-20 w-20 rounded-full bg-gradient-to-br from-primary/16 to-primary/5 blur-xl animate-float-slow lg:block" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[44%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_68%)] opacity-45" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.14),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-x-[8%] bottom-[10%] h-[220px] rounded-[100%] border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]" />

      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute inset-x-0 top-[18%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-[26%] h-[1px] bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
      </div>

      {animated && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[19%] h-[380px] w-[380px] -translate-x-1/2 rounded-full border border-primary/25 animate-pulse [animation-duration:2.8s]" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,6,11,0.44)_72%,rgba(2,4,8,0.86)_100%)]" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
