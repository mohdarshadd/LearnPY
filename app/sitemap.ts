import type { MetadataRoute } from "next";
import {
  getLessonHref,
  lessons,
  references,
} from "@/content/registry";
import { libraries } from "@/content/libraries";
import { getSiteUrl } from "@/lib/site";

const weeklyPaths = new Set(["/", "/learn", "/practice"]);
const highPriorityPaths = new Set([
  "/learn",
  "/practice",
  "/reference",
  "/reference/ml",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  const paths = new Set<string>([
    "/",
    "/learn",
    "/learn/start-here",
    "/reference",
    "/reference/ml",
    "/playground",
    "/practice",
    "/capstone",
    ...libraries.map((library) => `/learn/${library.id}`),
    ...lessons.map(getLessonHref),
    ...references.map(
      (reference) => `/reference/${reference.library}/${reference.slug}`,
    ),
  ]);

  return Array.from(paths).map((path) => {
    const isReference = path.startsWith("/reference/");
    const isLesson = path.startsWith("/learn/");

    return {
      url: new URL(path, siteUrl).toString(),
      lastModified,
      changeFrequency: weeklyPaths.has(path) ? "weekly" : "monthly",
      priority:
        path === "/"
          ? 1
          : highPriorityPaths.has(path)
            ? 0.9
            : isLesson || path === "/learn/start-here"
              ? 0.8
              : isReference
                ? 0.6
                : 0.7,
    };
  });
}
