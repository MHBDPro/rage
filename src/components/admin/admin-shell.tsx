"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { getIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface AdminShellProps {
  username: string;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}

const actionMap = [
  { match: "/admin/news", label: "Yeni Blog", href: "/admin/news?new=1" },
  { match: "/admin/scrims/templates", label: "Yeni Şablon", href: "/admin/scrims/templates?new=1" },
  { match: "/admin/scrims", label: "Yeni Oturum", href: "/admin/scrims?new=1" },
  { match: "/admin/sponsors", label: "Yeni Sponsor", href: "/admin/sponsors?new=1" },
  {
    match: "/admin/leaderboard",
    label: siteConfig.ui.leaderboard.createLabel,
    href: "/admin/leaderboard?new=1",
  },
];

export function AdminShell({ username, logoutAction, children }: AdminShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const activeNav = siteConfig.navigation.admin.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  const pageTitle = activeNav?.label || siteConfig.ui.admin.dashboard;
  const action = actionMap.find((item) => pathname.startsWith(item.match));

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:flex-col md:border-r md:border-border/40 md:bg-[#0a0b14]/90 md:backdrop-blur-xl md:transition-all",
          isCollapsed ? "md:w-20" : "md:w-64"
        )}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-primary/40 bg-primary/10">
              <Image
                src="/logo.jpg"
                alt={`${siteConfig.brand.name} logo`}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                  Yönetim Merkezi
                </p>
                <p className="text-sm font-bold uppercase tracking-wider text-primary">
                  {siteConfig.brand.name}
                </p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:text-white"
            aria-label="Yan menüyü aç veya kapat"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-2">
          {siteConfig.navigation.admin.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold uppercase tracking-wider transition",
                  isActive
                    ? "bg-primary/15 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.25)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-3 pb-4">
          {!isCollapsed && (
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/30">
              {username}
            </p>
          )}
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className={cn("w-full", isCollapsed && "px-0")}
            >
              {!isCollapsed ? siteConfig.ui.admin.logout : "⟲"}
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Column */}
      <div className={cn("flex min-h-screen flex-col", isCollapsed ? "md:pl-20" : "md:pl-64")}>
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-white/10 bg-[#0a0b14]/90 px-3 backdrop-blur-xl md:hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/70"
            aria-label="Yönetim menüsünü aç"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            {pageTitle}
          </span>

          {action ? (
            <Link
              href={action.href}
              className="flex h-10 items-center rounded-lg border border-primary/40 bg-primary/10 px-3 text-[10px] font-bold uppercase tracking-[0.3em] text-primary"
            >
              {action.label}
            </Link>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>

        <main className="flex-1 px-4 pb-10 pt-6 md:px-8 md:pt-8">
          {children}
        </main>
      </div>

      {/* Mobile Grid Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-[55] flex flex-col px-4 pb-8 pt-6"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/10">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                      Hızlı Panel
                    </p>
                    <p className="text-sm font-bold uppercase tracking-wider text-white">
                      {pageTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/70"
                  aria-label="Yönetim menüsünü kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid flex-1 grid-cols-2 gap-4">
                {siteConfig.navigation.admin.map((item) => {
                  const Icon = getIcon(item.icon);
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex min-h-[80px] flex-col items-start justify-between rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-semibold uppercase tracking-wider transition",
                        isActive
                          ? "border-primary/60 text-primary shadow-[0_0_25px_rgba(var(--primary-rgb),0.35)]"
                          : "text-white/70 hover:border-primary/40 hover:text-white"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Operatör
                  </p>
                  <p className="text-sm font-semibold text-white/70">{username}</p>
                </div>
                <form action={logoutAction}>
                  <Button type="submit" variant="outline" size="sm">
                    {siteConfig.ui.admin.logout}
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
