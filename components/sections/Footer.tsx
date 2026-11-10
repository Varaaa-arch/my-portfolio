import Link from "next/link";
import { site } from "@/lib/data/site";

export default function Footer() {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-[1]">
      <div className="t-16 relative mx-auto flex w-[90vw] items-center justify-between gap-x-[1.5rem] gap-y-[0.75rem] py-[2.22222svh] uppercase tracking-[0.08em] text-muted">
        <div className="flex items-center gap-[0.8vw]">
          <span className="flex h-[2vw] w-[2vw] shrink-0 items-center justify-center rounded-full border border-white/25 text-[0.7rem] leading-none text-foreground portrait:h-7 portrait:w-7">
            B
          </span>
          <span>{site.name} · © 2026</span>
        </div>

        <nav
          aria-label="Navigasi footer"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-x-[1.2rem]"
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

        <div className="flex items-center gap-[1rem]">
          {site.instagram && (
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors duration-300 hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          )}
          {site.twitter && (
            <a
              href={site.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="X / Twitter"
              className="transition-colors duration-300 hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
