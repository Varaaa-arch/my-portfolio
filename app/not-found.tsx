import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="flex min-h-[72svh] flex-col justify-center pb-[10svh] pt-[8svh]">
        <p className="t-16 uppercase tracking-[0.12em] text-muted">
          404 / Tidak ditemukan
        </p>
        <div className="mt-[2svh] flex flex-wrap items-end justify-between gap-x-[4vw] gap-y-[2rem]">
          <h1 className="max-w-[14ch] text-[clamp(3.5rem,11vw,11rem)] font-medium leading-[0.86] tracking-[-0.045em]">
            Halaman ini tidak ada.
          </h1>
          <span
            aria-hidden="true"
            className="text-[clamp(5rem,16vw,16rem)] font-medium leading-[0.7] tracking-[-0.06em] text-white/5"
          >
            404
          </span>
        </div>
        <p className="mt-[4svh] max-w-[54ch] text-[clamp(1rem,1.25vw,1.3rem)] leading-[1.65] text-muted">
          Tautan yang kamu buka mungkin sudah dipindahkan atau tidak pernah
          ada. Kembali ke beranda, atau lihat project yang sedang saya
          kerjakan.
        </p>
        <div className="mt-[5svh] flex flex-wrap items-center gap-x-[1.75rem] gap-y-3">
          <Link
            href="/"
            className="t-16 group inline-flex items-center gap-2 uppercase tracking-[0.12em] text-foreground"
          >
            Kembali ke beranda
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="/projects"
            className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-foreground"
          >
            Lihat semua project
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
