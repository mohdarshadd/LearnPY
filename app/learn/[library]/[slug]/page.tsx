import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/lesson-view";
import { getLesson, getLessonHref, lessons } from "@/content/registry";
import { isLibraryId } from "@/content/schema";
import { createPageMetadata } from "@/lib/seo";

type LessonPageProps = {
  params: Promise<{ library: string; slug: string }>;
};

export function generateStaticParams() {
  return lessons
    .filter((lesson) => isLibraryId(lesson.library))
    .map((lesson) => ({
      library: lesson.library,
      slug: lesson.slug,
    }));
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { library, slug } = await params;
  const lesson = getLesson(library, slug);

  if (!lesson) {
    return {};
  }

  return createPageMetadata({
    title: lesson.title,
    description: lesson.summary,
    path: getLessonHref(lesson),
    type: "article",
    keywords: [lesson.title, lesson.library, "python lesson", "interactive tutorial"],
  });
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { library, slug } = await params;
  const lesson = getLesson(library, slug);

  if (!lesson) {
    notFound();
  }

  return <LessonView lesson={lesson} />;
}
