import { site } from "@/lib/data/site";

export default function Footer() {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-[1]">
      <div className="t-16 mx-auto flex w-[90vw] flex-wrap items-center justify-between gap-[1vw] py-[2.22222svh] uppercase tracking-[0.08em] text-muted">
        <div className="flex items-center gap-[0.8vw]">
          <span className="flex h-[2vw] w-[2vw] shrink-0 items-center justify-center rounded-full border border-white/25 text-[0.7rem] leading-none text-foreground portrait:h-7 portrait:w-7">
            B
          </span>
          <span>{site.name} — © 2026</span>
        </div>
        <span>Dibangun dengan Next.js, GSAP &amp; Lenis</span>
      </div>
    </footer>
  );
}
