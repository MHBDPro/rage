"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Zap, Megaphone } from "lucide-react";
import { GoogleAdUnit } from "@/components/ads/google-ad-unit";
import { ActiveScrimsCarousel } from "@/components/scrim/active-scrims-carousel";
import { SponsorMarquee } from "@/components/sponsors/sponsor-marquee";
import { Button } from "@/components/ui/button";
import type { ScrimSession, Sponsor } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

interface HomeContentProps {
  sessions: ScrimSession[];
  champion: {
    teamName: string;
    points: number;
    leaderboardTitle: string;
  } | null;
  isMaintenance: boolean;
  announcement: string | null;
  sponsors: Sponsor[];
}

export function HomeContent({
  sessions,
  champion,
  isMaintenance,
  announcement,
  sponsors,
}: HomeContentProps) {
  const hasChampion = !!champion?.teamName;

  // Champion Confetti Effect
  React.useEffect(() => {
    if (!hasChampion) return;
    const fire = async () => {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.15 }, // Higher origin
        colors: ["#00ff9d", "#ccff00", "#ffffff"], // Neon palette
        disableForReducedMotion: true,
      });
    };
    fire();
  }, [hasChampion]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden pb-20">

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen opacity-40" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 md:pt-24 md:pb-32 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">

            {/* LEFT: Typography & Actions */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-primary/50" />
                <span className="font-[family-name:var(--font-rajdhani)] text-sm font-bold uppercase tracking-[0.3em] text-primary">
                  {siteConfig.ui.landing.heroEyebrow}
                </span>
              </div>

              {/* Massive Glitch Title */}
              <h1 className="text-6xl md:text-8xl font-black font-[family-name:var(--font-rajdhani)] uppercase leading-[0.9] tracking-tighter text-white mb-8">
                <span className="block text-glitch" data-text={siteConfig.ui.landing.heroTitle.split(" ")[0]}>
                  {siteConfig.ui.landing.heroTitle.split(" ")[0]}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                  {siteConfig.ui.landing.heroTitle.split(" ").slice(1).join(" ")}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed border-l-2 border-primary/20 pl-6">
                {siteConfig.ui.landing.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/scrims">
                  <Button size="lg" className="h-16 px-8 text-lg clip-cut-corner bg-primary text-black hover:bg-white hover:text-black transition-colors duration-300">
                    <Zap className="mr-2 h-5 w-5 fill-current" />
                    {siteConfig.ui.landing.viewScrims}
                  </Button>
                </Link>
                <Link href="/rules">
                  <Button variant="outline" size="lg" className="h-16 px-8 text-lg border-white/20 text-white hover:bg-white/5">
                    {siteConfig.ui.nav.rules}
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* RIGHT: Floating 3D Card (Champion) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block perspective-1000"
            >
              {/* Floating Animation Wrapper */}
              <div className="animate-[float_6s_ease-in-out_infinite] preserve-3d">
                <div className="relative w-full aspect-[4/5] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)] group">

                  {/* Decorative Grid on Card */}
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                      <Trophy className="relative h-24 w-24 text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/40">
                        {siteConfig.ui.landing.championLabel}
                      </span>
                      {hasChampion ? (
                        <>
                          <h2 className="text-4xl font-black font-[family-name:var(--font-rajdhani)] uppercase text-white tracking-wide">
                            {champion?.teamName}
                          </h2>
                          <p className="text-sm font-mono text-primary/80">
                            {champion?.leaderboardTitle} {"//"} WINNER
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-white/50">
                            {siteConfig.ui.landing.championFallbackTitle}
                          </h2>
                          <p className="text-xs text-white/30 max-w-[200px] mx-auto mt-2">
                            {siteConfig.ui.landing.championFallbackSubtitle}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-4 left-4 h-4 w-4 border-l-2 border-t-2 border-primary/50" />
                  <div className="absolute bottom-4 right-4 h-4 w-4 border-r-2 border-b-2 border-primary/50" />
                </div>
              </div>

              {/* Floor Reflection/Shadow */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/50 blur-xl rounded-[100%]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <SponsorMarquee sponsors={sponsors} />

      {/* MAIN CONTENT AREA */}
      <div className="mx-auto max-w-7xl px-4 mt-20">

        {/* Maintenance / Announcement Banners (Using new design) */}
        <div className="space-y-4 mb-12">
          {isMaintenance && (
            <div className="flex items-center gap-4 border border-yellow-500/30 bg-yellow-500/5 p-4 rounded-lg animate-pulse">
              <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_10px_orange]" />
              <p className="font-mono text-sm text-yellow-500 uppercase tracking-widest">
                System Status: Maintenance Mode Active
              </p>
            </div>
          )}

          {announcement && !isMaintenance && (
            <div className="relative overflow-hidden rounded-lg border-l-4 border-primary bg-[#0f111a] p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <Megaphone className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary/50 mb-1">System Broadcast</h3>
                  <p className="text-white font-medium">{announcement}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ad Unit */}
        <div className="mb-20">
          <GoogleAdUnit />
        </div>

        {/* Active Scrims Section */}
        <div id="scrims" className="relative">
          <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-white">
                <span className="text-primary mr-2">{"//"}</span>
                {siteConfig.ui.landing.activeScrimsTitle}
              </h2>
            </div>
            <div className="hidden md:flex gap-2">
              <div className="h-2 w-2 bg-primary animate-pulse" />
              <div className="h-2 w-2 bg-primary/50" />
              <div className="h-2 w-2 bg-primary/20" />
            </div>
          </div>

          <ActiveScrimsCarousel sessions={sessions} />
        </div>
      </div>
    </div>
  );
}
