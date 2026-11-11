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
import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollTarget = string | number | HTMLElement;
type LenisScrollOptions = Parameters<Lenis["scrollTo"]>[1];

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

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

    const idleWindow = window as IdleWindow;
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;
    let disposed = false;
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    let syncScrollTrigger: (() => void) | null = null;

    const setup = async () => {
      const { default: LenisClass } = await import("lenis");

      if (disposed) {
        return;
      }

      lenis = new LenisClass({
        duration: 1.1,
        smoothWheel: true,
        autoRaf: false,
      });

      lenisRef.current = lenis;

      syncScrollTrigger = () => ScrollTrigger.update();
      lenis.on("scroll", syncScrollTrigger);

      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      if (document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    };

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(() => void setup(), {
        timeout: 1800,
      });
    } else {
      timeoutHandle = window.setTimeout(() => void setup(), 500);
    }

    return () => {
      disposed = true;

      if (idleHandle !== null && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      }

      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }

      if (lenis && syncScrollTrigger) {
        lenis.off("scroll", syncScrollTrigger);
      }

      if (raf) {
        gsap.ticker.remove(raf);
      }

      lenis?.destroy();
      lenis = null;
      lenisRef.current = null;
      raf = null;
      syncScrollTrigger = null;
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
