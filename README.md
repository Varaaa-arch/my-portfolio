# zarrgvrd · Portfolio

Personal portfolio built with Next.js 16, Three.js, GSAP, and Lenis.

---

## Stack

| Layer | Library / Tool |
|---|---|
| Framework | Next.js 16.4 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| 3D / Particles | Three.js 0.187 |
| Animation | GSAP 3.15, Lenis 1.3 |
| Image processing | Sharp 0.35 |
| Package manager | pnpm 10 |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10

### Install dependencies

```bash
pnpm install
```

### Environment variables

Copy `.env.example` ke `.env.local` lalu isi nilainya:

```bash
cp .env.example .env.local
```

| Variable | Keterangan |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL produksi tanpa trailing slash, contoh: `https://zarrgvrd.vercel.app` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Content value dari meta tag Google Search Console (opsional) |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Content value dari meta tag Bing Webmaster Tools (opsional) |

### Build particle assets

Particle scene membutuhkan binary asset yang di-generate dari `assets/portrait-source.png` dan `assets/indonesia.geojson`. Jalankan sekali sebelum dev/build pertama kali, atau setiap kali source asset berubah:

```bash
pnpm assets
```

Output akan ditulis ke `public/particles/`.

### Run development server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Build production

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
app/                   # Routes (Next.js App Router)
  layout.tsx           # Root layout, metadata, fonts
  page.tsx             # Homepage
  about/               # /about
  projects/            # /projects
    [slug]/            # /projects/:slug
components/
  layout/              # PageShell
  motion/              # RevealText, SmoothScrollProvider
  particles/           # Three.js particle scene
  sections/            # Hero, Works, Footer, dll
  ui/                  # CustomCursor, ParticleLink, GrainOverlay
lib/
  data/
    site.ts            # Konfigurasi situs (nama, link sosial, dll)
    projects.ts        # Daftar project portfolio
    experience.ts      # Data pengalaman kerja
  particles/           # Shader, formations, parser binary
  seo.ts               # Helpers metadata & structured data
  types.ts             # TypeScript interfaces
assets/
  portrait-source.png  # Source gambar untuk particle portrait
  indonesia.geojson    # Source peta untuk particle globe
public/
  particles/           # Binary particle assets (generated)
  icons/               # PWA icons
scripts/
  build-particle-assets.mjs  # Script generate particle binary
```

---

## Adding a Project

Edit `lib/data/projects.ts`, tambah entry baru ke array `projects`:

```ts
{
  slug: "nama-project",        // dipakai sebagai URL /projects/nama-project
  title: "Nama Project",
  tagline: "Deskripsi singkat",
  description: ["Paragraf deskripsi lengkap."],
  stack: ["Next.js", "PostgreSQL"],
  year: "2026",                // opsional
  href: "https://...",         // opsional, link live
  repo: "https://github.com/...", // opsional, link repo
}
```

---

## Deploy

### Vercel (recommended)

1. Push repo ke GitHub
2. Import di [vercel.com/new](https://vercel.com/new)
3. Set environment variables di dashboard Vercel (sama seperti `.env.local`)
4. Deploy. Vercel akan otomatis deteksi Next.js

> `pnpm assets` perlu dijalankan sebagai bagian dari build. Tambahkan ke build command di Vercel jika belum:
> ```
> pnpm assets && pnpm build
> ```

### Self-hosted

```bash
pnpm assets
pnpm build
pnpm start        # default port 3000
```

Atau pakai PM2:

```bash
pm2 start "pnpm start" --name portfolio
```

---

## License

MIT
