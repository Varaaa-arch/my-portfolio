"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollTarget = string | number | HTMLElement;
type LenisScrollOptions = Parameters<Lenis["scrollTo"]>[1];

interface SmoothScrollContextValue {
  scrollTo: (target: ScrollTarget, options?: LenisScrollOptions) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(
  null
);

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);

  if (!context) {
    throw new Error("useSmoothScroll must be used within SmoothScrollProvider");
  }

  return context;
}

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    const syncScrollTrigger = () => ScrollTrigger.update();
    lenis.on("scroll", syncScrollTrigger);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", syncScrollTrigger);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  const scrollTo = useCallback(
    (target: ScrollTarget, options?: LenisScrollOptions) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
        return;
      }

      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "auto" });
        return;
      }

      const element =
        typeof target === "string"
          ? document.querySelector<HTMLElement>(target)
          : target;

      element?.scrollIntoView({ behavior: "auto" });
    },
    []
  );

  const value = useMemo(() => ({ scrollTo }), [scrollTo]);

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
