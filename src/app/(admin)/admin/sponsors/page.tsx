"use client";

import * as React from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Crown,
  Medal,
  Award,
  ExternalLink,
  Eye,
  EyeOff,
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
  getSponsors,
  addSponsor,
  updateSponsor,
  deleteSponsor,
  getSponsorsStats,
} from "@/lib/actions/sponsors";
import type { Sponsor, SponsorSocialLinks } from "@/lib/db/schema";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}

const tierBadges = {
  gold: { variant: "gold" as const, icon: Crown, label: "Altın" },
  silver: { variant: "secondary" as const, icon: Medal, label: "Gümüş" },
  bronze: { variant: "warning" as const, icon: Award, label: "Bronz" },
};

export default function SponsorsPage() {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [stats, setStats] = React.useState({
    total: 0,
    active: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedSponsor, setSelectedSponsor] = React.useState<Sponsor | null>(null);
  const [logoUrl, setLogoUrl] = React.useState("");
  const [socialLinks, setSocialLinks] = React.useState<SponsorSocialLinks>({});
  const searchParams = useSearchParams();

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    const [sponsorsData, statsData] = await Promise.all([
      getSponsors(),
      getSponsorsStats(),
    ]);
    setSponsors(sponsorsData);
    setStats(statsData);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setAddModalOpen(true);
    }
  }, [searchParams]);

  const resetForm = () => {
    setLogoUrl("");
    setSocialLinks({});
  };

  const handleAdd = async (formData: FormData) => {
    formData.set("logoUrl", logoUrl);
    formData.set("socialLinks", JSON.stringify(socialLinks));
    formData.set("isActive", "true");

    const result = await addSponsor(null, formData);
    if (result.success) {
      toast.success(result.message);
      setAddModalOpen(false);
      resetForm();
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!selectedSponsor) return;

    formData.set("logoUrl", logoUrl || selectedSponsor.logoUrl);
    formData.set("socialLinks", JSON.stringify(socialLinks));

    const result = await updateSponsor(selectedSponsor.id, null, formData);
    if (result.success) {
      toast.success(result.message);
      setEditModalOpen(false);
      setSelectedSponsor(null);
      resetForm();
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu sponsoru silmek istediğinizden emin misiniz?")) return;

    const result = await deleteSponsor(id);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleToggleActive = async (sponsor: Sponsor) => {
    const formData = new FormData();
    formData.set("name", sponsor.name);
    formData.set("logoUrl", sponsor.logoUrl);
    formData.set("description", sponsor.description || "");
    formData.set("websiteUrl", sponsor.websiteUrl || "");
    formData.set("tier", sponsor.tier);
    formData.set("isActive", (!sponsor.isActive).toString());
    formData.set("displayOrder", sponsor.displayOrder.toString());
    formData.set("socialLinks", JSON.stringify(sponsor.socialLinks || {}));

    const result = await updateSponsor(sponsor.id, null, formData);
    if (result.success) {
      toast.success(sponsor.isActive ? "Sponsor devre dışı bırakıldı" : "Sponsor aktifleştirildi");
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const openEditModal = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setLogoUrl(sponsor.logoUrl);
    setSocialLinks((sponsor.socialLinks as SponsorSocialLinks) || {});
    setEditModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
              Sponsor Yöneticisi
            </h1>
            <p className="text-muted-foreground">
              Sponsorları ekleyin, düzenleyin ve yönetin
            </p>
          </div>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Sponsor Ekle
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-5">
          <Card variant="default">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Toplam</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)]">
                  {stats.total}
                </p>
              </div>
              <Sparkles className="h-6 w-6 text-primary/50" />
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Aktif</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-green-400">
                  {stats.active}
                </p>
              </div>
              <Eye className="h-6 w-6 text-green-500/50" />
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Altın</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-yellow-500">
                  {stats.gold}
                </p>
              </div>
              <Crown className="h-6 w-6 text-yellow-500/50" />
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Gümüş</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-gray-400">
                  {stats.silver}
                </p>
              </div>
              <Medal className="h-6 w-6 text-gray-400/50" />
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Bronz</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-amber-600">
                  {stats.bronze}
                </p>
              </div>
              <Award className="h-6 w-6 text-amber-600/50" />
            </CardContent>
          </Card>
        </div>

        {/* Sponsors Table */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Sponsor Listesi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 skeleton rounded-lg" />
                ))}
              </div>
            ) : sponsors.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Henüz sponsor yok
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Logo
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Sponsor
                      </th>
                      <th className="pb-3 text-center text-xs font-semibold uppercase text-muted-foreground">
                        Tier
                      </th>
                      <th className="pb-3 text-center text-xs font-semibold uppercase text-muted-foreground">
                        Durum
                      </th>
                      <th className="pb-3 text-center text-xs font-semibold uppercase text-muted-foreground">
                        Sıra
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sponsors.map((sponsor, index) => {
                      const tierBadge = tierBadges[sponsor.tier as keyof typeof tierBadges] || tierBadges.bronze;
                      const TierIcon = tierBadge.icon;

                      return (
                        <motion.tr
                          key={sponsor.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border/50"
                        >
                          <td className="py-3">
                            <div className="relative h-10 w-16">
                              <Image
                                src={sponsor.logoUrl}
                                alt={sponsor.name}
                                fill
                                className="rounded object-contain"
                                sizes="64px"
                              />
                            </div>
                          </td>
                          <td className="py-3">
                            <div>
                              <span className="font-semibold">{sponsor.name}</span>
                              {sponsor.websiteUrl && (
                                <a
                                  href={sponsor.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 inline-flex text-muted-foreground hover:text-primary"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            {sponsor.description && (
                              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                {sponsor.description}
                              </p>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            <Badge variant={tierBadge.variant} className="gap-1">
                              <TierIcon className="h-3 w-3" />
                              {tierBadge.label}
                            </Badge>
                          </td>
                          <td className="py-3 text-center">
                            <Badge variant={sponsor.isActive ? "success" : "destructive"}>
                              {sponsor.isActive ? "Aktif" : "Pasif"}
                            </Badge>
                          </td>
                          <td className="py-3 text-center text-muted-foreground">
                            {sponsor.displayOrder}
                          </td>
                          <td className="py-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleActive(sponsor)}
                                title={sponsor.isActive ? "Devre Dışı Bırak" : "Aktifleştir"}
                              >
                                {sponsor.isActive ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(sponsor)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(sponsor.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Sponsor Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Yeni Sponsor Ekle</ModalTitle>
          <ModalDescription>Sponsor bilgilerini girin</ModalDescription>
        </ModalHeader>
        <form action={handleAdd}>
          <ModalBody className="max-h-[60vh] space-y-4 overflow-y-auto">
            {/* Logo Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium">Logo</label>
              {logoUrl ? (
                <div className="relative mb-2 h-20 w-full rounded-lg border border-border bg-card p-2">
                  <Image
                    src={logoUrl}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="absolute right-1 top-1 rounded bg-destructive p-1 text-destructive-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <UploadButton<OurFileRouter, "sponsorLogo">
                  endpoint="sponsorLogo"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      setLogoUrl(res[0].url);
                      toast.success("Logo yüklendi");
                    }
                  }}
                  onUploadError={(error) => {
                    toast.error(`Yükleme hatası: ${error.message}`);
                  }}
                  appearance={{
                    button: "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium",
                    allowedContent: "text-muted-foreground text-xs",
                  }}
                />
              )}
              <Input type="hidden" name="logoUrl" value={logoUrl} />
            </div>

            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Sponsor Adı</label>
                <Input name="name" placeholder="Sponsor adını girin" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Tier</label>
                <select
                  name="tier"
                  defaultValue="bronze"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                  required
                >
                  <option value="gold">Altın</option>
                  <option value="silver">Gümüş</option>
                  <option value="bronze">Bronz</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Açıklama</label>
              <Input name="description" placeholder="Kısa açıklama (opsiyonel)" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Website URL</label>
                <Input name="websiteUrl" type="url" placeholder="https://..." />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Sıralama</label>
                <Input name="displayOrder" type="number" defaultValue="0" min="0" />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="mb-2 block text-sm font-medium">Sosyal Medya</label>
              <div className="space-y-2">
                <Input
                  placeholder="Instagram URL"
                  value={socialLinks.instagram || ""}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                />
                <Input
                  placeholder="Twitter URL"
                  value={socialLinks.twitter || ""}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                />
                <Input
                  placeholder="Discord URL"
                  value={socialLinks.discord || ""}
                  onChange={(e) => setSocialLinks({ ...socialLinks, discord: e.target.value })}
                />
                <Input
                  placeholder="YouTube URL"
                  value={socialLinks.youtube || ""}
                  onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                />
                <Input
                  placeholder="Twitch URL"
                  value={socialLinks.twitch || ""}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitch: e.target.value })}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddModalOpen(false)}
            >
              İptal
            </Button>
            <SubmitButton>Sponsor Ekle</SubmitButton>
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Sponsor Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedSponsor(null);
          resetForm();
        }}
      >
        <ModalHeader>
          <ModalTitle>Sponsoru Düzenle</ModalTitle>
          <ModalDescription>Sponsor bilgilerini güncelleyin</ModalDescription>
        </ModalHeader>
        {selectedSponsor && (
          <form action={handleEdit}>
            <ModalBody className="max-h-[60vh] space-y-4 overflow-y-auto">
              {/* Logo Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium">Logo</label>
                <div className="relative mb-2 h-20 w-full rounded-lg border border-border bg-card p-2">
                  <Image
                    src={logoUrl || selectedSponsor.logoUrl}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <UploadButton<OurFileRouter, "sponsorLogo">
                  endpoint="sponsorLogo"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      setLogoUrl(res[0].url);
                      toast.success("Logo güncellendi");
                    }
                  }}
                  onUploadError={(error) => {
                    toast.error(`Yükleme hatası: ${error.message}`);
                  }}
                  appearance={{
                    button: "bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-lg text-sm font-medium",
                    allowedContent: "text-muted-foreground text-xs",
                  }}
                />
              </div>

              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Sponsor Adı</label>
                  <Input name="name" defaultValue={selectedSponsor.name} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Tier</label>
                  <select
                    name="tier"
                    defaultValue={selectedSponsor.tier}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                    required
                  >
                    <option value="gold">Altın</option>
                    <option value="silver">Gümüş</option>
                    <option value="bronze">Bronz</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Açıklama</label>
                <Input
                  name="description"
                  defaultValue={selectedSponsor.description || ""}
                  placeholder="Kısa açıklama (opsiyonel)"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Website URL</label>
                  <Input
                    name="websiteUrl"
                    type="url"
                    defaultValue={selectedSponsor.websiteUrl || ""}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Sıralama</label>
                  <Input
                    name="displayOrder"
                    type="number"
                    defaultValue={selectedSponsor.displayOrder}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  value="true"
                  defaultChecked={selectedSponsor.isActive}
                  className="h-4 w-4 rounded border-border"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Aktif
                </label>
              </div>

              {/* Social Links */}
              <div>
                <label className="mb-2 block text-sm font-medium">Sosyal Medya</label>
                <div className="space-y-2">
                  <Input
                    placeholder="Instagram URL"
                    value={socialLinks.instagram || ""}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  />
                  <Input
                    placeholder="Twitter URL"
                    value={socialLinks.twitter || ""}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  />
                  <Input
                    placeholder="Discord URL"
                    value={socialLinks.discord || ""}
                    onChange={(e) => setSocialLinks({ ...socialLinks, discord: e.target.value })}
                  />
                  <Input
                    placeholder="YouTube URL"
                    value={socialLinks.youtube || ""}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  />
                  <Input
                    placeholder="Twitch URL"
                    value={socialLinks.twitch || ""}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitch: e.target.value })}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedSponsor(null);
                  resetForm();
                }}
              >
                İptal
              </Button>
              <SubmitButton>Değişiklikleri Kaydet</SubmitButton>
            </ModalFooter>
          </form>
        )}
      </Modal>
    </div>
  );
}
