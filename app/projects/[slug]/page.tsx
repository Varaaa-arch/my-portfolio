import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import { createProjectStructuredData } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  const description = `${project.tagline}. ${project.description.join(" ")}`;

  return {
    title: project.title,
    description,
    keywords: [...project.stack, project.title, site.name],
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      locale: "id_ID",
      url: `/projects/${project.slug}`,
      title: `${project.title} · ${site.name}`,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${project.title} · ${site.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · ${site.name}`,
      description,
      images: [
        {
          url: "/twitter-image",
          alt: `${project.title} · ${site.name}`,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const structuredData = createProjectStructuredData(project, siteUrl);
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <PageShell>
        <article className="pb-[8svh] pt-[7svh]">
          <Link
            href="/projects"
            className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-foreground"
          >
            <span aria-hidden="true">←</span>
            Semua project
          </Link>

          <header className="mt-[5svh] border-b border-white/10 pb-[6svh]">
            <div className="t-16 flex flex-wrap items-center justify-between gap-3 uppercase tracking-[0.12em] text-muted">
              {project.year ? <span>{project.year}</span> : null}
              <span className="ml-auto">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <h1 className="mt-[2svh] max-w-[18ch] text-[clamp(3rem,9vw,9rem)] font-medium leading-[0.92] tracking-[-0.035em]">
              {project.title}
            </h1>
            <p className="mt-[3svh] max-w-[58ch] text-[clamp(1.15rem,1.6vw,1.6rem)] leading-[1.4] text-muted">
              {project.tagline}
            </p>
          </header>

          <div className="grid gap-[6svh] pt-[6svh] md:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)] md:gap-[5vw]">
            <div>
              <h2 className="sr-only">Ringkasan project</h2>
              <div className="space-y-[2.2svh]">
                {project.description.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[clamp(1rem,1.15vw,1.3rem)] leading-[1.75] text-foreground/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {project.video ? (
                <div className="mt-[5svh] overflow-hidden rounded-[2px] border border-white/10 bg-black">
                  <video
                    src={project.video}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-auto w-full"
                  />
                </div>
              ) : project.image ? (
                <div className="relative mt-[5svh] aspect-[16/10] overflow-hidden rounded-[2px] border border-white/10">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 70vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>

            <aside className="space-y-[4svh]">
              <section>
                <h2 className="t-16 uppercase tracking-[0.12em] text-muted">
                  Stack
                </h2>
                <ul className="mt-[2svh] flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white/15 px-[0.85em] py-[0.35em] font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                {project.stackNote ? (
                  <p className="mt-[2svh] text-[0.95rem] leading-relaxed text-muted">
                    {project.stackNote}
                  </p>
                ) : null}
              </section>

              <section>
                <h2 className="t-16 uppercase tracking-[0.12em] text-muted">
                  Tautan
                </h2>
                <div className="mt-[2svh] flex flex-col items-start gap-2">
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-foreground transition-colors duration-300 hover:text-accent"
                    >
                      Situs proyek
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {project.repo ? (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-foreground transition-colors duration-300 hover:text-accent"
                    >
                      Repository
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  <Link
                    href="/projects"
                    className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    Semua project
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </section>

              <section>
                <h2 className="t-16 uppercase tracking-[0.12em] text-muted">
                  Dibuat oleh
                </h2>
                <p className="mt-[2svh] text-[0.95rem] leading-relaxed text-muted">
                  {site.name}, {site.role}.
                </p>
                <Link
                  href="/about"
                  className="t-16 mt-[1.5svh] inline-flex items-center gap-2 uppercase tracking-[0.12em] text-foreground transition-colors duration-300 hover:text-accent"
                >
                  Tentang saya
                  <span aria-hidden="true">→</span>
                </Link>
              </section>
            </aside>
          </div>

          <nav
            aria-label="Project berikutnya"
            className="mt-[10svh] border-t border-white/10 pt-[4svh]"
          >
            <p className="t-16 uppercase tracking-[0.12em] text-muted">
              Project berikutnya
            </p>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group mt-[2svh] flex items-end justify-between gap-4"
            >
              <span className="text-[clamp(2rem,5vw,5rem)] font-medium leading-[0.95] tracking-[-0.03em] transition-colors duration-300 group-hover:text-accent">
                {nextProject.title}
              </span>
              <span
                aria-hidden="true"
                className="mb-2 text-[clamp(1.5rem,3vw,3rem)] transition-transform duration-300 group-hover:translate-x-2"
              >
                →
              </span>
            </Link>
          </nav>
        </article>
      </PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
