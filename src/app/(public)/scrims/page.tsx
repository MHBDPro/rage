import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Map, Gamepad2, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getScrimSessionsIndex } from "@/lib/actions/scrim";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${siteConfig.content.scrimTermPlural} | ${siteConfig.brand.fullName}`,
  description: `${siteConfig.brand.name} ${siteConfig.content.scrimTermPlural} listesini görüntüleyin ve kayıt almak istediğiniz oturumu seçin.`,
};

const statusBadge = {
  active: { variant: "success" as const, label: siteConfig.ui.landing.statusActive },
  closed: { variant: "warning" as const, label: siteConfig.ui.landing.statusClosed },
  completed: { variant: "secondary" as const, label: siteConfig.ui.landing.statusCompleted },
};

async function ScrimsList() {
  const sessions = await getScrimSessionsIndex();

  if (sessions.length === 0) {
    return (
      <Card variant="glass" className="py-16 text-center text-muted-foreground">
        Henüz yayınlanan scrim oturumu yok.
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
          <Link
            key={session.id}
            href={`/scrims/${session.slug}`}
            className="group"
          >
            <Card
              variant="glass"
              hoverEffect
              className="h-full border border-white/10 p-5 transition group-hover:border-emerald-400/40"
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
                <span className="flex items-center gap-1 text-emerald-300">
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
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl">
            <span className="gradient-text">
              {siteConfig.ui.landing.activeScrimsTitle}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {siteConfig.ui.landing.activeScrimsSubtitle}
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <ScrimsList />
        </Suspense>
      </div>
    </div>
  );
}
