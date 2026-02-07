import { Suspense } from "react";
import type { Metadata } from "next";
import { Crown, Medal, Award, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SponsorCard } from "@/components/sponsors/sponsor-card";
import { getActiveSponsorsGroupedByTier } from "@/lib/actions/sponsors";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: siteConfig.ui.sponsors?.pageTitle || "Sponsorlar",
  description: `${siteConfig.brand.name} platformunu destekleyen değerli sponsorlarımızı keşfedin.`,
};

interface TierSectionProps {
  title: string;
  icon: React.ReactNode;
  sponsors: Awaited<ReturnType<typeof getActiveSponsorsGroupedByTier>>["gold"];
  cols: string;
}

function TierSection({ title, icon, sponsors, cols }: TierSectionProps) {
  if (sponsors.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
          {icon}
        </div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
          {title}
        </h2>
        <div className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {sponsors.length}
        </div>
      </div>
      <div className={`grid gap-6 ${cols}`}>
        {sponsors.map((sponsor, index) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} index={index} />
        ))}
      </div>
    </section>
  );
}

async function SponsorsGrid() {
  const { gold, silver, bronze } = await getActiveSponsorsGroupedByTier();
  const totalSponsors = gold.length + silver.length + bronze.length;

  if (totalSponsors === 0) {
    return (
      <Card variant="glass" className="py-16 text-center">
        <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold">Henüz Sponsor Yok</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Sponsorlarımız yakında burada görünecek.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Gold Sponsors - 2 columns on large screens */}
      <TierSection
        title="Altın Sponsorlar"
        icon={<Crown className="h-5 w-5 text-yellow-500" />}
        sponsors={gold}
        cols="sm:grid-cols-1 lg:grid-cols-2"
      />

      {/* Silver Sponsors - 3 columns on large screens */}
      <TierSection
        title="Gümüş Sponsorlar"
        icon={<Medal className="h-5 w-5 text-gray-400" />}
        sponsors={silver}
        cols="sm:grid-cols-2 lg:grid-cols-3"
      />

      {/* Bronze Sponsors - 4 columns on large screens */}
      <TierSection
        title="Bronz Sponsorlar"
        icon={<Award className="h-5 w-5 text-amber-600" />}
        sponsors={bronze}
        cols="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2, 3].map((tier) => (
        <div key={tier} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 skeleton rounded-lg" />
            <div className="h-8 w-48 skeleton rounded" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: tier === 1 ? 2 : 3 }).map((_, i) => (
              <div key={i} className="h-72 skeleton rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SponsorsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Değerli Destekçilerimiz</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl lg:text-6xl">
            <span className="gradient-text">Sponsorlarımız</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {siteConfig.brand.name} platformunu destekleyen ve esports topluluğumuza
            güç veren değerli sponsorlarımız
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <Card variant="default" className="flex items-center justify-between p-4" hoverEffect>
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Altın</span>
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-rajdhani)] text-yellow-500">
              Premium
            </span>
          </Card>
          <Card variant="default" className="flex items-center justify-between p-4" hoverEffect>
            <div className="flex items-center gap-3">
              <Medal className="h-6 w-6 text-gray-400" />
              <span className="text-sm text-muted-foreground">Gümüş</span>
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-rajdhani)] text-gray-400">
              Plus
            </span>
          </Card>
          <Card variant="default" className="flex items-center justify-between p-4" hoverEffect>
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-amber-600" />
              <span className="text-sm text-muted-foreground">Bronz</span>
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-rajdhani)] text-amber-600">
              Standart
            </span>
          </Card>
        </div>

        {/* Sponsors Grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          <SponsorsGrid />
        </Suspense>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card variant="glass" className="mx-auto max-w-2xl py-8">
            <h3 className="mb-2 text-xl font-bold font-[family-name:var(--font-rajdhani)] uppercase">
              Sponsor Olmak İster Misiniz?
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {siteConfig.brand.name} ile iş birliği yaparak esports topluluğuna ulaşın
            </p>
            <a
              href={`mailto:rcsforganizasyon@gmail.com`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" />
              İletişime Geçin
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
