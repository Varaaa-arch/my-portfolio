import { site } from "@/lib/data/site";
import RevealText from "@/components/motion/RevealText";
import ParticleLink from "@/components/ui/ParticleLink";

export default function Contacts() {
  return (
    <section className="relative z-[1] mx-auto flex h-svh w-[90vw] flex-col items-center justify-center text-center">
      <h2 className="sr-only">Kontak</h2>
      <RevealText
        as="p"
        className="t-16 uppercase tracking-[0.08em] text-muted"
        start="top 80%"
      >
        Get in touch
      </RevealText>
      <ParticleLink
        href={`mailto:${site.email}`}
        className="t-email mt-[2svh] font-medium"
      >
        {site.email}
      </ParticleLink>
      <p className="t-20 mt-[2svh] text-muted">
        atau terhubung lewat{" "}
        <ParticleLink
          href={site.linkedin}
          external
          className="t-20 text-foreground underline underline-offset-4"
        >
          LinkedIn
        </ParticleLink>
      </p>
    </section>
  );
}
