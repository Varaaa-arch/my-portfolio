"use client";

import { site } from "@/lib/data/site";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const fadeMapping = (progress: number) =>
  Math.min(1, progress / 0.12, (1 - progress) / 0.12);

export default function HowIWork() {
  const ref = useScrollProgress<HTMLElement>({
    varName: "--work-ready",
    start: "top bottom",
    end: "bottom top",
    map: fadeMapping,
  });

  return (
    <section ref={ref} className="relative z-[1] h-[210svh]">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-end">
        <p className="t-30 scroll-fade mr-[5vw] max-w-[41.6667vw] text-right portrait:max-w-full">
          {site.howIWork}
        </p>
      </div>
    </section>
  );
}
