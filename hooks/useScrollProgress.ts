"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollProgressOptions {
  varName?: string;
  start?: string;
  end?: string;
  pin?: boolean;
  pinSpacing?: boolean;
}

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>({
  varName = "--scroll-progress",
  start = "top bottom",
  end = "bottom top",
  pin = false,
  pinSpacing = true,
}: ScrollProgressOptions = {}) {
  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const setProgress = (value: number) => {
      const progress = Math.min(1, Math.max(0, value));
      element.style.setProperty("--scroll-progress", progress.toFixed(4));

      if (varName !== "--scroll-progress") {
        element.style.setProperty(varName, progress.toFixed(4));
      }
    };

    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    setProgress(0);

    const trigger = ScrollTrigger.create({
      trigger: element,
      start,
      end,
      pin: pin ? element : false,
      pinSpacing,
      onUpdate: (self) => setProgress(self.progress),
      onRefresh: (self) => setProgress(self.progress),
    });

    return () => {
      trigger.kill(true);
    };
  }, [end, pin, pinSpacing, prefersReducedMotion, start, varName]);

  return ref;
}
