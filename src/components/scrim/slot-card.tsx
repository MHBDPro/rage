"use client";

import * as React from "react";
import { UserRound, Lock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Slot } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

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

  const occupant = slot?.playerName || slot?.teamName || siteConfig.ui.slots.filled;

  return (
    <button
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      className={cn(
        "group relative flex h-[180px] w-full flex-col overflow-hidden border transition-all duration-300",
        isAvailable && "cursor-pointer border-white/10 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/[0.08]",
        isTaken && "cursor-default border-red-500/20 bg-red-500/[0.08]",
        isSlotLocked && "cursor-not-allowed border-yellow-500/30 bg-yellow-500/[0.08]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs">
        <span className="font-mono text-white/50">#{slotNumber.toString().padStart(2, "0")}</span>
        <span
          className={cn(
            "inline-flex h-2 w-2 rounded-full",
            isAvailable && "bg-green-400",
            isTaken && "bg-red-400",
            isSlotLocked && "bg-yellow-400"
          )}
        />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
        <div className="absolute -right-1 top-2 text-6xl font-black text-white/[0.04]">
          {slotNumber}
        </div>

        {isSlotLocked ? (
          <Lock className="h-6 w-6 text-yellow-400/70" />
        ) : isTaken ? (
          <Trophy className="h-6 w-6 text-red-400/70" />
        ) : (
          <UserRound className="h-6 w-6 text-primary/80" />
        )}

        <div className="text-sm font-semibold uppercase tracking-wide text-white">
          {isSlotLocked
            ? siteConfig.ui.slots.locked
            : isTaken
            ? occupant
            : siteConfig.ui.slots.open}
        </div>

        <div className="text-[10px] uppercase tracking-[0.22em] text-white/45">
          {isSlotLocked
            ? siteConfig.ui.slots.restricted
            : isTaken
            ? siteConfig.ui.slots.registered
            : siteConfig.ui.slots.clickToJoin}
        </div>
      </div>
    </button>
  );
});
