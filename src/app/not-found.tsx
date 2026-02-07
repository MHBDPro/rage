"use client";

import { motion } from "framer-motion";
import { Ghost, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 grid-bg">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
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
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10"
        >
          <Ghost className="h-12 w-12 text-primary" />
        </motion.div>

        <h1 className="mb-2 text-6xl font-bold font-[family-name:var(--font-rajdhani)] text-primary">
          404
        </h1>
        <h2 className="mb-2 text-2xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
          Sayfa Bulunamadı
        </h2>
        <p className="mb-8 text-muted-foreground">
          Aradığınız sayfa mevcut değil veya taşınmış.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="default" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
        </div>

        {/* Decorative grid lines */}
        <div className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 0.5 }}
            className="h-64 w-64 rounded-full border border-primary/30"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.7 }}
            className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30"
          />
        </div>
      </motion.div>
    </div>
  );
}
