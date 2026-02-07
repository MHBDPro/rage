"use client";

import Link from "next/link";
import { CalendarClock, CircleDot, Shield, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ScrimSession } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

interface ActiveScrimsCarouselProps {
  sessions: ScrimSession[];
}

const statusBadge = {
  active: { variant: "success" as const, label: siteConfig.ui.landing.statusActive },
  closed: { variant: "warning" as const, label: siteConfig.ui.landing.statusClosed },
  completed: { variant: "secondary" as const, label: siteConfig.ui.landing.statusCompleted },
};

function formatStartsIn(startTime: Date) {
  const diffMs = startTime.getTime() - Date.now();
  if (diffMs <= 0) {
    return "Şimdi";
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} gün sonra`;
  }

  if (hours > 0) {
    return `${hours} saat sonra`;
  }

  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  return `${minutes} dk sonra`;
}

function getLeagueLabel(session: ScrimSession) {
  switch (session.tournamentType) {
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

export function ActiveScrimsCarousel({ sessions }: ActiveScrimsCarouselProps) {
  if (sessions.length === 0) {
    return (
      <Card variant="glass" className="p-8 text-center text-muted-foreground">
        Henüz yayınlanan turnuva yok.
      </Card>
    );
  }

  const now = new Date().getTime();

  return (
    <div className="relative">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-2 pt-2">
        {sessions.map((session) => {
          const start = new Date(session.startTime);
          const effectiveStatus =
            session.status === "completed"
              ? "completed"
              : start.getTime() <= now
              ? "active"
              : "closed";

          return (
            <Link
              key={session.id}
              href={`/scrims/${session.slug}`}
              className="min-w-[280px] max-w-[340px] snap-start"
            >
              <Card
                variant="glass"
                className="group h-full border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-5 transition hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={statusBadge[effectiveStatus].variant}>
                    {statusBadge[effectiveStatus].label}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white/75">
                    {getLeagueLabel(session)}
                  </Badge>
                </div>

                <h3 className="mt-4 text-lg font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider text-white">
                  {session.title}
                </h3>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    <span>
                      {start.toLocaleString("tr-TR", {
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
                    <span>
                      {siteConfig.ui.landing.sessionModeLabel}: {session.mode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span>
                      {siteConfig.ui.landing.sessionMapLabel}: {session.mapName}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-widest text-white/40">
                  <span>{siteConfig.ui.landing.sessionStartsAt}</span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    <CircleDot className="h-3.5 w-3.5" />
                    {formatStartsIn(start)}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
