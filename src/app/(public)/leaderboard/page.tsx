import { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getLeaderboardsIndex } from "@/lib/actions/leaderboard";
import { LeaderboardIndex } from "@/components/leaderboard/leaderboard-index";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: siteConfig.ui.leaderboard.indexTitle,
  description: siteConfig.ui.leaderboard.indexSubtitle,
};

async function LeaderboardIndexData() {
  const boards = await getLeaderboardsIndex();
  return <LeaderboardIndex boards={boards} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 skeleton rounded-lg" />
      ))}
    </div>
  );
}

export default function LeaderboardIndexPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl">
            <span className="text-primary">{siteConfig.ui.leaderboard.indexTitle}</span>
          </h1>
          <p className="text-muted-foreground">
            {siteConfig.ui.leaderboard.indexSubtitle}
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <LeaderboardIndexData />
        </Suspense>
      </div>
    </div>
  );
}
