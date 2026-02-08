"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Zap, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { getIcon } from "@/lib/icons";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const quickLinks = [
    { href: "/fast-cup", label: "Fast Cup", icon: Zap },
    { href: "/login", label: siteConfig.ui.admin.login, icon: LogIn },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[55] bg-black/70 transition-opacity duration-200 ease-out motion-reduce:transition-none",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[60] mx-auto w-full max-w-md px-4 pb-4 transition-transform duration-200 ease-out motion-reduce:transition-none",
          isOpen ? "pointer-events-auto translate-y-0" : "pointer-events-none translate-y-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
      >
        <div className="rounded-t-3xl border border-white/10 bg-[#0a0b14] shadow-[0_-14px_42px_rgba(0,0,0,0.48)]">
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-primary/30 bg-primary/10">
                <Image
                  src="/logo.jpg"
                  alt={`${siteConfig.brand.name} logo`}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Hızlı Menü
                </p>
                <p className="text-sm font-bold uppercase tracking-wider text-primary">
                  {siteConfig.brand.fullName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:text-white"
              aria-label="Menüyü kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 pb-5 pt-4">
            <div className="grid grid-cols-2 gap-3">
              {siteConfig.navigation.public.map((item) => {
                const Icon = getIcon(item.icon);
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/5 bg-black/40 px-4 text-sm font-semibold uppercase tracking-wider transition",
                      isActive
                        ? "border-primary/50 text-primary shadow-[0_0_14px_rgba(var(--primary-rgb),0.2)]"
                        : "text-white/70 hover:border-primary/30 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                Hızlı Erişim
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary/10 text-sm font-bold uppercase tracking-wider text-primary transition hover:bg-primary/20"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
