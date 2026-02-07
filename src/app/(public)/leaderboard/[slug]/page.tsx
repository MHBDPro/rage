import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getLeaderboardBySlug } from "@/lib/actions/leaderboard";
import { LeaderboardDetail } from "@/components/leaderboard/leaderboard-detail";

export const dynamic = "force-dynamic";

interface LeaderboardPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: LeaderboardPageProps): Promise<Metadata> {
  const data = await getLeaderboardBySlug(params.slug);
  if (!data) {
    return {
      title: siteConfig.ui.leaderboard.title,
    };
  }

  return {
    title: `${data.leaderboard.title} | ${siteConfig.ui.leaderboard.title}`,
    description: siteConfig.ui.leaderboard.indexSubtitle,
  };
}

const statusStyles = {
  active: "border-primary/40 bg-primary/10 text-primary",
  archived: "border-border bg-secondary/40 text-muted-foreground",
};

export default async function LeaderboardDetailPage({ params }: LeaderboardPageProps) {
  const data = await getLeaderboardBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { leaderboard, entries } = data;
  const totalPoints = entries.reduce((sum, entry) => sum + entry.points, 0);

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/leaderboard">
              <Button variant="outline" size="sm">
                {siteConfig.ui.common.back}
              </Button>
            </Link>
            {leaderboard.isMain && (
              <Badge className="border-primary/40 bg-primary/10 text-primary">
                {siteConfig.ui.leaderboard.mainLabel}
              </Badge>
            )}
            <Badge className={statusStyles[leaderboard.status]}>
              {leaderboard.status === "active"
                ? siteConfig.ui.leaderboard.activeLabel
                : siteConfig.ui.leaderboard.archivedLabel}
            </Badge>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider text-foreground">
                {leaderboard.title}
              </h1>
              <p className="mt-2 text-muted-foreground">/leaderboard/{leaderboard.slug}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Card variant="default" className="p-4" hoverEffect>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {siteConfig.ui.leaderboard.entriesLabel}
                </div>
                <div className="mt-2 text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-primary">
                  {entries.length}
                </div>
              </Card>
              <Card variant="default" className="p-4" hoverEffect>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {siteConfig.ui.leaderboard.points}
                </div>
                <div className="mt-2 text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-primary">
                  {totalPoints}
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {siteConfig.ui.leaderboard.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeaderboardDetail entries={entries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
