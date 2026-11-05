import { site } from "@/lib/data/site";
import RevealText from "@/components/motion/RevealText";

export default function Statement() {
  return (
    <section className="relative z-[1] mx-auto flex h-svh w-[90vw] items-center portrait:py-[5vw]">
      <div className="flex max-w-[41.6667vw] flex-col gap-[1.48148svh] portrait:max-w-full">
        <RevealText as="p" className="t-30" start="top 78%">
          {site.tagline}
        </RevealText>
        <RevealText
          as="p"
          className="t-20 text-muted"
          start="top 80%"
          delay={0.1}
        >
          {site.about.join(" ")}
        </RevealText>
      </div>
    </section>
  );
}
