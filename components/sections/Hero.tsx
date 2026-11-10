import { site } from "@/lib/data/site";
import RevealText from "@/components/motion/RevealText";

export default function Hero() {
  return (
    <section
      data-scene="hero"
      className="relative z-[1] mx-auto flex h-svh w-[90vw] items-center justify-between portrait:flex-col portrait:items-stretch portrait:justify-between portrait:py-[5vw]"
    >
      <RevealText
        as="h1"
        className="t-30 [text-shadow:0_1px_16px_rgba(34,33,36,0.9)]"
        trigger="immediate"
        delay={0.05}
        duration={0.8}
        startVisible
      >
        {site.name}
      </RevealText>
      <RevealText
        as="p"
        className="t-30 text-right [text-shadow:0_1px_16px_rgba(34,33,36,0.9)]"
        trigger="immediate"
        delay={0.2}
        duration={0.8}
        startVisible
      >
        {site.role}
      </RevealText>
    </section>
  );
}
