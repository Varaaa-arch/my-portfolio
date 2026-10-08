export interface Project {
  title: string;
  summary: string;
  year: number;
  tags: string[];
  featured: boolean;
  href?: string;
}

export const projects: Project[] = [
  { title: 'Project One', summary: 'Deskripsi singkat satu atau dua kalimat.', year: 2026, tags: ['Astro', 'TypeScript'], featured: true },
  { title: 'Project Two', summary: 'Deskripsi singkat satu atau dua kalimat.', year: 2025, tags: ['React', 'Three.js'], featured: true },
  { title: 'Project Three', summary: 'Deskripsi singkat satu atau dua kalimat.', year: 2025, tags: ['Node.js', 'PostgreSQL'], featured: true },
];
