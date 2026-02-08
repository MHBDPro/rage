import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Trophy, Shield, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getScrimSessionsIndex } from "@/lib/actions/scrim";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${siteConfig.content.scrimTermPlural} | ${siteConfig.brand.fullName}`,
  description: `${siteConfig.brand.name} ${siteConfig.content.scrimTermPlural} listesini görüntüleyin ve katılmak istediğiniz oturumu seçin.`,
};

const statusBadge = {
  active: { variant: "success" as const, label: siteConfig.ui.landing.statusActive },
  closed: { variant: "warning" as const, label: siteConfig.ui.landing.statusClosed },
  completed: { variant: "secondary" as const, label: siteConfig.ui.landing.statusCompleted },
};

function getLeagueLabel(type: string) {
  switch (type) {
    case "ucl":
      return "UCL";
    case "uel":
      return "UEL";
    case "ukl":
      return "UKL";
    case "fast_cup":
      return "FAST CUP";
    default:
      return "AÇIK LİG";
  }
}

async function TournamentList() {
  const sessions = await getScrimSessionsIndex();

  if (sessions.length === 0) {
    return (
      <Card variant="glass" className="py-16 text-center text-muted-foreground">
        Henüz yayınlanan turnuva yok.
      </Card>
    );
  }

  const now = new Date().getTime();

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {sessions.map((session) => {
        const effectiveStatus =
          session.status === "completed"
            ? "completed"
            : new Date(session.startTime).getTime() <= now
            ? "active"
            : "closed";

        return (
          <Link key={session.id} href={`/scrims/${session.slug}`} className="group">
            <Card
              variant="glass"
              hoverEffect
              className="h-full border border-white/10 p-5 transition group-hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <Badge variant={statusBadge[effectiveStatus].variant}>
                  {statusBadge[effectiveStatus].label}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/80">
                  {getLeagueLabel(session.tournamentType)}
                </Badge>
              </div>

              <h3 className="mt-4 text-lg font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider text-white">
                {session.title}
              </h3>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {new Date(session.startTime).toLocaleString("tr-TR", {
                      timeZone: "Europe/Istanbul",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>{siteConfig.ui.landing.sessionModeLabel}: {session.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span>{siteConfig.ui.landing.sessionMapLabel}: {session.mapName}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-widest text-white/40">
                <span>{siteConfig.ui.landing.sessionStartsAt}</span>
                <span className="flex items-center gap-1 text-primary">
                  /{session.slug}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-64 skeleton rounded-lg" />
      ))}
    </div>
  );
}

export default function ScrimsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden pt-4 pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(249,115,22,0.14),transparent_30%)]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full border border-primary/25 opacity-35 blur-2xl" />
          <div className="pointer-events-none absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full border border-accent/20 opacity-25 blur-3xl" />

          <div className="relative mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border border-primary/40">
            <Image src="/logo.jpg" alt="Rage Federasyonu logosu" fill className="object-cover" sizes="64px" />
          </div>

          <h1 className="mb-4 text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl">
            <span className="gradient-text">{siteConfig.ui.landing.activeScrimsTitle}</span>
          </h1>
          <p className="text-muted-foreground">{siteConfig.ui.landing.activeScrimsSubtitle}</p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <TournamentList />
        </Suspense>
      </div>
    </div>
  );
}
