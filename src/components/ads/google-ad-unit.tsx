"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface GoogleAdUnitProps {
  className?: string;
}

export function GoogleAdUnit({ className }: GoogleAdUnitProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn("AdSense init failed", error);
    }
  }, [client, slot]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6",
        "shadow-[0_0_40px_rgba(16,185,129,0.15)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-[60px]" />
        <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-yellow-500/10 blur-[50px]" />
      </div>

      <div className="relative z-10 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/40">
        <span>{siteConfig.ui.landing.adLabel}</span>
        <span>Google AdSense</span>
      </div>

      <div className="relative z-10 mt-4 rounded-xl border border-dashed border-white/20 bg-black/50 p-6 text-center">
        {client && slot ? (
          <ins
            className="adsbygoogle block"
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <p className="text-xs text-white/50">
            çok yakında
          </p>
        )}
      </div>
    </div>
  );
}
