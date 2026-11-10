import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import { createAboutStructuredData, aboutDescription } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "About",
  description: aboutDescription,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${site.name}`,
    description: aboutDescription,
    url: "/about",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `About · ${site.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About · ${site.name}`,
    description: aboutDescription,
    images: ["/twitter-image"],
  },
};

const focus = [
  {
    title: "Backend",
    body: "Desain API, model data, autentikasi, dan alur transaksi yang stabil.",
  },
  {
    title: "Full-stack",
    body: "Antarmuka Next.js yang terhubung langsung ke backend dan database.",
  },
  {
    title: "Infrastruktur",
    body: "Docker, deployment, observability, dan operasional yang siap produksi.",
  },
];

const toolbox = Array.from(
  new Set(projects.flatMap((project) => project.stack))
).sort((a, b) => a.localeCompare(b));

export default function AboutPage() {
  const siteUrl = getSiteUrl();
  const structuredData = createAboutStructuredData(siteUrl);

  return (
    <>
      <PageShell>
        <article className="pb-[10svh] pt-[7svh]">
          <p className="t-16 uppercase tracking-[0.12em] text-muted">About</p>
          <h1 className="mt-[2svh] max-w-[16ch] text-[clamp(3rem,9vw,9rem)] font-medium leading-[0.92] tracking-[-0.035em]">
            Tentang {site.name}
          </h1>

          <div className="mt-[7svh] grid gap-[7svh] md:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] md:gap-[6vw]">
            <div>
              <p className="max-w-[52ch] text-[clamp(1.3rem,2vw,2rem)] leading-[1.35]">
                {site.tagline}
              </p>

              <div className="mt-[5svh] space-y-[2.5svh]">
                {site.about.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-[65ch] text-[clamp(1rem,1.15vw,1.3rem)] leading-[1.75] text-foreground/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <blockquote className="mt-[6svh] border-l border-accent pl-[1.5rem]">
                <p className="max-w-[58ch] text-[clamp(1.05rem,1.35vw,1.45rem)] leading-[1.6] text-muted">
                  {site.howIWork}
                </p>
              </blockquote>
            </div>

            <aside className="space-y-[6svh]">
              <section>
                <h2 className="t-16 uppercase tracking-[0.12em] text-muted">
                  Fokus
                </h2>
                <ul className="mt-[2.5svh] space-y-[2.5svh]">
                  {focus.map((item) => (
                    <li key={item.title}>
                      <h3 className="text-[clamp(1.1rem,1.4vw,1.4rem)] font-medium">
                        {item.title}
                      </h3>
                      <p className="mt-1 max-w-[38ch] text-[0.95rem] leading-relaxed text-muted">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="t-16 uppercase tracking-[0.12em] text-muted">
                  Toolbox
                </h2>
                <ul className="mt-[2.5svh] flex flex-wrap gap-2">
                  {toolbox.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white/15 px-[0.85em] py-[0.35em] font-mono text-[0.66rem] uppercase tracking-[0.08em] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="t-16 uppercase tracking-[0.12em] text-muted">
                  Kontak
                </h2>
                <div className="mt-[2.5svh] flex flex-col items-start gap-2">
                  <a
                    href={`mailto:${site.email}`}
                    className="text-[0.95rem] break-all text-foreground transition-colors duration-300 hover:text-accent"
                  >
                    {site.email}
                  </a>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    LinkedIn
                    <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href={site.github}
                    target="_blank"
                    rel="noreferrer"
                    className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    GitHub
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </section>
            </aside>
          </div>

          <section className="mt-[10svh] border-t border-white/10 pt-[5svh]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(1.8rem,3.5vw,3.5rem)] font-medium leading-none tracking-[-0.03em]">
                Selected Works
              </h2>
              <Link
                href="/projects"
                className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-foreground"
              >
                Semua project
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="mt-[4svh] grid gap-[1rem] md:grid-cols-2">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group flex items-center justify-between gap-4 border-b border-white/10 py-[1.2rem] transition-colors duration-300 hover:border-white/30"
                  >
                    <span className="text-[clamp(1.1rem,1.5vw,1.5rem)] transition-colors duration-300 group-hover:text-accent">
                      {project.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-muted transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
