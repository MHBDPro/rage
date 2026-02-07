"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertTriangle, Megaphone, CalendarClock, ShieldCheck } from "lucide-react";
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

  const handleModalClose = () => {
    setSelectedSlot(null);
  };

  const handleRegistrationSuccess = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Maintenance Banner */}
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

        {/* Session Announcement */}
        {session.announcement && !isMaintenance && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card variant="glow" className="border-primary/30">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary/70">Oturum Duyurusu</p>
                  <p className="text-sm">{session.announcement}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Global Announcement Banner */}
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
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

        {/* Sponsor Marquee */}
        {sponsors.length > 0 && (
          <div className="mb-10">
            <SponsorMarquee sponsors={sponsors} />
          </div>
        )}

        {/* Slot Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="glass" className="p-4 sm:p-6">
            <SlotGrid
              slots={slots}
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
          onClose={handleModalClose}
          slotNumber={selectedSlot}
          sessionId={session.id}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
}
