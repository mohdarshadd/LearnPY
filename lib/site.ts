const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return new URL(explicit);
  }

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return new URL(`https://${vercelUrl}`);
  }

  return new URL(FALLBACK_SITE_URL);
}
