import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.ui.legal.contactTitle,
  description: `${siteConfig.brand.name} iletisim kanallari ve destek bilgileri.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl">
            <span className="gradient-text">{siteConfig.ui.legal.contactTitle}</span>
          </h1>
          <p className="text-muted-foreground">
            Resmi destek ve is birlikleri icin bize ulasin.
          </p>
        </div>

        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Iletisim Merkezi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Email: {" "}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-primary hover:text-primary/80"
                  >
                    {siteConfig.contact.email}
                  </a>
                </p>
                {siteConfig.contact.phone && (
                  <p>Telefon: {siteConfig.contact.phone}</p>
                )}
                {siteConfig.contact.address && (
                  <p>Adres: {siteConfig.contact.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card variant="tactical">
            <CardHeader>
              <CardTitle>Sosyal Kanallar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {siteConfig.footer.socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:border-primary/50 hover:text-primary"
                  >
                    {social.shortLabel}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
