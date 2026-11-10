import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";
import { siteDescription } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.role}`,
    short_name: site.shortName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#222124",
    theme_color: "#222124",
    lang: "id",
    dir: "ltr",
    categories: ["portfolio", "technology"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
