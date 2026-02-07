"use client";

import * as React from "react";
import { User, Lock, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Slot } from "@/lib/db/schema";

interface SlotCardProps {
  slotNumber: number;
  slot: Slot | null;
  isLocked?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SlotCard = React.memo(function SlotCard({
  slotNumber,
  slot,
  isLocked = false,
  onClick,
  className,
}: SlotCardProps) {
  const isSlotLocked = isLocked || !!slot?.isLocked;
  const isTaken = !!slot && !slot.isLocked;
  const isAvailable = !isTaken && !isSlotLocked;

  return (
    <button
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      className={cn(
        "group relative flex h-[180px] w-full flex-col overflow-hidden transition-all duration-300",
        "bg-[#0a0b14] border border-white/5",
        // Hover Effects
        isAvailable && "hover:bg-[#0f111a] hover:border-primary/50 cursor-pointer",
        isTaken && "bg-red-950/5 border-red-900/20 cursor-default",
        isSlotLocked && "bg-yellow-950/5 border-yellow-900/20 cursor-not-allowed",
        className
      )}
    >
      {/* 1. Background Big Number */}
      <div className={cn(
        "absolute right-2 top-0 text-[8rem] font-black leading-none font-[family-name:var(--font-rajdhani)] opacity-[0.03] select-none pointer-events-none transition-all duration-500",
        "group-hover:opacity-[0.06] group-hover:scale-110",
        isAvailable && "text-primary",
        isTaken && "text-red-500",
        isSlotLocked && "text-yellow-500"
      )}>
        {slotNumber}
      </div>

      {/* 2. Top Status Bar */}
      <div className="flex w-full items-center justify-between border-b border-white/5 bg-black/20 px-4 py-2 backdrop-blur-sm">
        <span className="font-mono text-xs font-bold text-white/30">
          SLOT-{slotNumber.toString().padStart(2, "0")}
        </span>
        <div className={cn(
          "h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]",
          isAvailable ? "bg-primary text-primary animate-pulse" :
            isTaken ? "bg-red-500 text-red-500" :
              "bg-yellow-500 text-yellow-500"
        )} />
      </div>

      {/* 3. Main Content */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-4 z-10">
        {/* Icon Layer */}
        <div className="mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          {isSlotLocked ? (
            <Lock className="h-6 w-6 text-yellow-500/50" />
          ) : isTaken ? (
            <Crosshair className="h-6 w-6 text-red-500/50" />
          ) : (
            <User className="h-6 w-6 text-primary/50 group-hover:text-primary group-hover:drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
          )}
        </div>

        {/* Text Layer */}
        <div className="text-center">
          <div className={cn(
            "text-lg font-bold uppercase tracking-wider font-[family-name:var(--font-rajdhani)]",
            isAvailable ? "text-white group-hover:text-primary transition-colors" : "text-white/60"
          )}>
            {isSlotLocked ? "RESTRICTED" : isTaken ? (slot?.teamName || "TAKEN") : "OPEN SLOT"}
          </div>

          {/* Subtext */}
          <div className="mt-1 text-[10px] font-medium tracking-[0.2em] uppercase text-white/30">
            {isSlotLocked ? "ACCESS DENIED" : isTaken ? "DEPLOYED" : "READY TO JOIN"}
          </div>
        </div>
      </div>

      {/* 4. Active Corner Accents (Only on Available) */}
      {isAvailable && (
        <>
          <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-primary/0 transition-all duration-300 group-hover:border-primary/60" />
          <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-primary/0 transition-all duration-300 group-hover:border-primary/60" />
        </>
      )}

      {/* 5. Locked Tape Effect */}
      {isSlotLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[150%] -rotate-12 bg-yellow-500/10 py-1 text-center border-y border-yellow-500/20">
            <div className="text-[10px] font-bold text-yellow-500/40 tracking-[1em] whitespace-nowrap animate-marquee">
              LOCKED // LOCKED // LOCKED // LOCKED // LOCKED // LOCKED
            </div>
          </div>
        </div>
      )}
    </button>
  );
});
