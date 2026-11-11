import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import type { Project } from "@/lib/types";

export const siteTitle =
  "Bizar Octo Givardi · Backend Engineer / Full-Stack Developer";

export const siteDescription =
  "Backend engineer dan full-stack developer berbasis di Indonesia. Portofolio Go, Laravel, Next.js, PostgreSQL, Docker, dan infrastruktur siap produksi.";

export const projectsDescription = `Kumpulan proyek backend, full-stack, dan DevOps ${site.name}: ${projects
  .map((project) => project.title)
  .join(", ")}.`;

export function getProjectDescription(project: Project) {
  return Array.from(
    new Set(
      [project.tagline, ...project.description]
        .map((part) => part.trim())
        .filter(Boolean)
    )
  ).join(" ");
}

export const aboutDescription =
  `Kenali lebih jauh ${site.name}, backend engineer dan full-stack developer berbasis di Indonesia. Fokus pada sistem produksi, arsitektur API, dan infrastruktur yang andal.`;

export const siteKeywords = [
  "Bizar Octo Givardi",
  "backend engineer Indonesia",
  "full-stack developer Indonesia",
  "jasa backend",
  "developer Go",
  "developer Laravel",
  "Next.js developer",
  "PostgreSQL",
  "Docker",
  "DevOps",
  "portofolio developer",
];

export function createStructuredData(siteUrl: string) {
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const profilePageId = `${siteUrl}/#profilepage`;
  const projectsId = `${siteUrl}/#projects`;
  const ogImage = `${siteUrl}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: ["Bizar", "zarrgvrd"],
        description: `${site.role}, ${site.location}.`,
        url: siteUrl,
        image: ogImage,
        email: `mailto:${site.email}`,
        jobTitle: site.role,
        knowsAbout: [
          "Backend Engineering",
          "Full-Stack Development",
          "DevOps",
          "Go",
          "Laravel",
          "Next.js",
          "PostgreSQL",
          "Docker",
        ],
        knowsLanguage: ["id", "en"],
        sameAs: [site.linkedin, site.github, site.instagram, site.twitter],
        address: {
          "@type": "PostalAddress",
          addressCountry: "ID",
        },
        hasOccupation: {
          "@type": "Occupation",
          name: site.role,
          occupationLocation: {
            "@type": "Country",
            name: "Indonesia",
          },
          skills:
            "Go, Laravel, Next.js, PostgreSQL, Docker, DevOps, backend architecture",
        },
        mainEntityOfPage: { "@id": profilePageId },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: site.name,
        alternateName: "zarrgvrd",
        description: siteDescription,
        inLanguage: "id-ID",
        publisher: { "@id": personId },
        author: { "@id": personId },
        copyrightYear: 2026,
        copyrightHolder: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        url: siteUrl,
        name: siteTitle,
        description: siteDescription,
        inLanguage: "id-ID",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        dateModified: new Date().toISOString(),
      },
      {
        "@type": "ItemList",
        "@id": projectsId,
        name: "Selected Works",
        description:
          "Proyek backend dan full-stack yang dikerjakan oleh Bizar Octo Givardi.",
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => {
          const projectUrl = `${siteUrl}/projects/${project.slug}`;

          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "CreativeWork",
              "@id": `${projectUrl}/#project`,
              name: project.title,
              description: `${project.tagline}. ${project.description.join(" ")}`,
              keywords: project.stack.join(", "),
              creator: { "@id": personId },
              inLanguage: "id-ID",
              url: projectUrl,
              mainEntityOfPage: projectUrl,
              ...(project.href ? { sameAs: project.href } : {}),
              ...(project.repo ? { codeRepository: project.repo } : {}),
              ...(project.image
                ? { image: new URL(project.image, siteUrl).toString() }
                : {}),
            },
          };
        }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
        ],
      },
    ],
  };
}

export function createProjectsStructuredData(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/projects/#collectionpage`,
        url: `${siteUrl}/projects`,
        name: `Projects ${site.name}`,
        description: projectsDescription,
        inLanguage: "id-ID",
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.title,
            url: `${siteUrl}/projects/${project.slug}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/projects/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${siteUrl}/projects`,
          },
        ],
      },
    ],
  };
}

export function createAboutStructuredData(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about/#aboutpage`,
    url: `${siteUrl}/about`,
    name: `Tentang ${site.name}`,
    description: siteDescription,
    inLanguage: "id-ID",
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: { "@id": `${siteUrl}/#person` },
  };
}

export function createProjectStructuredData(
  project: Project,
  siteUrl: string
) {
  const projectUrl = `${siteUrl}/projects/${project.slug}`;
  const description = `${project.tagline}. ${project.description.join(" ")}`;
  const image = project.image
    ? new URL(project.image, siteUrl).toString()
    : `${siteUrl}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${projectUrl}/#project`,
        name: project.title,
        headline: project.title,
        description,
        url: projectUrl,
        mainEntityOfPage: projectUrl,
        image,
        inLanguage: "id-ID",
        keywords: project.stack.join(", "),
        author: {
          "@type": "Person",
          "@id": `${siteUrl}/#person`,
          name: site.name,
          url: siteUrl,
        },
        creator: { "@id": `${siteUrl}/#person` },
        isPartOf: { "@id": `${siteUrl}/#website` },
        ...(project.href ? { sameAs: project.href } : {}),
        ...(project.repo ? { codeRepository: project.repo } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${projectUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${siteUrl}/projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: projectUrl,
          },
        ],
      },
    ],
  };
}
