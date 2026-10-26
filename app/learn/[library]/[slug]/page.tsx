import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/lesson-view";
import { getLesson, lessons } from "@/content/registry";
import { isLibraryId } from "@/content/schema";

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

  return {
    title: lesson.title,
    description: lesson.summary,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { library, slug } = await params;
  const lesson = getLesson(library, slug);

  if (!lesson) {
    notFound();
  }

  return <LessonView lesson={lesson} />;
}
