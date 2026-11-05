"use client";

import { site } from "@/lib/data/site";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import RevealText from "@/components/motion/RevealText";

export default function Location() {
  const ref = useScrollProgress<HTMLElement>({
    start: "top bottom",
    end: "center center",
  });

  return (
    <section
      ref={ref}
      className="relative z-[1] flex h-svh items-center justify-center overflow-hidden"
    >
      <div className="scroll-fade pointer-events-none absolute inset-0 flex items-center justify-center text-foreground/25">
        <svg
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
          className="ring-spin absolute h-[76vmin] w-[76vmin]"
        >
          <circle
            cx="200"
            cy="200"
            r="198"
            strokeWidth="0.6"
            strokeOpacity="0.4"
          />
          <circle
            cx="200"
            cy="200"
            r="158"
            strokeWidth="0.6"
            strokeOpacity="0.55"
            strokeDasharray="2 10"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="198"
            ry="82"
            strokeWidth="0.6"
            strokeOpacity="0.5"
          />
          <circle cx="200" cy="2" r="2.5" fill="currentColor" stroke="none" />
        </svg>
        <svg
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
          className="ring-spin-reverse absolute h-[62vmin] w-[62vmin]"
        >
          <circle
            cx="200"
            cy="200"
            r="180"
            strokeWidth="0.6"
            strokeOpacity="0.35"
            strokeDasharray="1 7"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="82"
            ry="198"
            strokeWidth="0.6"
            strokeOpacity="0.4"
            strokeDasharray="4 9"
          />
        </svg>
      </div>
      <p className="t-30 relative z-[1] text-center">
        <RevealText as="span" start="top 80%">
          {site.location}
        </RevealText>
      </p>
    </section>
  );
}
