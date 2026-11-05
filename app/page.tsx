import { site } from "@/lib/data/site";
import RevealText from "@/components/motion/RevealText";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <RevealText
        as="h1"
        className="t-30 text-foreground"
        trigger="immediate"
        delay={0.2}
      >
        {site.name}
      </RevealText>
      <RevealText
        as="p"
        className="t-20 text-muted"
        trigger="immediate"
        delay={0.5}
      >
        {site.role}
      </RevealText>
    </main>
  );
}
