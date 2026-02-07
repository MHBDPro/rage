"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { siteConfig } from "@/config/site";
import { getIcon } from "@/lib/icons";

export function PublicNav() {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const [isCompact, setIsCompact] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);
  const isMobileRef = React.useRef(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const handleChange = () => {
      setIsMobile(media.matches);
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
    isMobileRef.current = isMobile;
  }, [isMobile]);

  // Scroll-aware HUD behavior
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isMobileRef.current) {
      return;
    }
    const prev = lastScrollY.current;
    const delta = latest - prev;
    lastScrollY.current = latest;

    setIsCompact((current) => {
      if (latest < 12) {
        return false;
      }

      if (delta > 8) {
        return true;
      }
      if (delta < -8) {
        return false;
      }
      return current;
    });
  });

  const isMicroHud = isMobile ? true : isCompact;
  const navInitial = reduceMotion
    ? false
    : isMobile
      ? { opacity: 0 }
      : { y: -40, opacity: 0 };
  const navAnimate = isMobile ? { opacity: 1 } : { y: 0, opacity: 1 };
  const navTransition: Transition =
    reduceMotion || isMobile
      ? { duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }
      : { type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] };

  return (
    <>
      {/*
        Keep a lightweight fade on mobile to avoid jank,
        and a slightly richer entrance on desktop.
      */}
      <motion.nav
        className="pointer-events-none fixed left-0 right-0 top-10 z-50 mx-auto flex justify-center px-4 transform-gpu"
        style={{ willChange: "transform, opacity" }}
        initial={navInitial}
        animate={navAnimate}
        transition={navTransition}
      >
        <motion.div
          className={cn(
            "pointer-events-auto flex items-center justify-between rounded-2xl border border-white/10 bg-[#0a0b14]/90 shadow-lg transition-[max-width,padding] duration-300 ease-out backdrop-blur-none md:backdrop-blur-xl",
            isMicroHud
              ? "w-full max-w-[360px] gap-3 px-3 py-2"
              : "w-full max-w-5xl px-5 py-3"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className={cn(
                "relative overflow-hidden rounded-lg border border-primary/30 bg-primary/5 transition-colors group-hover:border-primary/60 group-hover:bg-primary/20",
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
            </motion.div>

            <motion.div className={cn("flex flex-col", isMicroHud && "hidden sm:flex")}>
              <span className="font-[family-name:var(--font-rajdhani)] text-base font-bold uppercase leading-none tracking-wider text-white">
                {siteConfig.brand.name}
              </span>
              {!isMicroHud && (
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/80">
                  {siteConfig.brand.tagline}
                </span>
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          {!isMicroHud && (
            <div className="hidden items-center gap-1 md:flex">
              {siteConfig.navigation.public.map((item) => {
                const Icon = getIcon(item.icon);
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-3 py-1.5 group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10 flex items-center gap-2 text-sm font-medium transition-colors font-[family-name:var(--font-rajdhani)] uppercase tracking-wide",
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

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className={cn(
              "rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-white",
              isMicroHud ? "md:flex" : "md:hidden"
            )}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </motion.div>
      </motion.nav>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
