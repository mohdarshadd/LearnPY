import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/lesson-view";
import { getStartHereLesson } from "@/content/registry";

export const metadata: Metadata = {
  title: "Start here",
  description:
    "A short orientation to LearnPY: how lessons work, how to run Python in the browser, and what to do when a cell raises an error.",
};

export default function StartHerePage() {
  const lesson = getStartHereLesson();

  if (!lesson) {
    notFound();
  }

  return <LessonView lesson={lesson} />;
}
