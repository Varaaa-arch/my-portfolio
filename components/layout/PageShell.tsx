import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/data/site";

const navigation = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[1] mx-auto flex min-h-svh w-[90vw] max-w-[1600px] flex-col">
      <header className="t-16 flex flex-wrap items-center justify-between gap-x-[2rem] gap-y-[0.75rem] py-[2.22222svh] uppercase tracking-[0.08em] text-muted">
        <Link
          href="/"
          className="group flex items-center gap-[0.75rem] text-foreground"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/25 text-[0.7rem] leading-none">
            B
          </span>
          <span className="transition-opacity duration-300 group-hover:opacity-60">
            {site.name}
          </span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="flex flex-wrap items-center gap-x-[1.5rem] gap-y-2"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-300 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-300 hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="t-16 flex flex-wrap items-center justify-between gap-[1rem] border-t border-white/10 py-[2.22222svh] uppercase tracking-[0.08em] text-muted">
        <span>
          {site.name} · © 2026
        </span>
        <Link
          href="/"
          className="transition-colors duration-300 hover:text-foreground"
        >
          Back to home
        </Link>
      </footer>
    </div>
  );
}
