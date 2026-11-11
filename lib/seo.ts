import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export const SITE_NAME = "LearnPY";
export const SITE_AUTHOR = "Mohd Arshad";
export const SITE_LANGUAGE = "en";
export const SITE_LOCALE = "en_US";
export const SITE_CATEGORY = "Education";
export const SITE_DESCRIPTION =
  "Learn NumPy, pandas, Matplotlib, and scikit-learn with short, interactive lessons. Write and run real Python in your browser with no installs and no account.";
export const SITE_KEYWORDS = [
  "learn python",
  "python data science",
  "interactive python",
  "numpy tutorial",
  "pandas tutorial",
  "matplotlib tutorial",
  "scikit-learn tutorial",
  "python exercises",
  "pyodide",
  "browser python",
];

export function getAbsoluteUrl(path = "/"): string {
  return new URL(path, getSiteUrl()).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  keywords,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = getAbsoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
  };
}

const organizationId = () => `${getAbsoluteUrl("/")}#organization`;

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getAbsoluteUrl("/")}#website`,
    name: SITE_NAME,
    url: getAbsoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: {
      "@id": organizationId(),
    },
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": organizationId(),
    name: SITE_NAME,
    url: getAbsoluteUrl("/"),
    logo: getAbsoluteUrl("/icon.svg"),
    description: SITE_DESCRIPTION,
    founder: {
      "@type": "Person",
      name: SITE_AUTHOR,
    },
  };
}

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}

type LearningResourceInput = {
  name: string;
  description: string;
  path: string;
  libraryName: string;
  libraryPath: string;
  level: string;
  minutes: number;
  objectives: string[];
};

export function createLearningResourceJsonLd({
  name,
  description,
  path,
  libraryName,
  libraryPath,
  level,
  minutes,
  objectives,
}: LearningResourceInput) {
  const url = getAbsoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${url}#learning-resource`,
    name,
    description,
    url,
    inLanguage: SITE_LANGUAGE,
    learningResourceType: "Lesson",
    educationalLevel: level,
    timeRequired: `PT${minutes}M`,
    teaches: objectives,
    isPartOf: {
      "@type": "Course",
      name: `${libraryName} track`,
      url: getAbsoluteUrl(libraryPath),
    },
    provider: {
      "@id": organizationId(),
    },
  };
}

type TechArticleInput = {
  headline: string;
  description: string;
  path: string;
  libraryName: string;
  symbol: string;
};

export function createTechArticleJsonLd({
  headline,
  description,
  path,
  libraryName,
  symbol,
}: TechArticleInput) {
  const url = getAbsoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#tech-article`,
    headline,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: SITE_LANGUAGE,
    articleSection: libraryName,
    about: {
      "@type": "DefinedTerm",
      name: symbol,
    },
    author: {
      "@type": "Person",
      name: SITE_AUTHOR,
    },
    publisher: {
      "@id": organizationId(),
    },
  };
}

type FaqItem = {
  question: string;
  answer: string;
};

export function createFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
