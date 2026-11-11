import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { libraries } from "../content/libraries";
import {
  getLessonHref,
  lessons,
  references,
} from "../content/registry";
import {
  createBreadcrumbJsonLd,
  createFaqJsonLd,
  createLearningResourceJsonLd,
  createOrganizationJsonLd,
  createPageMetadata,
  createTechArticleJsonLd,
  createWebsiteJsonLd,
  getAbsoluteUrl,
} from "../lib/seo";

const siteUrl = "https://learnpy.example";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("SEO metadata helpers", () => {
  it("builds absolute URLs from the configured site origin", () => {
    expect(getAbsoluteUrl("/learn/numpy")).toBe(
      "https://learnpy.example/learn/numpy",
    );
  });

  it("adds canonicals, Open Graph, and Twitter metadata", () => {
    const metadata = createPageMetadata({
      title: "NumPy arrays",
      description: "Build and inspect arrays.",
      path: "/learn/numpy/arrays",
      type: "article",
    });

    expect(metadata.title).toBe("NumPy arrays");
    expect(metadata.alternates?.canonical).toBe(
      "https://learnpy.example/learn/numpy/arrays",
    );
    expect(metadata.openGraph).toMatchObject({
      title: "NumPy arrays",
      description: "Build and inspect arrays.",
      url: "https://learnpy.example/learn/numpy/arrays",
      type: "article",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "NumPy arrays",
      description: "Build and inspect arrays.",
    });
  });

  it("can mark personalized pages noindex while keeping links crawlable", () => {
    const metadata = createPageMetadata({
      title: "Progress",
      description: "Your local progress.",
      path: "/progress",
      noIndex: true,
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});

describe("structured data", () => {
  it("describes the site and its organization", () => {
    const website = createWebsiteJsonLd();
    const organization = createOrganizationJsonLd();

    expect(website).toMatchObject({
      "@type": "WebSite",
      name: "LearnPY",
      url: "https://learnpy.example/",
    });
    expect(organization).toMatchObject({
      "@type": "EducationalOrganization",
      url: "https://learnpy.example/",
      logo: "https://learnpy.example/icon.svg",
    });
  });

  it("builds a learning resource with course and breadcrumb context", () => {
    const lesson = createLearningResourceJsonLd({
      name: "NumPy arrays",
      description: "Build and inspect arrays.",
      path: "/learn/numpy/arrays",
      libraryName: "NumPy track",
      libraryPath: "/learn/numpy",
      level: "beginner",
      minutes: 12,
      objectives: ["Create an array", "Inspect its shape"],
    });
    const breadcrumbs = createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Learn", path: "/learn" },
      { name: "NumPy", path: "/learn/numpy" },
      { name: "NumPy arrays", path: "/learn/numpy/arrays" },
    ]);

    expect(lesson).toMatchObject({
      "@type": "LearningResource",
      name: "NumPy arrays",
      timeRequired: "PT12M",
      educationalLevel: "beginner",
      isPartOf: {
        "@type": "Course",
        name: "NumPy track",
        url: "https://learnpy.example/learn/numpy",
      },
    });
    expect(lesson.teaches).toEqual(["Create an array", "Inspect its shape"]);
    expect(breadcrumbs.itemListElement).toHaveLength(4);
    expect(breadcrumbs.itemListElement[3]).toMatchObject({
      position: 4,
      name: "NumPy arrays",
      item: "https://learnpy.example/learn/numpy/arrays",
    });
  });

  it("builds reference documentation and FAQ structured data", () => {
    const article = createTechArticleJsonLd({
      headline: "np.mean reference",
      description: "Compute an arithmetic mean.",
      path: "/reference/numpy/mean",
      libraryName: "NumPy",
      symbol: "np.mean",
    });
    const faq = createFaqJsonLd([
      { question: "Is LearnPY free?", answer: "Yes." },
    ]);

    expect(article).toMatchObject({
      "@type": "TechArticle",
      headline: "np.mean reference",
      articleSection: "NumPy",
      about: { "@type": "DefinedTerm", name: "np.mean" },
    });
    expect(faq.mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: "Is LearnPY free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes." },
    });
  });
});

describe("crawler routes", () => {
  it("lists every canonical content route once and omits private progress", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    const expectedPaths = new Set([
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
        (reference) =>
          `/reference/${reference.library}/${reference.slug}`,
      ),
    ]);

    expect(urls).toHaveLength(expectedPaths.size);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).not.toContain(`${siteUrl}/progress`);
    expect(urls).toContain(`${siteUrl}/learn/numpy/arrays`);
    expect(urls).toContain(
      `${siteUrl}/reference/${references[0].library}/${references[0].slug}`,
    );

    for (const entry of entries) {
      expect(entry.url.startsWith(`${siteUrl}/`)).toBe(true);
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(entry.changeFrequency).toMatch(/^(weekly|monthly)$/);
      expect(entry.priority).toBeGreaterThan(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    }
  });

  it("assigns higher priority to hubs and lessons than deep references", () => {
    const entries = sitemap();
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
    const firstReference = references[0];

    expect(byUrl.get(`${siteUrl}/`)).toMatchObject({
      priority: 1,
      changeFrequency: "weekly",
    });
    expect(byUrl.get(`${siteUrl}/learn`)).toMatchObject({
      priority: 0.9,
      changeFrequency: "weekly",
    });
    expect(byUrl.get(`${siteUrl}/learn/numpy/arrays`)).toMatchObject({
      priority: 0.8,
    });
    expect(
      byUrl.get(
        `${siteUrl}/reference/${firstReference.library}/${firstReference.slug}`,
      ),
    ).toMatchObject({ priority: 0.6 });
  });

  it("publishes the sitemap and host from robots.txt", () => {
    expect(robots()).toMatchObject({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://learnpy.example/sitemap.xml",
      host: "https://learnpy.example",
    });
  });
});
