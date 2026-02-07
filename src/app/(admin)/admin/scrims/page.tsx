"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Swords,
  Crown,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
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
  getScrimSessionsAdmin,
  createScrimSession,
  updateScrimSession,
  deleteScrimSession,
} from "@/lib/actions/admin";
import type { ScrimSession } from "@/lib/db/schema";
import { formatIstanbulDateTimeInput } from "@/lib/utils";
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

export default function ScrimsPage() {
  const [sessions, setSessions] = React.useState<ScrimSession[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState<ScrimSession | null>(null);
  const [now, setNow] = React.useState<number | null>(null);
  const searchParams = useSearchParams();

  const getEffectiveStatus = React.useCallback(
    (session: ScrimSession) => {
      const current = now ?? 0;
      return session.status === "completed"
        ? "completed"
        : new Date(session.startTime).getTime() <= current
        ? "active"
        : "closed";
    },
    [now]
  );

  const loadSessions = React.useCallback(async () => {
    setIsLoading(true);
    const data = await getScrimSessionsAdmin();
    setSessions(data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    setNow(Date.now());
    loadSessions();
  }, [loadSessions]);

  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setAddModalOpen(true);
    }
  }, [searchParams]);

  const handleAdd = async (formData: FormData) => {
    const result = await createScrimSession(null, formData);
    if (result.success) {
      toast.success(result.message);
      setAddModalOpen(false);
      loadSessions();
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!selectedSession) return;
    const result = await updateScrimSession(selectedSession.id, null, formData);
    if (result.success) {
      toast.success(result.message);
      setEditModalOpen(false);
      setSelectedSession(null);
      loadSessions();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (sessionId: number) => {
    if (!confirm("Bu scrim oturumunu silmek istediğinizden emin misiniz?")) return;
    const result = await deleteScrimSession(sessionId);
    if (result.success) {
      toast.success(result.message);
      loadSessions();
    } else {
      toast.error(result.message);
    }
  };

  const openEditModal = (session: ScrimSession) => {
    setSelectedSession(session);
    setEditModalOpen(true);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
              Scrim Oturumları
            </h1>
            <p className="text-muted-foreground">
              Tüm scrim oturumlarını yönetin ve detay sayfalarına gidin
            </p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Oturum
          </Button>
        </div>

        {/* Sessions Table */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Oturum Listesi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 skeleton rounded-lg" />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Henüz scrim oturumu yok
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Başlık
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Başlangıç
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Mod / Harita
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Durum
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Şampiyon
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id} className="border-b border-border/50">
                        <td className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{session.title}</span>
                            <span className="text-xs text-muted-foreground">/{session.slug}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {new Date(session.startTime).toLocaleString("tr-TR", {
                            timeZone: "Europe/Istanbul",
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Swords className="h-4 w-4 text-primary" />
                            {session.mode} • {session.mapName}
                          </div>
                        </td>
                        <td className="py-3">
                          {(() => {
                            const effectiveStatus = getEffectiveStatus(session);
                            return (
                              <Badge variant={statusBadge[effectiveStatus].variant}>
                                {statusBadge[effectiveStatus].label}
                              </Badge>
                            );
                          })()}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {session.championTeam ? (
                            <span className="inline-flex items-center gap-1">
                              <Crown className="h-3 w-3 text-yellow-400" />
                              {session.championTeam}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/scrims/${session.id}`}>
                              <Button variant="outline" size="sm">
                                Detay
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(session)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(session.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Session Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Yeni Scrim Oturumu</ModalTitle>
          <ModalDescription>Yeni bir scrim oturumu oluşturun</ModalDescription>
        </ModalHeader>
        <form action={handleAdd}>
          <ModalBody className="space-y-4">
            <Input name="title" placeholder="Oturum başlığı" required />
            <Input name="slug" placeholder="Slug (isteğe bağlı)" />
            <Input type="datetime-local" name="startTime" required />
            <div className="grid grid-cols-2 gap-3">
              <select
                name="mode"
                className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                defaultValue="TPP"
              >
                <option value="TPP">TPP</option>
                <option value="FPP">FPP</option>
              </select>
              <select
                name="status"
                className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                defaultValue="closed"
              >
                <option value="active">Aktif</option>
                <option value="closed">Yakında</option>
                <option value="completed">Tamamlandı</option>
              </select>
            </div>
            <Input name="mapName" placeholder="Harita adı" required />
            <textarea
              name="announcement"
              placeholder="Oturum duyurusu (isteğe bağlı)"
              rows={3}
              className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              maxLength={500}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
              İptal
            </Button>
            <SubmitButton>Oluştur</SubmitButton>
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Session Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Oturumu Düzenle</ModalTitle>
          <ModalDescription>Scrim oturum detaylarını güncelleyin</ModalDescription>
        </ModalHeader>
        {selectedSession && (
          <form action={handleEdit}>
            <ModalBody className="space-y-4">
              <Input name="title" defaultValue={selectedSession.title} required />
              <Input name="slug" defaultValue={selectedSession.slug} />
              <Input
                type="datetime-local"
                name="startTime"
                defaultValue={formatIstanbulDateTimeInput(new Date(selectedSession.startTime))}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="mode"
                  className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  defaultValue={selectedSession.mode}
                >
                  <option value="TPP">TPP</option>
                  <option value="FPP">FPP</option>
                </select>
                <select
                  name="status"
                  className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  defaultValue={selectedSession.status}
                >
                  <option value="active">Aktif</option>
                  <option value="closed">Yakında</option>
                  <option value="completed">Tamamlandı</option>
                </select>
              </div>
              <Input name="mapName" defaultValue={selectedSession.mapName} required />
              <textarea
                name="announcement"
                defaultValue={selectedSession.announcement || ""}
                placeholder="Oturum duyurusu (isteğe bağlı)"
                rows={3}
                className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                maxLength={500}
              />
            </ModalBody>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                İptal
              </Button>
              <SubmitButton>Güncelle</SubmitButton>
            </ModalFooter>
          </form>
        )}
      </Modal>
    </div>
  );
}
