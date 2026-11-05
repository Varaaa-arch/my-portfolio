import { site } from "@/lib/data/site";
import RevealText from "@/components/motion/RevealText";

export default function Hero() {
  return (
    <section className="relative z-[1] mx-auto flex h-svh w-[90vw] items-center justify-between portrait:flex-col portrait:items-stretch portrait:justify-between portrait:py-[5vw]">
      <RevealText as="h1" className="t-30" trigger="immediate" delay={0.15}>
        {site.name}
      </RevealText>
      <RevealText
        as="p"
        className="t-30 text-right"
        trigger="immediate"
        delay={0.55}
      >
        {site.role}
      </RevealText>
    </section>
  );
}
