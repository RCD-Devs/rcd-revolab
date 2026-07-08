import { notFound } from "next/navigation";
import CourseLessonPage from "@/components/courses/course-lesson-page";
import { getCourseLesson } from "@/data/course-lesson-data";

export async function generateMetadata({ params }) {
  const { id, lessonId } = await params;
  const lessonData = getCourseLesson(id, lessonId);

  if (!lessonData) {
    return { title: "Lección no encontrada" };
  }

  return {
    title: `${lessonData.lesson.title} | ${lessonData.course.title}`,
    description: lessonData.course.description,
  };
}

export default async function CourseLessonRoute({ params }) {
  const { id, lessonId } = await params;
  const lessonData = getCourseLesson(id, lessonId);

  if (!lessonData) {
    notFound();
  }

  return <CourseLessonPage lessonData={lessonData} />;
}
