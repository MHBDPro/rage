import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Settings,
  Trophy,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminStats, getLatestSessionWithSlots } from "@/lib/actions/admin";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yönetici Kontrol Paneli",
};

async function DashboardStats() {
  const [stats, latest] = await Promise.all([
    getAdminStats(),
    getLatestSessionWithSlots(),
  ]);

  const latestSession = latest.session;
  const latestSlots = latest.slots;

  return (
    <>
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="glow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Toplam Oturum</p>
                <p className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] text-primary">
                  {stats.totalSessions}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktif</p>
                <p className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] text-green-400">
                  {stats.activeSessions}
                </p>
              </div>
              <Rocket className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Yaklaşan</p>
                <p className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] text-yellow-400">
                  {stats.upcomingSessions}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="border-red-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tamamlanan</p>
                <p className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] text-red-400">
                  {stats.completedSessions}
                </p>
              </div>
              <Users className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Mevcut Ayarlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bakım</span>
              <Badge variant={stats.settings?.isMaintenance ? "destructive" : "success"}>
                {stats.settings?.isMaintenance ? "Aktif" : "Pasif"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Liderlik Tablosu</span>
              <Badge variant="secondary">{stats.teamsInLeaderboard}</Badge>
            </div>
            <Link href="/admin/settings">
              <Button variant="outline" className="mt-4 w-full">
                Ayarları Yönet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Hızlı İşlemler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/scrims" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Scrim Oturumlarını Yönet
              </Button>
            </Link>
            <Link href="/admin/leaderboard" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Trophy className="mr-2 h-4 w-4" />
                Liderlik Tablosunu Düzenle
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="secondary" className="w-full justify-start">
                <ArrowRight className="mr-2 h-4 w-4" />
                Herkese Açık Siteyi Görüntüle
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Registrations */}
      <Card variant="glass" className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Son Oturum Kayıtları
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!latestSession ? (
            <p className="py-8 text-center text-muted-foreground">
              Henüz scrim oturumu yok
            </p>
          ) : latestSlots.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {latestSession.title} için kayıt yok
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase text-muted-foreground">
                <span className="rounded-full border border-border px-2 py-1">
                  {latestSession.title}
                </span>
                <span className="rounded-full border border-border px-2 py-1">
                  {new Date(latestSession.startTime).toLocaleString("tr-TR", {
                    timeZone: "Europe/Istanbul",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                      Slot
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                      Takım
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                      Instagram
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                      Saat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {latestSlots.slice(0, 10).map((slot) => (
                    <tr key={slot.id} className="border-b border-border/50">
                      <td className="py-3">
                        <Badge variant="default">#{slot.slotNumber}</Badge>
                      </td>
                      <td className="py-3 font-medium">{slot.teamName || siteConfig.ui.slots.locked}</td>
                      <td className="py-3 text-muted-foreground">
                        {slot.instagram || "-"}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {new Date(slot.createdAt).toLocaleTimeString("tr-TR", {
                          timeZone: "Europe/Istanbul",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {latestSession && latestSlots.length > 10 && (
            <Link href={`/admin/scrims/${latestSession.id}`} className="mt-4 block">
              <Button variant="outline" className="w-full">
                Tümünü Görüntüle (toplam {latestSlots.length})
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 skeleton rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 skeleton rounded-lg" />
        <div className="h-64 skeleton rounded-lg" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
            Kontrol Paneli
          </h1>
          <p className="text-muted-foreground">
            Çoklu scrim oturumlarına genel bakış
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <DashboardStats />
        </Suspense>
      </div>
    </div>
  );
}
