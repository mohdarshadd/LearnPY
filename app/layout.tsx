import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  createOrganizationJsonLd,
  createWebsiteJsonLd,
  getAbsoluteUrl,
  SITE_AUTHOR,
  SITE_CATEGORY,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
} from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const siteTitle = "LearnPY — Learn Python's data stack in your browser";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  applicationName: SITE_NAME,
  title: {
    default: siteTitle,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_AUTHOR, url: getAbsoluteUrl("/") }],
  creator: SITE_AUTHOR,
  publisher: SITE_NAME,
  category: SITE_CATEGORY,
  alternates: {
    canonical: getAbsoluteUrl("/"),
  },
  openGraph: {
    title: siteTitle,
    description: SITE_DESCRIPTION,
    url: getAbsoluteUrl("/"),
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f5ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <JsonLd
          data={[createWebsiteJsonLd(), createOrganizationJsonLd()]}
        />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
