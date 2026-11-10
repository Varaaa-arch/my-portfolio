"use client";

import { useEffect } from "react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export default function Error({
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
    <PageShell>
      <section className="flex min-h-[72svh] flex-col justify-center pb-[10svh] pt-[8svh]">
        <p className="t-16 uppercase tracking-[0.12em] text-muted">
          500 / Terjadi kesalahan
        </p>
        <div className="mt-[2svh] flex flex-wrap items-end justify-between gap-x-[4vw] gap-y-[2rem]">
          <h1 className="max-w-[14ch] text-[clamp(3.5rem,11vw,11rem)] font-medium leading-[0.86] tracking-[-0.045em]">
            Ada yang tidak sesuai rencana.
          </h1>
          <span
            aria-hidden="true"
            className="text-[clamp(5rem,16vw,16rem)] font-medium leading-[0.7] tracking-[-0.06em] text-white/5"
          >
            500
          </span>
        </div>
        <p className="mt-[4svh] max-w-[54ch] text-[clamp(1rem,1.25vw,1.3rem)] leading-[1.65] text-muted">
          Halaman ini gagal dimuat karena masalah di server. Coba muat ulang;
          kalau masih terjadi, kembali ke beranda.
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
            className="t-16 group inline-flex items-center gap-2 uppercase tracking-[0.12em] text-foreground"
          >
            Coba lagi
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-45"
            >
              ↻
            </span>
          </button>
          <Link
            href="/"
            className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-foreground"
          >
            Kembali ke beranda
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
