"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  Lock,
  Unlock,
  Trash2,
  Plus,
  Crown,
  Swords,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  getScrimSessionAdmin,
  getSessionSlots,
  addSlotManually,
  deleteSlot,
  lockSlot,
  unlockSlot,
  setChampion,
} from "@/lib/actions/admin";
import type { ScrimSession, Slot } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}

const statusBadge = {
  active: { variant: "success" as const, label: siteConfig.ui.landing.statusActive },
  closed: { variant: "warning" as const, label: siteConfig.ui.landing.statusClosed },
  completed: { variant: "secondary" as const, label: siteConfig.ui.landing.statusCompleted },
};

export default function ScrimSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = Number(params?.id);
  const [now, setNow] = React.useState<number | null>(null);

  const [session, setSession] = React.useState<ScrimSession | null>(null);
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<number>(1);
  const [championName, setChampionName] = React.useState("");

  const loadData = React.useCallback(async () => {
    if (!sessionId || Number.isNaN(sessionId)) return;
    setIsLoading(true);
    const [sessionData, slotData] = await Promise.all([
      getScrimSessionAdmin(sessionId),
      getSessionSlots(sessionId),
    ]);
    setSession(sessionData);
    setSlots(slotData);
    setChampionName(sessionData?.championTeam || "");
    setIsLoading(false);
  }, [sessionId]);

  React.useEffect(() => {
    setNow(Date.now());
    loadData();
  }, [loadData]);

  const handleAddSubmit = async (formData: FormData) => {
    formData.append("slotNumber", selectedSlot.toString());
    const result = await addSlotManually(sessionId, null, formData);
    if (result.success) {
      toast.success(result.message);
      setAddModalOpen(false);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (slotId: number) => {
    const result = await deleteSlot(slotId);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleLock = async (slotNumber: number) => {
    const result = await lockSlot(sessionId, slotNumber);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleUnlock = async (slotNumber: number) => {
    const result = await unlockSlot(sessionId, slotNumber);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleChampion = async (formData: FormData) => {
    const team = (formData.get("championTeam") as string) || "";
    const result = await setChampion(sessionId, team);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const slotMap = React.useMemo(() => {
    const map = new Map<number, Slot>();
    slots.forEach((slot) => map.set(slot.slotNumber, slot));
    return map;
  }, [slots]);

  const totalSlots = siteConfig.platform.totalSlots;
  const lockedCount = slots.filter((slot) => slot.isLocked).length;
  const filledCount = slots.filter((slot) => !slot.isLocked).length;
  const availableCount = totalSlots - lockedCount - filledCount;

  const availableSlots = Array.from({ length: totalSlots }, (_, i) => i + 1).filter(
    (num) => !slotMap.has(num)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-96 skeleton rounded-lg" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card variant="glass" className="p-8 text-center">
            <p className="text-muted-foreground">Scrim oturumu bulunamadı.</p>
            <Button className="mt-4" onClick={() => router.push("/admin/scrims")}
            >
              Oturumlara Dön
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const current = now ?? 0;
  const effectiveStatus =
    session.status === "completed"
      ? "completed"
      : new Date(session.startTime).getTime() <= current
      ? "active"
      : "closed";

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin/scrims" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Oturumlara Dön
            </Link>
            <h1 className="mt-2 text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
              {session.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant={statusBadge[effectiveStatus].variant}>
                {statusBadge[effectiveStatus].label}
              </Badge>
              <span className="inline-flex items-center gap-1">
                <Swords className="h-4 w-4 text-primary" />
                {session.mode} • {session.mapName}
              </span>
              <span>
                {new Date(session.startTime).toLocaleString("tr-TR", {
                  timeZone: "Europe/Istanbul",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <Button onClick={() => setAddModalOpen(true)} disabled={availableSlots.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Takım Ekle
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card variant="default">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Toplam</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)]">
                  {totalSlots}
                </p>
              </div>
              <Users className="h-6 w-6 text-primary/50" />
            </CardContent>
          </Card>
          <Card variant="default" className="border-green-500/30">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Müsait</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-green-400">
                  {availableCount}
                </p>
              </div>
              <div className="h-6 w-6 rounded-full bg-green-500/20" />
            </CardContent>
          </Card>
          <Card variant="default" className="border-yellow-500/30">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Kilitli</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-yellow-400">
                  {lockedCount}
                </p>
              </div>
              <Lock className="h-6 w-6 text-yellow-500/50" />
            </CardContent>
          </Card>
        </div>

        {/* Champion */}
        <Card variant="glass" className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              Şampiyon Güncelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleChampion} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                name="championTeam"
                placeholder="Şampiyon takım adı"
                value={championName}
                onChange={(e) => setChampionName(e.target.value)}
              />
              <SubmitButton>Şampiyonu Kaydet</SubmitButton>
            </form>
          </CardContent>
        </Card>

        {/* Slot Grid */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Slot Yönetimi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {Array.from({ length: totalSlots }, (_, i) => i + 1).map((num) => {
                const slot = slotMap.get(num);
                const isLocked = slot?.isLocked;
                return (
                  <div
                    key={num}
                    className={`rounded-lg border p-3 text-center ${
                      isLocked
                        ? "border-yellow-500/30 bg-yellow-500/10"
                        : slot
                        ? "border-red-500/30 bg-red-500/10"
                        : "border-green-500/30 bg-green-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">#{num}</span>
                      {isLocked && <Lock className="h-3 w-3 text-yellow-500" />}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {isLocked
                        ? "Kilitli"
                        : slot
                        ? slot.teamName
                        : "Boş"}
                    </div>
                    {slot?.playerNames?.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground/80">
                        {slot.playerNames.map((name, idx) => (
                          <span key={`${slot.id}-player-${idx}`} className="truncate">
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-3 flex items-center justify-center gap-2">
                      {isLocked ? (
                        <Button size="sm" variant="outline" onClick={() => handleUnlock(num)}>
                          <Unlock className="h-3 w-3" />
                        </Button>
                      ) : slot ? (
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(slot.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleLock(num)}>
                          <Lock className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Team Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Manuel Takım Ekle</ModalTitle>
          <ModalDescription>Müsait bir slota takım ekleyin</ModalDescription>
        </ModalHeader>
        <form action={handleAddSubmit}>
          <ModalBody className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Slot Numarası</label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {availableSlots.map((num) => (
                  <option key={num} value={num}>
                    Slot #{num}
                  </option>
                ))}
              </select>
            </div>
            <Input name="teamName" placeholder="Takım adını girin" required />
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((index) => (
                <Input
                  key={`player-${index}`}
                  name={`playerName${index}`}
                  placeholder={`Oyuncu ${index} adı`}
                  required
                />
              ))}
            </div>
            <Input name="instagram" placeholder="@kullaniciadi" required />
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
              İptal
            </Button>
            <SubmitButton>Takım Ekle</SubmitButton>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
