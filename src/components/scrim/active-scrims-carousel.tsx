"use client";

import Link from "next/link";
import { Calendar, Map, Gamepad2 } from "lucide-react";
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

export function ActiveScrimsCarousel({ sessions }: ActiveScrimsCarouselProps) {
  if (sessions.length === 0) {
    return (
      <Card variant="glass" className="p-8 text-center text-muted-foreground">
        Henüz yayınlanan scrim oturumu yok.
      </Card>
    );
  }

  const now = new Date().getTime();

  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 pr-2 pt-2 snap-x snap-mandatory">
        {sessions.map((session) => {
          const effectiveStatus =
            session.status === "completed"
              ? "completed"
              : new Date(session.startTime).getTime() <= now
              ? "active"
              : "closed";
          return (
            <Link
              key={session.id}
              href={`/scrims/${session.slug}`}
              className="min-w-[260px] max-w-[320px] snap-start"
            >
              <Card
                variant="glass"
                className="group h-full border border-white/10 p-5 transition hover:-translate-y-1 hover:border-emerald-400/40"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={statusBadge[effectiveStatus].variant}>
                    {statusBadge[effectiveStatus].label}
                  </Badge>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {session.mode}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider text-white">
                  {session.title}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-400" />
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
                    <Map className="h-4 w-4 text-emerald-400" />
                    <span>{session.mapName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-emerald-400" />
                    <span>
                      {siteConfig.ui.landing.sessionModeLabel}: {session.mode}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-widest text-white/40">
                  <span>{siteConfig.ui.landing.sessionStartsAt}</span>
                  <span className="text-emerald-300">/{session.slug}</span>
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
