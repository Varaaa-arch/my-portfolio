const PRODUCTION_FALLBACK = "https://zarrgvrd.vercel.app";

const normalize = (value: string) => value.trim().replace(/\/+$/, "");

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;

  if (explicit?.trim()) {
    return normalize(explicit);
  }

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (vercelProduction?.trim()) {
    return normalize(`https://${vercelProduction}`);
  }

  const vercelDeployment = process.env.VERCEL_URL;

  if (vercelDeployment?.trim()) {
    return normalize(`https://${vercelDeployment}`);
  }

  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : PRODUCTION_FALLBACK;
}
