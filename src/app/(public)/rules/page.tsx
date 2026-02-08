import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Shield,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trophy,
  Target,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getRulesConfig } from "@/lib/actions/admin";
import type { RuleCard } from "@/lib/db";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.ui.rules.title,
  description: `${siteConfig.brand.name} ${siteConfig.content.gameName} ${siteConfig.content.scrimTermPlural} için resmi kurallar ve yönergeler. Kayıt olmadan önce okuyun.`,
};

// Icon mapping (fixed icons, not editable by admin)
const iconMap: Record<RuleCard["iconKey"], React.ElementType> = {
  clock: Clock,
  users: Users,
  shield: Shield,
  target: Target,
};

function RulesLoadingSkeleton() {
  return (
    <>
      <div className="mb-12 grid gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 skeleton rounded-lg" />
        ))}
      </div>
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="h-48 skeleton rounded-lg" />
        <div className="h-48 skeleton rounded-lg" />
      </div>
      <div className="h-40 skeleton rounded-lg" />
    </>
  );
}

async function RulesContent() {
  const config = await getRulesConfig();

  return (
    <>
      {/* Main Rules */}
      <div className="mb-12 grid gap-4 sm:grid-cols-2">
        {config.ruleCards.map((rule, index) => {
          const IconComponent = iconMap[rule.iconKey];
          return (
            <Card key={index} variant="glass" hoverEffect>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5 text-primary" />
                  {rule.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {rule.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Do's and Don'ts */}
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        {/* Do's */}
        <Card variant="default" className="border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              Yapılması Gerekenler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {config.dos.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Don'ts */}
        <Card variant="default" className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <XCircle className="h-5 w-5" />
              Yapılmaması Gerekenler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {config.donts.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Point System */}
      <Card variant="glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Puan Sistemi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            {config.pointSystem.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2"
              >
                <span className="text-sm">{item.position}</span>
                <span className="font-bold font-[family-name:var(--font-rajdhani)] text-primary">
                  +{item.points}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function RulesPage() {
  return (
    <div className="min-h-screen pt-4 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl">
            <span className="gradient-text">Kurallar &</span>{" "}
            <span className="text-foreground">Yönergeler</span>
          </h1>
          <p className="text-muted-foreground">
            Maçlara katılmadan önce lütfen tüm kuralları okuyun ve anlayın
          </p>
        </div>

        {/* Dynamic Content with Suspense */}
        <Suspense fallback={<RulesLoadingSkeleton />}>
          <RulesContent />
        </Suspense>

        {/* Warning */}
        <Card
          variant="default"
          className="mt-8 border-yellow-500/30 bg-yellow-500/5"
        >
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
            <div>
              <p className="font-semibold text-yellow-400">Önemli Uyarı</p>
              <p className="mt-1 text-sm text-yellow-400/80">
                Herhangi bir kuralın ihlali, tüm {siteConfig.brand.name} {siteConfig.content.scrimTermPlural}nden geçici veya
                kalıcı yasaklanma ile sonuçlanabilir. Tüm anlaşmazlıklarda
                yöneticilerin kararı kesindir. Kayıt olarak, tüm kurallara ve
                yönergelere uymayı kabul etmiş olursunuz.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
