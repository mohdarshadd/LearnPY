import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LearnPY — Learn Python's data stack in your browser",
    template: "%s · LearnPY",
  },
  description:
    "Short, interactive lessons for NumPy, pandas, Matplotlib, and scikit-learn. Write and run real Python with no installs, no accounts, and nothing to configure.",
  keywords: [
    "learn python",
    "numpy",
    "pandas",
    "matplotlib",
    "scikit-learn",
    "interactive python",
    "pyodide",
  ],
  openGraph: {
    title: "LearnPY — Learn Python's data stack in your browser",
    description:
      "Interactive lessons and exercises for NumPy, pandas, Matplotlib, and scikit-learn. Real Python, zero setup.",
    siteName: "LearnPY",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f5ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
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
