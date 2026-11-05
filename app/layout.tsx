import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import GrainOverlay from "@/components/ui/GrainOverlay";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bizar Octo Givardi — Backend Engineer / Full-Stack Developer",
  description:
    "Portofolio Bizar Octo Givardi, backend engineer dan full-stack developer: backend, API, database, hingga infrastruktur yang siap produksi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${interTight.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
