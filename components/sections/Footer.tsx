import Link from "next/link";
import { site } from "@/lib/data/site";

export default function Footer() {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-[1]">
      <div className="t-16 mx-auto flex w-[90vw] flex-wrap items-center justify-between gap-x-[1.5rem] gap-y-[0.75rem] py-[2.22222svh] uppercase tracking-[0.08em] text-muted">
        <div className="flex items-center gap-[0.8vw]">
          <span className="flex h-[2vw] w-[2vw] shrink-0 items-center justify-center rounded-full border border-white/25 text-[0.7rem] leading-none text-foreground portrait:h-7 portrait:w-7">
            B
          </span>
          <span>{site.name} · © 2026</span>
        </div>
        <nav
          aria-label="Navigasi footer"
          className="flex flex-wrap items-center gap-x-[1.2rem] gap-y-2"
        >
          <Link
            href="/projects"
            className="transition-colors duration-300 hover:text-foreground"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="transition-colors duration-300 hover:text-foreground"
          >
            About
          </Link>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-300 hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
        <span>Dibangun dengan Next.js, GSAP &amp; Lenis</span>
      </div>
    </footer>
  );
}
