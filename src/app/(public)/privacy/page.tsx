import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.ui.legal.privacyTitle,
  description: `${siteConfig.brand.name} gizlilik politikasi ve veri isleme esaslari.`,
};

export default function PrivacyPage() {
  const updatedAt = "1 Subat 2026";

  return (
    <div className="min-h-screen pt-4 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl">
            <span className="gradient-text">{siteConfig.ui.legal.privacyTitle}</span>
          </h1>
          <p className="text-muted-foreground">
            {siteConfig.ui.legal.lastUpdated}: {updatedAt}
          </p>
        </div>

        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>1. Genel Bakis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bu gizlilik politikasi, {siteConfig.brand.fullName} tarafindan
                {" "}
                {siteConfig.baseUrl} alan adi uzerinden sunulan hizmetlerde hangi
                verilerin toplandigini, nasil kullanildigini ve nasil korundugunu
                aciklar.
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>2. Toplanan Veriler</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Takim ve oyuncu adlari, iletisim bilgileri.</li>
                <li>IP adresi ve oturum guvenlik bilgileri.</li>
                <li>Tarayici ve cihaz bilgileri (log verileri).</li>
                <li>Blog ve haber icerikleriyle etkilesim sinyalleri.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>3. Kullanim Amaclari</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Turnuva kayitlarini yonetmek ve platformu sunmak.</li>
                <li>Guvenlik, suistimal onleme ve hata tespiti.</li>
                <li>Urun performansini analiz etmek ve gelistirmek.</li>
                <li>Yasal yukumluluklerin yerine getirilmesi.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>4. Reklam ve Cerezler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Platformda Google AdSense gibi reklam servisleri kullanilabilir.
                Bu servisler, reklam gosterimi ve olcumleme icin cerezler veya
                benzer teknolojilerden yararlanabilir. Tarayici ayarlarinizdan
                cerez tercihlerinizi yonetebilirsiniz.
              </p>
            </CardContent>
          </Card>

          <Card variant="tactical">
            <CardHeader>
              <CardTitle>5. Iletisim</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/80">
                Gizlilikle ilgili sorulariniz icin bize ulasin: {siteConfig.contact.email}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
