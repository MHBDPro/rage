import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Bolt, CalendarClock, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFastCupSessions } from "@/lib/actions/scrim";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Fast Cup | ${siteConfig.brand.fullName}`,
  description: "Hızlı kayıtla anında başlayan Fast Cup turnuvalarına katılın.",
};

export default async function FastCupPage() {
  const sessions = await getFastCupSessions(24);

  return (
    <div className="relative min-h-screen overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(16,185,129,0.15),transparent_30%),radial-gradient(circle_at_84%_10%,rgba(249,115,22,0.16),transparent_30%)]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute left-1/2 top-12 h-56 w-56 -translate-x-1/2 rounded-full border border-primary/30 opacity-35 blur-2xl" />
          <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full border border-accent/25 opacity-30 blur-3xl" />

          <div className="relative mx-auto mb-5 h-20 w-20 overflow-hidden rounded-full border border-primary/40">
            <Image src="/logo.jpg" alt="Rage Federasyonu logosu" fill className="object-cover" sizes="80px" />
          </div>

          <h1 className="text-5xl font-black font-[family-name:var(--font-rajdhani)] uppercase tracking-wide text-white">
            <span className="text-primary">Fast</span> Cup
          </h1>
          <p className="mt-4 text-muted-foreground">
            Kısa format, hızlı kayıt, anında rekabet.
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card variant="glass" className="py-16 text-center text-muted-foreground">
            Şu an aktif veya yaklaşan Fast Cup bulunmuyor.
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => (
              <Card key={session.id} variant="glass" className="border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6">
                <div className="flex items-center justify-between">
                  <Badge variant="warning">Fast Cup</Badge>
                  <span className="text-xs text-muted-foreground">{session.mode}</span>
                </div>

                <h2 className="mt-4 text-2xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-white">
                  {session.title}
                </h2>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p className="inline-flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    {new Date(session.startTime).toLocaleString("tr-TR", {
                      timeZone: "Europe/Istanbul",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Lig: {session.mapName}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Bolt className="h-4 w-4 text-primary" />
                    Kontenjan: {session.maxSlots}
                  </p>
                </div>

                <Link href={`/scrims/${session.slug}`} className="mt-6 block">
                  <Button className="w-full">Kayıt Sayfasına Git</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
