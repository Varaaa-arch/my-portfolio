import { site } from "@/lib/data/site";
import RevealText from "@/components/motion/RevealText";

export default function Statement() {
  return (
    <section
      data-scene="statement"
      className="relative z-[1] mx-auto flex h-svh w-[90vw] items-center portrait:py-[5vw]"
    >
      <h2 className="sr-only">Tentang saya</h2>
      <div className="relative flex max-w-[41.6667vw] flex-col gap-[1.48148svh] portrait:max-w-full">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-[12%] -inset-y-[10%] bg-[radial-gradient(90%_90%_at_18%_50%,rgba(34,33,36,0.94)_0%,rgba(34,33,36,0.66)_46%,rgba(34,33,36,0)_78%)]"
        />
        <RevealText
          as="p"
          className="t-30 [text-shadow:0_1px_18px_rgba(34,33,36,0.85)]"
          start="top 78%"
        >
          {site.tagline}
        </RevealText>
        <RevealText
          as="p"
          className="t-20 text-muted [text-shadow:0_1px_18px_rgba(34,33,36,0.85)]"
          start="top 80%"
          delay={0.1}
        >
          {site.about.join(" ")}
        </RevealText>
      </div>
    </section>
  );
}
