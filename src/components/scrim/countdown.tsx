"use client";

import * as React from "react";
import { cn, getIstanbulTargetDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface CountdownProps {
  targetTime: string; // Format: "HH:mm" (24-hour)
  onComplete?: () => void;
  className?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

// CSS-only flip card - no framer-motion overhead
function FlipCard({ value, label }: { value: number; label: string }) {
  const displayValue = value.toString().padStart(2, "0");

  // Label translations from config
  const labelTranslations: { [key: string]: string } = {
    "Hours": siteConfig.ui.countdown.hours,
    "Minutes": siteConfig.ui.countdown.minutes,
    "Seconds": siteConfig.ui.countdown.seconds
  };

  const translatedLabel = labelTranslations[label] || label;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div
          className="relative flex items-center justify-center rounded-lg border border-primary/30 bg-card px-4 py-3 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] md:px-6 md:py-4 transition-transform duration-200"
        >
          <span className="text-4xl font-bold font-[family-name:var(--font-rajdhani)] text-primary md:text-6xl tabular-nums">
            {displayValue}
          </span>
          {/* Reflection line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
        {/* Simplified glow effect - reduced blur radius */}
        <div className="absolute inset-0 -z-10 rounded-lg bg-primary/10 blur-lg" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground md:text-sm">
        {translatedLabel}
      </span>
    </div>
  );
}

export function Countdown({ targetTime, onComplete, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = React.useState(false);

  React.useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const now = new Date();
      const target = getIstanbulTargetDate(targetTime);

      // If target time has passed today, registration is open
      if (now >= target) {
        return null;
      }

      const diff = target.getTime() - now.getTime();

      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    if (!initialTimeLeft) {
      setIsExpired(true);
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft) {
        setIsExpired(true);
        onComplete?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime, onComplete]);

  if (isExpired || !timeLeft) {
    return null;
  }

  return (
    <div
      className={cn("flex flex-col items-center gap-6 animate-fade-in-up", className)}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider text-foreground md:text-3xl">
          {siteConfig.ui.countdown.title}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {siteConfig.ui.countdown.subtitle.replace("{time}", targetTime)}
        </p>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <FlipCard value={timeLeft.hours} label="Hours" />
        <span className="text-3xl font-bold text-primary/50 md:text-5xl">:</span>
        <FlipCard value={timeLeft.minutes} label="Minutes" />
        <span className="text-3xl font-bold text-primary/50 md:text-5xl">:</span>
        <FlipCard value={timeLeft.seconds} label="Seconds" />
      </div>

      {/* CSS-animated border effect */}
      <div className="relative mt-4 h-1 w-48 overflow-hidden rounded-full bg-primary/20">
        <div
          className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-primary to-cyan-500 animate-[countdown-slide_2s_linear_infinite]"
        />
      </div>
    </div>
  );
}
