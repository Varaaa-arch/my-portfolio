import { site } from "@/lib/data/site";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="t-30 text-foreground">{site.name}</h1>
      <p className="t-20 text-muted">{site.role}</p>
    </main>
  );
}
