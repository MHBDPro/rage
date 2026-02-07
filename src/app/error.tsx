"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 grid-bg">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-red-500/10 blur-[100px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-red-500/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10"
        >
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </motion.div>

        <h1 className="mb-2 text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider text-red-400">
          Sistem Hatası
        </h1>
        <p className="mb-6 text-muted-foreground">
          Bir şeyler yanlış gitti. Sistemimiz beklenmeyen bir hatayla karşılaştı.
        </p>

        {error.digest && (
          <Card variant="default" className="mb-6 border-red-500/20">
            <p className="text-xs text-muted-foreground">
              Hata Kimliği: <code className="text-red-400">{error.digest}</code>
            </p>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tekrar Dene
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
