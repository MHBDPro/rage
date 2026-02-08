import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Rajdhani } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeStyles } from "@/components/theme-styles";
import { OrganizationSchema } from "@/components/organization-schema";
import { siteConfig } from "@/config/site";
import { NoiseOverlay } from "@/components/ui/noise-overlay";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Added 500
  display: "swap",
});

// Metadata from site config
export const viewport = {
  themeColor: "#071018",
  viewportFit: "cover" as const,
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.brand.name }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: siteConfig.seo.ogType,
    locale: siteConfig.seo.locale,
    siteName: siteConfig.brand.fullName,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    url: siteConfig.baseUrl,
    images: [
      {
        url: `${siteConfig.baseUrl}/og-image.png`,
        width: 1366,
        height: 768,
        alt: `${siteConfig.brand.fullName} - Instagram Profile`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    images: [`${siteConfig.baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.seo.htmlLang} className="dark antialiased" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6685063309878389" />
        <ThemeStyles />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} min-h-screen bg-background text-foreground`}
      >
        <OrganizationSchema />
        <SmoothScroll />
        <NoiseOverlay />

        {children}

        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0a0b14",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontFamily: "var(--font-geist-sans)",
            },
            classNames: {
              success: "!border-green-500/30 !text-green-400",
              error: "!border-red-500/30 !text-red-400",
              warning: "!border-yellow-500/30 !text-yellow-400",
              info: "!border-blue-500/30 !text-blue-400",
            },
          }}
        />
      </body>
    </html>
  );
}