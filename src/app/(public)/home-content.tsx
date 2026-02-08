"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Trophy, Clock3, ArrowRight, ShieldCheck } from "lucide-react";
import { GoogleAdUnit } from "@/components/ads/google-ad-unit";
import { ActiveScrimsCarousel } from "@/components/scrim/active-scrims-carousel";
import { SponsorMarquee } from "@/components/sponsors/sponsor-marquee";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScrimSession, Sponsor } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

interface HomeContentProps {
  upcomingSessions: ScrimSession[];
  fastCupSessions: ScrimSession[];
  champion: {
    teamName: string;
    points: number;
    leaderboardTitle: string;
  } | null;
  isMaintenance: boolean;
  announcement: string | null;
  sponsors: Sponsor[];
}

function formatDate(value: Date) {
  return value.toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HomeContent({
  upcomingSessions,
  fastCupSessions,
  champion,
  isMaintenance,
  announcement,
  sponsors,
}: HomeContentProps) {
  const hasChampion = !!champion?.teamName;
  const leagues = ["UCL", "UEL", "UKL"];
  const nextSession = upcomingSessions[0] ?? null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_84%_10%,rgba(249,115,22,0.22),transparent_32%),linear-gradient(180deg,#071018_0%,#06101a_46%,#050b14_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.14),transparent_58%)] opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-[10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-accent/30 opacity-40 blur-2xl" />
      <div className="pointer-events-none absolute left-1/2 top-[14%] h-[400px] w-[400px] -translate-x-1/2 rounded-full border border-primary/30 opacity-45 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-56 w-[88%] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />

      <section className="relative px-4 pb-20 pt-4 md:pb-28 md:pt-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-7"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                  {siteConfig.ui.landing.heroEyebrow}
                </span>
              </div>

              <div>
                <h1 className="text-5xl font-black font-[family-name:var(--font-rajdhani)] uppercase leading-[0.92] tracking-tight text-white md:text-7xl">
                  Rage
                  <span className="block bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">
                    Federasyonu
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {siteConfig.ui.landing.heroSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {leagues.map((league) => (
                  <span
                    key={league}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white/80"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {league}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/scrims">
                  <Button size="lg" className="h-14 px-7 text-base">
                    {siteConfig.ui.landing.viewScrims}
                  </Button>
                </Link>
                <Link href="/fast-cup">
                  <Button variant="outline" size="lg" className="h-14 px-7 text-base border-primary/30">
                    <Zap className="mr-2 h-4 w-4" />
                    {siteConfig.ui.landing.fastCupAction}
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Card variant="glass" className="border-white/10 bg-black/30 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Sıradaki Turnuva</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {nextSession ? formatDate(new Date(nextSession.startTime)) : "Planlama Bekleniyor"}
                  </p>
                </Card>
                <Card variant="glass" className="border-white/10 bg-black/30 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Resmi Ligler</p>
                  <p className="mt-1 text-sm font-semibold text-white">UCL • UEL • UKL</p>
                </Card>
                <Card variant="glass" className="border-white/10 bg-black/30 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Kontenjan Formatı</p>
                  <p className="mt-1 text-sm font-semibold text-white">{siteConfig.platform.totalSlots} Oyuncu</p>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card variant="glass" className="relative overflow-hidden border-white/15 bg-gradient-to-b from-black/45 to-black/20 p-8">
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

                <div className="relative mx-auto h-60 w-60">
                  <div className="absolute inset-0 rounded-full border border-accent/55 shadow-[0_0_55px_rgba(249,115,22,0.24)]" />
                  <div className="absolute inset-[18px] rounded-full border border-primary/60 shadow-[0_0_55px_rgba(16,185,129,0.25)]" />
                  <div className="absolute inset-[32px] overflow-hidden rounded-full border border-white/10 bg-black/45">
                    <Image
                      src="/logo.jpg"
                      alt="Rage Federasyonu logosu"
                      fill
                      className="object-cover"
                      sizes="240px"
                      priority
                    />
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/35 p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/50">
                    {siteConfig.ui.landing.championLabel}
                  </span>

                  {hasChampion ? (
                    <div className="mt-3 space-y-1.5">
                      <h2 className="text-3xl font-black font-[family-name:var(--font-rajdhani)] uppercase tracking-wide text-white">
                        {champion?.teamName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {champion?.leaderboardTitle} • {champion?.points} Puan
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-1.5">
                      <h2 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-white/75">
                        {siteConfig.ui.landing.championFallbackTitle}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {siteConfig.ui.landing.championFallbackSubtitle}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <SponsorMarquee sponsors={sponsors} />

      <div className="mx-auto mt-16 max-w-7xl space-y-14 px-4">
        {isMaintenance && (
          <Card variant="default" className="border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300">
            Bakım modu aktif. Kayıtlar geçici olarak kapalıdır.
          </Card>
        )}

        {announcement && !isMaintenance && (
          <Card variant="default" className="border-primary/30 bg-primary/10 p-4 text-primary">
            {announcement}
          </Card>
        )}

        <div>
          <h2 className="mb-5 text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-white">
            {siteConfig.ui.landing.fastCupTitle}
          </h2>
          <p className="mb-6 text-muted-foreground">{siteConfig.ui.landing.fastCupSubtitle}</p>

          {fastCupSessions.length === 0 ? (
            <Card variant="glass" className="p-6 text-sm text-muted-foreground">
              Şu anda planlanan Fast Cup yok.
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {fastCupSessions.slice(0, 3).map((session) => (
                <Card key={session.id} variant="glass" className="border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="warning">Fast Cup</Badge>
                    <span className="text-xs text-muted-foreground">{session.mode}</span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-white">
                    {session.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    <Clock3 className="mr-1 inline h-4 w-4" />
                    {formatDate(new Date(session.startTime))}
                  </p>

                  <Link href={`/scrims/${session.slug}`} className="mt-5 inline-flex items-center text-sm font-semibold text-primary">
                    Hemen Katıl
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-white">
                {siteConfig.ui.landing.activeScrimsTitle}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {siteConfig.ui.landing.activeScrimsSubtitle}
              </p>
            </div>
            <Trophy className="hidden h-8 w-8 text-primary/60 md:block" />
          </div>

          <ActiveScrimsCarousel sessions={upcomingSessions} />
        </div>

        <GoogleAdUnit />
      </div>
    </div>
  );
}
