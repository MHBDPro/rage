"use client";

import * as React from "react";
import { SlotCard } from "./slot-card";
import type { Slot } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

interface SlotGridProps {
  slots: (Slot | null)[];
  isLocked?: boolean;
  totalSlots?: number;
  onSlotClick?: (slotNumber: number) => void;
  adAfterSlot?: number;
  renderAd?: () => React.ReactNode;
}

export function SlotGrid({
  slots,
  isLocked = false,
  totalSlots,
  onSlotClick,
  adAfterSlot,
  renderAd,
}: SlotGridProps) {
  const maxSlots = totalSlots ?? siteConfig.platform.totalSlots;

  const allSlots = React.useMemo(() => {
    const slotMap = new Map<number, Slot>();
    slots.forEach((slot) => {
      if (slot) {
        slotMap.set(slot.slotNumber, slot);
      }
    });

    return Array.from({ length: maxSlots }, (_, i) => ({
      slotNumber: i + 1,
      slot: slotMap.get(i + 1) || null,
    }));
  }, [slots, maxSlots]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between border-b border-primary/20 pb-2">
        <span className="font-[family-name:var(--font-rajdhani)] text-sm font-bold uppercase tracking-widest text-primary">
          {siteConfig.ui.slots.slotRegistration}
        </span>
        <span className="text-xs text-muted-foreground">
          {siteConfig.ui.slots.total}: {maxSlots}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl">
        <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {allSlots.map(({ slotNumber, slot }) => (
            <React.Fragment key={`slot-${slotNumber}`}>
              <div className="relative">
                <SlotCard
                  slotNumber={slotNumber}
                  slot={slot}
                  isLocked={isLocked}
                  onClick={() => onSlotClick?.(slotNumber)}
                  className="h-[160px] rounded-none border-none"
                />
              </div>

              {adAfterSlot && renderAd && slotNumber === adAfterSlot && (
                <div className="col-span-full border-t border-white/10 bg-black/30 p-4">
                  {renderAd()}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
