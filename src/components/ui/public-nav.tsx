"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { getIcon } from "@/lib/icons";

const MobileNav = dynamic(
  () => import("./mobile-nav").then((module) => module.MobileNav),
  { ssr: false }
);

export function PublicNav() {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [isCompact, setIsCompact] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  const compactRef = React.useRef(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const handleChange = () => {
      const mobile = media.matches;
      setIsMobile(mobile);
      if (mobile) {
        compactRef.current = false;
        setIsCompact(false);
      }
    };

    handleChange();

    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      return;
    }

    const handleScroll = () => {
      const latest = window.scrollY;
      const prev = lastScrollY.current;
      const delta = latest - prev;
      lastScrollY.current = latest;

      if (latest < 12) {
        if (compactRef.current) {
          compactRef.current = false;
          setIsCompact(false);
        }
        return;
      }

      if (delta > 8 && !compactRef.current) {
        compactRef.current = true;
        setIsCompact(true);
        return;
      }

      if (delta < -8 && compactRef.current) {
        compactRef.current = false;
        setIsCompact(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  const isMicroHud = isMobile ? true : isCompact;
  const navAnimateClass = isMobile
    ? isMounted
      ? "opacity-100"
      : "opacity-0"
    : isMounted
      ? "translate-y-0 opacity-100"
      : "-translate-y-10 opacity-0";

  return (
    <>
      <nav
        className={cn(
          "pointer-events-none fixed left-0 right-0 z-50 mx-auto flex justify-center px-4 [top:calc(env(safe-area-inset-top)+3.5rem)] transition duration-300 ease-out motion-reduce:transition-none md:top-4",
          navAnimateClass
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex items-center justify-between rounded-2xl border border-white/10 bg-[#070b12]/92 shadow-[0_8px_28px_rgba(0,0,0,0.38)] transition-[max-width,padding,background-color,border-color,box-shadow] duration-300 ease-out backdrop-blur-none md:backdrop-blur-md",
            isMicroHud
              ? "w-full max-w-[360px] gap-3 px-3 py-2"
              : "w-full max-w-5xl px-5 py-3"
          )}
        >
          <Link href="/" className="group flex items-center gap-3">
            <div
              className={cn(
                "relative overflow-hidden rounded-lg border border-primary/45 bg-black/45 shadow-[0_0_18px_rgba(16,185,129,0.16)] transition-colors group-hover:border-primary/70",
                isMicroHud ? "h-8 w-8" : "h-9 w-9"
              )}
            >
              <Image
                src="/logo.jpg"
                alt={`${siteConfig.brand.name} logo`}
                fill
                className="object-cover"
                priority
                sizes="40px"
              />
            </div>

            <div className={cn("flex flex-col", isMicroHud && "hidden sm:flex")}> 
              <span className="font-[family-name:var(--font-rajdhani)] text-base font-bold uppercase leading-none tracking-wider text-white">
                {siteConfig.brand.fullName}
              </span>
              {!isMicroHud && (
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/80">
                  {siteConfig.brand.tagline}
                </span>
              )}
            </div>
          </Link>

          {!isMicroHud && (
            <div className="hidden items-center gap-1 md:flex">
              {siteConfig.navigation.public.map((item) => {
                const Icon = getIcon(item.icon);
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative px-3 py-1.5"
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-lg border transition-colors",
                        isActive
                          ? "border-primary/20 bg-primary/10"
                          : "border-transparent group-hover:border-white/10"
                      )}
                    />
                    <span
                      className={cn(
                        "relative z-10 flex items-center gap-2 font-[family-name:var(--font-rajdhani)] text-sm font-medium uppercase tracking-wide transition-colors",
                        isActive ? "text-primary" : "text-gray-400 group-hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setIsMobileNavOpen(true)}
            className={cn(
              "rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-white",
              isMicroHud ? "md:flex" : "md:hidden"
            )}
            aria-label="Menüyü aç"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {isMobileNavOpen ? (
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
      ) : null}
    </>
  );
}
