"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    let rafId = 0;
    let isMounted = true;
    let lenisInstance: { raf: (time: number) => void; destroy: () => void } | null = null;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isCoarsePointer = window.matchMedia("(pointer: coarse)");
    const isSmallViewport = window.matchMedia("(max-width: 1024px)");

    if (prefersReducedMotion.matches || isCoarsePointer.matches || isSmallViewport.matches) {
      return;
    }

    const initLenis = async () => {
      const { default: Lenis } = await import("lenis");
      if (!isMounted) return;

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 1.1,
      });

      lenisInstance = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    };

    void initLenis();

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);

  return null;
}
