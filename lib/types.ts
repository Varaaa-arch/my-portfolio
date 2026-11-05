export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string[];
  stack: string[];
  stackNote?: string;
  year?: string;
  href?: string;
  repo?: string;
  video?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  href?: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  howIWork: string;
  about: string[];
  email: string;
  linkedin: string;
  location: string;
}
