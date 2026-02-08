import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { GridBackground } from "@/components/ui/grid-background";
import { PublicNav } from "@/components/ui/public-nav";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <>
      {adsenseClient && (
        <Script
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      )}
      <GridBackground animated>
        {/* Floating Island Navigation */}
        <PublicNav />

        <main className="pt-20 md:pt-20">{children}</main>

        <footer className="relative w-full overflow-hidden border-t border-white/10 bg-[#05080d]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.14),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(249,115,22,0.14),transparent_42%)]" />
            <div className="absolute left-1/2 top-4 h-56 w-56 -translate-x-1/2 rounded-full border border-primary/20 opacity-30 blur-2xl" />
            <div className="absolute left-1/2 top-4 h-72 w-72 -translate-x-1/2 rounded-full border border-accent/20 opacity-25 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
              {/* Brand + Social */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-primary/30 bg-primary/10">
                    <Image
                      src="/logo.jpg"
                      alt={`${siteConfig.brand.name} logo`}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                      {siteConfig.brand.tagline}
                    </p>
                    <p className="text-lg font-bold uppercase tracking-wider text-primary">
                      {siteConfig.brand.name}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {siteConfig.brand.description}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  {siteConfig.footer.socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-sm font-bold text-white/70 transition-all hover:border-primary/60 hover:text-primary"
                      aria-label={social.platform}
                    >
                      {social.shortLabel}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
                  {siteConfig.ui.footer.quickLinks}
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {siteConfig.navigation.public.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-white/60 transition hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AdSense + Legal */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                    AdSense İçerikleri
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    Bu alandaki sponsorlu içerikler Google AdSense üzerinden sunulur.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/40">
                  {siteConfig.navigation.legal
                    .filter((item) => item.href === "/privacy" || item.href === "/terms")
                    .map((item) => (
                      <Link key={item.href} href={item.href} className="transition hover:text-primary/80">
                        {item.label}
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/40 md:flex-row md:text-left">
              <span>
                &copy; {new Date().getFullYear()} {siteConfig.brand.copyrightHolder}. {siteConfig.ui.footer.allRightsReserved}.
              </span>
              {siteConfig.developer.showInFooter && (
                <span>
                  {siteConfig.ui.footer.developedBy}:{" "}
                  <a
                    href={siteConfig.developer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {siteConfig.developer.name}
                  </a>
                </span>
              )}
            </div>
          </div>
        </footer>
      </GridBackground>
    </>
  );
}
