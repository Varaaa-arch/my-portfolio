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
    <section
      ref={ref}
      data-scene="howiwork"
      className="relative z-[1] h-[210svh]"
    >
      <h2 className="sr-only">Cara saya bekerja</h2>
      <div className="pointer-events-none fixed inset-0 flex items-center justify-end">
        <div
          aria-hidden="true"
          className="scroll-fade pointer-events-none absolute inset-0 bg-[radial-gradient(62%_62%_at_100%_50%,rgba(34,33,36,0.94)_0%,rgba(34,33,36,0.58)_52%,rgba(34,33,36,0)_82%)]"
        />
        <p className="t-30 scroll-fade relative mr-[5vw] max-w-[41.6667vw] text-right [text-shadow:0_1px_20px_rgba(34,33,36,0.9)] portrait:max-w-full">
          {site.howIWork}
        </p>
      </div>
    </section>
  );
}
