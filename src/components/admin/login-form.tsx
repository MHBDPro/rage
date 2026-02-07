"use client";

import * as React from "react";
import { useFormStatus, useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAdmin } from "@/lib/actions/auth";
import { siteConfig } from "@/config/site";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending} className="w-full" size="lg">
      {pending ? "Doğrulanıyor..." : "Kontrol Paneline Giriş"}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(loginAdmin, {
    success: false,
    message: "",
  });

  React.useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      router.replace("/admin");
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [router, state.message, state.success]);

  React.useEffect(() => {
    router.prefetch("/admin");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 grid-bg">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]"
          >
            <Shield className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
            {siteConfig.ui.admin.login}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {siteConfig.brand.fullName} {siteConfig.ui.admin.loginSubtitle}
          </p>
        </div>

        {/* Login Card */}
        <Card variant="glass" className="border-primary/20 shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Güvenli Giriş
            </CardTitle>
            <CardDescription>
              Yönetici paneline erişmek için kimlik bilgilerinizi girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium"
                >
                  Kullanıcı Adı
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Kullanıcı adını girin"
                  icon={<User className="h-4 w-4" />}
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Şifre
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Şifrenizi girin"
                  icon={<Lock className="h-4 w-4" />}
                  required
                  autoComplete="current-password"
                />
              </div>

              {state.message && !state.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4" />
                  {state.message}
                </motion.div>
              )}

              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Bu kısıtlı bir alandır. Yetkisiz erişim girişimleri kaydedilir.
        </p>
      </motion.div>
    </div>
  );
}
