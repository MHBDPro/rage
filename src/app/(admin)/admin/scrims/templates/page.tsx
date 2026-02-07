"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Plus, Save, Trash2, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  getDailyScrimTemplates,
  createDailyScrimTemplate,
  updateDailyScrimTemplate,
  deleteDailyScrimTemplate,
  runDailyScrimRollover,
} from "@/lib/actions/admin";
import type { DailyScrimTemplate } from "@/lib/db/schema";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}

function tournamentTypeLabel(type: string) {
  switch (type) {
    case "ucl":
      return "UCL";
    case "uel":
      return "UEL";
    case "ukl":
      return "UKL";
    case "fast_cup":
      return "Fast Cup";
    default:
      return "Özel";
  }
}

export default function DailyScrimTemplatesPage() {
  const [templates, setTemplates] = React.useState<DailyScrimTemplate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<DailyScrimTemplate | null>(null);
  const searchParams = useSearchParams();

  const loadTemplates = React.useCallback(async () => {
    setIsLoading(true);
    const data = await getDailyScrimTemplates();
    setTemplates(data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setAddModalOpen(true);
    }
  }, [searchParams]);

  const handleAdd = async (formData: FormData) => {
    const result = await createDailyScrimTemplate(null, formData);
    if (result.success) {
      toast.success(result.message);
      setAddModalOpen(false);
      loadTemplates();
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!selectedTemplate) return;
    const result = await updateDailyScrimTemplate(selectedTemplate.id, null, formData);
    if (result.success) {
      toast.success(result.message);
      setEditModalOpen(false);
      setSelectedTemplate(null);
      loadTemplates();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu şablonu silmek istediğinizden emin misiniz?")) return;
    const result = await deleteDailyScrimTemplate(id);
    if (result.success) {
      toast.success(result.message);
      loadTemplates();
    } else {
      toast.error(result.message);
    }
  };

  const handleRunNow = async () => {
    const result = await runDailyScrimRollover();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
              Günlük Turnuva Şablonları
            </h1>
            <p className="text-muted-foreground">Fast Cup ve lig oturumları için şablonları yönetin.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRunNow}>
              Bugün İçin Oluştur
            </Button>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Şablon
            </Button>
          </div>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Şablon Listesi
            </CardTitle>
            <CardDescription>{"00:00'da"} aktif şablonlar otomatik olarak oturuma dönüştürülür.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 skeleton rounded-lg" />
                ))}
              </div>
            ) : templates.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Henüz günlük şablon yok.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">Şablon</th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">Saat</th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">Lig / Format</th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">Kontenjan</th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">Durum</th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase text-muted-foreground">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map((template) => (
                      <tr key={template.id} className="border-b border-border/50">
                        <td className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{template.title}</span>
                            <span className="text-xs text-muted-foreground">{template.slugSuffix}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">{template.startTime}</td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {tournamentTypeLabel(template.tournamentType)} • {template.mode} • {template.mapName}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">{template.maxSlots}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Badge variant={template.isEnabled ? "success" : "secondary"}>
                              {template.isEnabled ? "Aktif" : "Pasif"}
                            </Badge>
                            {template.isFastCup && <Badge variant="warning">Fast Cup</Badge>}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setEditModalOpen(true);
                              }}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(template.id)}>
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

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Yeni Şablon</ModalTitle>
          <ModalDescription>Günlük turnuva şablonu ekleyin.</ModalDescription>
        </ModalHeader>
        <form action={handleAdd}>
          <ModalBody className="space-y-4">
            <Input name="name" placeholder="Şablon adı (sabah/gece)" required />
            <Input name="title" placeholder="Turnuva başlığı" required />
            <Input name="slugSuffix" placeholder="Slug eki (morning/night)" required />
            <Input type="time" name="startTime" required />

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                name="mode"
                className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                defaultValue="BO1"
              >
                <option value="BO1">BO1</option>
                <option value="BO3">BO3</option>
              </select>
              <Input name="mapName" placeholder="Lig etiketi" required />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                name="tournamentType"
                className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                defaultValue="fast_cup"
              >
                <option value="ucl">UCL</option>
                <option value="uel">UEL</option>
                <option value="ukl">UKL</option>
                <option value="fast_cup">Fast Cup</option>
                <option value="custom">Özel</option>
              </select>
              <Input type="number" name="maxSlots" min={2} max={128} defaultValue={32} required />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                name="isFastCup"
                className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                defaultValue="true"
              >
                <option value="true">Fast Cup</option>
                <option value="false">Standart</option>
              </select>
              <select
                name="isEnabled"
                className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                defaultValue="true"
              >
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>

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

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Şablon Güncelle</ModalTitle>
          <ModalDescription>Seçilen şablonu düzenleyin.</ModalDescription>
        </ModalHeader>
        {selectedTemplate && (
          <form action={handleEdit}>
            <ModalBody className="space-y-4">
              <Input name="name" defaultValue={selectedTemplate.name} required />
              <Input name="title" defaultValue={selectedTemplate.title} required />
              <Input name="slugSuffix" defaultValue={selectedTemplate.slugSuffix} required />
              <Input type="time" name="startTime" defaultValue={selectedTemplate.startTime} required />

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="mode"
                  className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  defaultValue={selectedTemplate.mode}
                >
                  <option value="BO1">BO1</option>
                  <option value="BO3">BO3</option>
                </select>
                <Input name="mapName" defaultValue={selectedTemplate.mapName} required />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="tournamentType"
                  className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  defaultValue={selectedTemplate.tournamentType}
                >
                  <option value="ucl">UCL</option>
                  <option value="uel">UEL</option>
                  <option value="ukl">UKL</option>
                  <option value="fast_cup">Fast Cup</option>
                  <option value="custom">Özel</option>
                </select>
                <Input type="number" name="maxSlots" min={2} max={128} defaultValue={selectedTemplate.maxSlots} required />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="isFastCup"
                  className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  defaultValue={selectedTemplate.isFastCup ? "true" : "false"}
                >
                  <option value="true">Fast Cup</option>
                  <option value="false">Standart</option>
                </select>
                <select
                  name="isEnabled"
                  className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  defaultValue={selectedTemplate.isEnabled ? "true" : "false"}
                >
                  <option value="true">Aktif</option>
                  <option value="false">Pasif</option>
                </select>
              </div>

              <textarea
                name="announcement"
                defaultValue={selectedTemplate.announcement || ""}
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
