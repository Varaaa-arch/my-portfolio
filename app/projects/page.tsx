import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import {
  createProjectsStructuredData,
  projectsDescription,
} from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Projects",
  description: projectsDescription,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects · ${site.name}`,
    description: projectsDescription,
    url: "/projects",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `Projects · ${site.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects · ${site.name}`,
    description: projectsDescription,
    images: ["/twitter-image"],
  },
};

export default function ProjectsPage() {
  const siteUrl = getSiteUrl();
  const structuredData = createProjectsStructuredData(siteUrl);

  return (
    <>
      <PageShell>
        <section className="pb-[10svh] pt-[7svh]">
          <p className="t-16 uppercase tracking-[0.12em] text-muted">
            Selected Works
          </p>
          <h1 className="mt-[2svh] text-[clamp(3rem,9vw,9rem)] font-medium leading-[0.92] tracking-[-0.035em]">
            Projects
          </h1>
          <p className="mt-[3svh] max-w-[62ch] text-[clamp(1.05rem,1.35vw,1.4rem)] leading-[1.55] text-muted">
            {projectsDescription}
          </p>

          <ul className="mt-[7svh] grid gap-[1.5rem] md:grid-cols-2">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex h-full flex-col justify-between rounded-[2px] border border-white/10 p-[max(1.25rem,2.5vw)] transition-colors duration-300 hover:border-white/30"
                >
                  <div>
                    <div className="t-16 flex items-center justify-between uppercase tracking-[0.12em] text-muted">
                      <span>
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(projects.length).padStart(2, "0")}
                      </span>
                      {project.year ? <span>{project.year}</span> : null}
                    </div>
                    <h2 className="mt-[3svh] text-[clamp(2rem,4.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em] transition-colors duration-300 group-hover:text-accent">
                      {project.title}
                    </h2>
                    <p className="t-20 mt-[2svh] max-w-[42ch] text-muted">
                      {project.tagline}
                    </p>
                  </div>

                  <div className="mt-[4svh]">
                    <ul className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-white/15 px-[0.85em] py-[0.35em] font-mono text-[0.66rem] uppercase tracking-[0.08em] text-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <span className="t-16 mt-[3svh] inline-flex items-center gap-2 uppercase tracking-[0.12em] text-foreground">
                      Lihat detail
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
