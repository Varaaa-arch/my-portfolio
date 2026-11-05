import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "jelajahin",
    title: "Jelajahin",
    tagline: "Aplikasi pemesanan tiket pesawat",
    description: ["Aplikasi pemesanan tiket pesawat."],
    stack: ["Laravel", "Go", "PostgreSQL", "Docker"],
  },
  {
    slug: "kasa-pos",
    title: "Kasa-POS",
    tagline: "Sistem POS lokal dengan cetak struk thermal",
    description: [
      "Sistem POS lokal yang menghubungkan checkout web, transaksi atomik di database, dan cetak struk thermal via Print Agent.",
    ],
    stack: ["Go", "Next.js", "PostgreSQL", "ESC/POS"],
  },
  {
    slug: "infraforge",
    title: "InfraForge",
    tagline: "Platform DevOps self-hosted open source",
    description: [
      "Platform DevOps self-hosted open source untuk membangun, mendeploy, memonitor, dan mengelola aplikasi dari satu dashboard terpusat.",
    ],
    stack: [
      "Python (FastAPI)",
      "React (TS)",
      "Redis",
      "Traefik",
      "Docker",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
      "Loki",
      "MinIO",
    ],
  },
  {
    slug: "baut-store",
    title: "baut-store",
    tagline: "E-commerce baut, mur, dan aksesoris konstruksi",
    description: [
      "E-commerce untuk produk baut, mur, dan aksesoris konstruksi.",
    ],
    stack: ["Next.js 16", "Prisma", "MySQL"],
  },
];
