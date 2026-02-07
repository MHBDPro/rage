import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.ui.legal.termsTitle,
  description: `${siteConfig.brand.name} kullanim sartlari ve hizmet kosullari.`,
};

export default function TermsPage() {
  const updatedAt = "1 Subat 2026";

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl">
            <span className="gradient-text">{siteConfig.ui.legal.termsTitle}</span>
          </h1>
          <p className="text-muted-foreground">
            {siteConfig.ui.legal.lastUpdated}: {updatedAt}
          </p>
        </div>

        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>1. Kabul ve Kullanim</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bu platformu kullanarak bu sartlari kabul etmis olursunuz. Sartlari
                kabul etmiyorsaniz platformu kullanmamaniz gerekir.
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>2. Kullanici Sorumluluklari</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Kayit bilgilerini dogru ve guncel tutmak.</li>
                <li>Hile, suistimal ve toksik davranislardan kacinmak.</li>
                <li>Platform kurallarina ve turnuva yonergelerine uymak.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>3. Icerik ve Blog Modul</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Blog/News modulu icerikleri bilgilendirme amaciyla sunulur.
                Iceriklerin dogrulugu icin makul caba gosterilse de, gecikme
                veya hatalardan dogan zararlar icin sorumluluk kabul edilmez.
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>4. Hizmet Degisiklikleri</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {siteConfig.brand.name} hizmetleri gelistirmek veya guvenlik
                gerekceleriyle belirli ozellikleri degistirme veya sonlandirma
                hakkini sakli tutar.
              </p>
            </CardContent>
          </Card>

          <Card variant="tactical">
            <CardHeader>
              <CardTitle>5. Iletisim</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/80">
                Sorulariniz icin {siteConfig.contact.email} adresinden bizimle
                iletisime gecebilirsiniz.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
