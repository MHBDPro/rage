import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getScrimSessionBySlug,
  getSlotsForSession,
  getScrimSettings,
} from "@/lib/actions/scrim";
import { getSponsors } from "@/lib/actions/sponsors";
import { ScrimContent } from "./scrim-content";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const session = await getScrimSessionBySlug(slug);

  if (!session) {
    return {
      title: siteConfig.seo.defaultTitle,
    };
  }

  return {
    title: `${session.title} | ${siteConfig.brand.fullName}`,
    description: `${session.title} ${siteConfig.content.scrimTerm} oturumuna katılın`,
  };
}

export default async function ScrimPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getScrimSessionBySlug(slug);

  if (!session) {
    notFound();
  }

  const [slots, settings, sponsors] = await Promise.all([
    getSlotsForSession(session.id),
    getScrimSettings(),
    getSponsors(true),
  ]);

  return (
    <ScrimContent
      session={session}
      slots={slots}
      isMaintenance={settings.isMaintenance}
      announcement={settings.announcement}
      sponsors={sponsors}
    />
  );
}
