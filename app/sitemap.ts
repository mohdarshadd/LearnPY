import type { MetadataRoute } from "next";
import {
  getLessonHref,
  lessons,
  references,
} from "@/content/registry";
import { libraries } from "@/content/libraries";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const paths = new Set<string>([
    "/",
    "/learn",
    "/learn/start-here",
    "/reference",
    "/playground",
    "/capstone",
    "/progress",
    ...libraries.map((library) => `/learn/${library.id}`),
    ...lessons.map(getLessonHref),
    ...references.map(
      (reference) => `/reference/${reference.library}/${reference.slug}`,
    ),
  ]);

  return Array.from(paths).map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
