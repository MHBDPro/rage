"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Megaphone,
  CalendarClock,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { SlotGrid } from "@/components/scrim/slot-grid";
import { GoogleAdUnit } from "@/components/ads/google-ad-unit";
import { SponsorMarquee } from "@/components/sponsors/sponsor-marquee";
import { Card } from "@/components/ui/card";
import type { ScrimSession, Slot, Sponsor } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

const RegisterModal = dynamic(
  () => import("@/components/scrim/register-modal").then((m) => m.RegisterModal),
  { ssr: false }
);

interface ScrimContentProps {
  session: ScrimSession;
  slots: Slot[];
  isMaintenance: boolean;
  announcement: string | null;
  sponsors: Sponsor[];
}

function getLeagueLabel(session: ScrimSession) {
  switch (session.tournamentType) {
    case "ucl":
      return "UCL";
    case "uel":
      return "UEL";
    case "ukl":
      return "UKL";
    case "fast_cup":
      return "Fast Cup";
    default:
      return "Açık Lig";
  }
}

export function ScrimContent({
  session,
  slots,
  isMaintenance,
  announcement,
  sponsors,
}: ScrimContentProps) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = React.useState<number | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const checkTime = () => {
      const start = new Date(session.startTime).getTime();
      setIsOpen(session.status !== "completed" && Date.now() >= start);
    };

    checkTime();
    const interval = setInterval(checkTime, 10000);
    return () => clearInterval(interval);
  }, [session.status, session.startTime]);

  const handleSlotClick = (slotNumber: number) => {
    if (isMaintenance || !isOpen) return;
    setSelectedSlot(slotNumber);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_84%_10%,rgba(249,115,22,0.13),transparent_32%)]" />
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {isMaintenance && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card variant="glow" className="border-yellow-500/30 bg-yellow-500/10">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-semibold text-yellow-400">{siteConfig.ui.slots.maintenanceTitle}</p>
                  <p className="text-sm text-yellow-400/80">
                    {siteConfig.ui.slots.maintenanceDescription}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {session.announcement && !isMaintenance && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card variant="glow" className="border-primary/30">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary/70">Turnuva Duyurusu</p>
                  <p className="text-sm">{session.announcement}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {announcement && !isMaintenance && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card variant="glow" className="border-primary/30">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-primary" />
                <p className="text-sm">{announcement}</p>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-primary/40">
              <Image src="/logo.jpg" alt="Rage Federasyonu logosu" fill className="object-cover" sizes="32px" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
              Rage Federasyonu
            </span>
          </div>

          <h1 className="text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl">
            {session.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              {new Date(session.startTime).toLocaleString("tr-TR", {
                timeZone: "Europe/Istanbul",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {session.mode} • {session.mapName}
            </span>
            <span className="inline-flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              {getLeagueLabel(session)} • Kontenjan: {session.maxSlots}
            </span>
          </div>
          {!isOpen && (
            <p className="mt-3 text-sm text-primary">
              Kayıt, {new Date(session.startTime).toLocaleString("tr-TR", {
                timeZone: "Europe/Istanbul",
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })} tarihinde açılacak.
            </p>
          )}
        </motion.div>

        {sponsors.length > 0 && (
          <div className="mb-10">
            <SponsorMarquee sponsors={sponsors} />
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="glass" className="p-4 sm:p-6">
            <SlotGrid
              slots={slots}
              totalSlots={session.maxSlots}
              isLocked={isMaintenance || !isOpen}
              onSlotClick={handleSlotClick}
              adAfterSlot={10}
              renderAd={() => <GoogleAdUnit className="my-4" />}
            />
          </Card>
        </motion.div>
      </div>

      {selectedSlot !== null && (
        <RegisterModal
          isOpen={true}
          onClose={() => setSelectedSlot(null)}
          slotNumber={selectedSlot}
          sessionId={session.id}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
