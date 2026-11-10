"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/lib/data/site";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <main className="mx-auto flex min-h-svh w-[90vw] max-w-[1600px] flex-col justify-center py-[8svh]">
          <p className="t-16 uppercase tracking-[0.12em] text-muted">
            {site.name} / 500
          </p>
          <h1 className="mt-[2svh] max-w-[14ch] text-[clamp(3rem,10vw,10rem)] font-medium leading-[0.86] tracking-[-0.045em]">
            Ada yang tidak sesuai rencana.
          </h1>
          <p className="mt-[4svh] max-w-[54ch] text-[clamp(1rem,1.25vw,1.3rem)] leading-[1.65] text-muted">
            Aplikasi gagal dimuat. Coba muat ulang halaman ini. Kalau masalahnya
            berlanjut, kembali ke beranda.
          </p>
          {error.digest ? (
            <p className="mt-[2svh] font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted/70">
              Ref: {error.digest}
            </p>
          ) : null}
          <div className="mt-[5svh] flex flex-wrap items-center gap-x-[1.75rem] gap-y-3">
            <button
              type="button"
              onClick={reset}
              className="t-16 uppercase tracking-[0.12em] text-foreground"
            >
              Coba lagi
            </button>
            <Link
              href="/"
              className="t-16 uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-foreground"
            >
              Kembali ke beranda
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
