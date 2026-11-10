import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursorLoader from "@/components/ui/CustomCursorLoader";
import ParticleSceneLoader from "@/components/particles/ParticleSceneLoader";
import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import { site } from "@/lib/data/site";
import {
  createStructuredData,
  siteDescription,
  siteKeywords,
  siteTitle,
} from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const structuredData = createStructuredData(siteUrl);

const verification: NonNullable<Metadata["verification"]> = {};

if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()) {
  verification.google =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.trim();
}

if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim()) {
  verification.other = {
    "msvalidate.01":
      process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION.trim(),
  };
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s · ${site.name}`,
  },
  description: siteDescription,
  applicationName: `Portofolio ${site.name}`,
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  keywords: siteKeywords,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification,
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: site.name,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  appleWebApp: {
    capable: true,
    title: site.shortName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#222124",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      dir="ltr"
      className={`${interTight.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-background"
        >
          Langsung ke konten
        </a>
        <SmoothScrollProvider>
          <GrainOverlay />
          <ParticleSceneLoader />
          {children}
          <CustomCursorLoader />
        </SmoothScrollProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
