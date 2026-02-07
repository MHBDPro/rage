import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getUpcomingScrimSessions,
  getFastCupSessions,
  getScrimSettings,
} from "@/lib/actions/scrim";
import { getMainLeaderboardChampion } from "@/lib/actions/leaderboard";
import { getSponsors } from "@/lib/actions/sponsors";
import { HomeContent } from "./home-content";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${siteConfig.brand.fullName} | ${siteConfig.content.gameName} ${siteConfig.content.scrimTermPlural} Platformu`,
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: `${siteConfig.brand.name} ${siteConfig.content.scrimTermPlural}`,
  description: siteConfig.seo.description,
  organizer: {
    "@type": "Organization",
    name: siteConfig.brand.fullName,
    url: siteConfig.baseUrl,
  },
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  location: {
    "@type": "VirtualLocation",
    url: siteConfig.baseUrl,
  },
  sport: siteConfig.platform.schemaSport,
};

async function LandingData() {
  const [upcomingSessions, fastCupSessions, champion, settings, sponsors] = await Promise.all([
    getUpcomingScrimSessions(),
    getFastCupSessions(),
    getMainLeaderboardChampion(),
    getScrimSettings(),
    getSponsors(true),
  ]);

  return (
    <HomeContent
      upcomingSessions={upcomingSessions}
      fastCupSessions={fastCupSessions}
      champion={champion}
      isMaintenance={settings.isMaintenance}
      announcement={settings.announcement}
      sponsors={sponsors}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-12 w-64 skeleton rounded" />
          <div className="mx-auto h-6 w-96 skeleton rounded" />
        </div>
        <div className="h-64 skeleton rounded-lg" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section aria-label="Turnuva ana sayfası">
        <Suspense fallback={<LoadingSkeleton />}>
          <LandingData />
        </Suspense>
      </section>
    </>
  );
}
