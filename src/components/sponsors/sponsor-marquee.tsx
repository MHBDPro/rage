"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Sponsor } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

interface SponsorMarqueeProps {
  sponsors: Sponsor[];
}

export function SponsorMarquee({ sponsors }: SponsorMarqueeProps) {
  // Duplicate list for seamless loop
  const marqueeSponsors = React.useMemo(
    () => [...sponsors, ...sponsors, ...sponsors, ...sponsors],
    [sponsors]
  );

  if (sponsors.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden py-12 border-y border-white/5 bg-black/40 backdrop-blur-sm">
      {/* Label Overlay */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-background via-background/80 to-transparent px-4 md:px-8">
        <span className="font-[family-name:var(--font-rajdhani)] text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/50 rotate-180 py-2 [writing-mode:vertical-lr]">
          {siteConfig.ui.landing.adLabel}
        </span>
      </div>

      {/* Right Fade */}
      <div className="absolute right-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      {/* Infinite Scroll Track */}
      <div className="flex w-full">
        <div className="flex min-w-full animate-marquee items-center gap-12 md:gap-24 pl-12">
          {marqueeSponsors.map((sponsor, index) => (
            <Link
              key={`${sponsor.id}-${index}`}
              href={sponsor.websiteUrl || "#"}
              target={sponsor.websiteUrl ? "_blank" : undefined}
              className="group relative flex-shrink-0 transition-transform hover:scale-110"
            >
              <div className="relative h-12 w-32 md:h-14 md:w-40 opacity-40 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0">
                <Image
                  src={sponsor.logoUrl}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                  sizes="160px"
                />
                {/* Logo Glow on Hover */}
                <div className="absolute inset-0 -z-10 bg-primary/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* View All Button - Integrated nicely */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block z-20">
        <Link
          href="/sponsors"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 transition-colors hover:text-primary"
        >
          {siteConfig.ui.sponsors?.viewAll} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
