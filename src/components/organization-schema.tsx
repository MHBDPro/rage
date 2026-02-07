"use client";

import { siteConfig } from "@/config/site";

export function OrganizationSchema() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: siteConfig.brand.fullName,
    alternateName: siteConfig.brand.name,
    url: siteConfig.baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.baseUrl}/logo.jpg`,
      width: 720,
      height: 720,
    },
    image: `${siteConfig.baseUrl}/og-image.png`,
    description: siteConfig.brand.description,
    sameAs: siteConfig.footer.socialLinks.map((link) => link.url),
    sport: siteConfig.content.gameName,
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
    />
  );
}
