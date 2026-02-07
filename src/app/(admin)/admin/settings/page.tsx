"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Megaphone,
  Save,
  CheckCircle,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getScrimSettings } from "@/lib/actions/scrim";
import { updateSettings } from "@/lib/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="w-full sm:w-auto">
      <Save className="mr-2 h-4 w-4" />
      {pending ? "Kaydediliyor..." : "Ayarları Kaydet"}
    </Button>
  );
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  // Controlled form state - tüm alanlar burada yönetiliyor
  const [formValues, setFormValues] = React.useState({
    isMaintenance: false,
    announcement: "",
  });

  const loadSettings = React.useCallback(async () => {
    const data = await getScrimSettings();
    setFormValues({
      isMaintenance: data.isMaintenance,
      announcement: data.announcement || "",
    });
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSubmit = async (formData: FormData) => {
    // Form değerlerini state'den al (controlled component)
    formData.set("isMaintenance", formValues.isMaintenance.toString());
    formData.set("announcement", formValues.announcement);

    const result = await updateSettings(null, formData);
    if (result.success) {
      toast.success(result.message);
      // Başarılı kayıt sonrası sunucudan yeniden yükle
      await loadSettings();
    } else {
      toast.error(result.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="h-96 skeleton rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
            Ayarlar
          </h1>
          <p className="text-muted-foreground">
            Turnuva kayıt ayarlarını yapılandırın
          </p>
        </div>

        <form action={handleSubmit}>
          {/* Maintenance Mode */}
          <Card
            variant="glass"
            className={`mb-6 ${
              formValues.isMaintenance ? "border-yellow-500/30" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle
                  className={`h-5 w-5 ${
                    formValues.isMaintenance ? "text-yellow-500" : "text-primary"
                  }`}
                />
                Bakım Modu
              </CardTitle>
              <CardDescription>
                Slot kaydını geçici olarak devre dışı bırakın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">
                    Etkinleştirildiğinde, kullanıcılar slot için kayıt olamazlar.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bakım sırasında veya turnuvalar çalışmadığında kullanın.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormValues(prev => ({ ...prev, isMaintenance: !prev.isMaintenance }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formValues.isMaintenance ? "bg-yellow-500" : "bg-secondary"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formValues.isMaintenance ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {formValues.isMaintenance && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-yellow-400">
                    Bakım modu şu anda aktif
                  </span>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Announcement */}
          <Card variant="glass" className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Duyuru
              </CardTitle>
              <CardDescription>
                Ana sayfada bir mesaj görüntüleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                name="announcement"
                value={formValues.announcement}
                onChange={(e) => setFormValues(prev => ({ ...prev, announcement: e.target.value }))}
                placeholder="Bir duyuru mesajı girin (isteğe bağlı)"
                rows={3}
                className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                maxLength={500}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Duyuru {"banner'ını"} gizlemek için boş bırakın. Maksimum 500 karakter.
              </p>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card variant="default" className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Mevcut Durum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2">
                  <span className="text-sm">Bakım</span>
                  <Badge
                    variant={formValues.isMaintenance ? "warning" : "success"}
                  >
                    {formValues.isMaintenance ? "Aktif" : "İnaktif"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2">
                  <span className="text-sm">Duyuru</span>
                  <Badge variant={formValues.announcement ? "default" : "secondary"}>
                    {formValues.announcement ? "Ayarlı" : "Yok"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>

        {/* Rules & Point System Link */}
        <Card variant="glass" className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Kurallar & Puan Sistemi
            </CardTitle>
            <CardDescription>
              Kurallar sayfasındaki içerikleri düzenleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/rules">
              <Button variant="outline" className="w-full sm:w-auto">
                Kuralları Düzenle
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
