"use client";

import * as React from "react";
import { SlotCard } from "./slot-card";
import type { Slot } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

interface SlotGridProps {
  slots: (Slot | null)[];
  isLocked?: boolean;
  onSlotClick?: (slotNumber: number) => void;
  adAfterSlot?: number;
  renderAd?: () => React.ReactNode;
}

export function SlotGrid({
  slots,
  isLocked = false,
  onSlotClick,
  adAfterSlot,
  renderAd,
}: SlotGridProps) {
  const totalSlots = siteConfig.platform.totalSlots;

  const allSlots = React.useMemo(() => {
    const slotMap = new Map<number, Slot>();
    slots.forEach((slot) => {
      if (slot) {
        slotMap.set(slot.slotNumber, slot);
      }
    });
    return Array.from({ length: totalSlots }, (_, i) => ({
      slotNumber: i + 1,
      slot: slotMap.get(i + 1) || null,
    }));
  }, [slots, totalSlots]);

  return (
    <div className="w-full">
      {/* HUD Header */}
      <div className="mb-6 flex items-center justify-between border-b border-primary/20 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-primary animate-pulse" />
          <span className="font-[family-name:var(--font-rajdhani)] text-sm font-bold uppercase tracking-widest text-primary">
            SECTOR STATUS: LIVE
          </span>
        </div>
        <div className="font-mono text-xs text-primary/60">
          GRID_ID: ALPHA-01
        </div>
      </div>

      {/* The Grid: No gaps, borders created by background color showing through */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl">
        <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {allSlots.map(({ slotNumber, slot }) => (
            <React.Fragment key={`slot - ${slotNumber} `}>
              <div className="relative">
                <SlotCard
                  slotNumber={slotNumber}
                  slot={slot}
                  isLocked={isLocked}
                  onClick={() => onSlotClick?.(slotNumber)}
                  className="rounded-none border-none h-[160px]" // Reset card styles for grid
                />
              </div>

              {/* Ad Injection Logic (Optional) */}
              {adAfterSlot && renderAd && slotNumber === adAfterSlot && (
                <div className="col-span-full border-t border-white/10 bg-black/40 p-4">
                  {renderAd()}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* HUD Footer */}
      <div className="mt-2 flex justify-end">
        <div className="flex gap-1">
          <div className="h-1 w-8 bg-primary/20" />
          <div className="h-1 w-4 bg-primary/40" />
          <div className="h-1 w-2 bg-primary/60" />
        </div>
      </div>
    </div>
  );
}
