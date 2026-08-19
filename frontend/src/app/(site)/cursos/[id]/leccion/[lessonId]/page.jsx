import { notFound } from "next/navigation";
import CourseLessonPage from "@/components/courses/course-lesson-page";
import { auth } from "@/auth";
import { getLessonPageData } from "@revolab/backend/services/lessons";

export async function generateMetadata({ params }) {
  const { id, lessonId } = await params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Lección" };

  const lessonData = await getLessonPageData(id, lessonId, session.user.id);

  if (!lessonData) {
    return { title: "Lección no encontrada" };
  }

  return {
    title: `${lessonData.lesson.title} | ${lessonData.course.title}`,
  };
}

export default async function CourseLessonRoute({ params }) {
  const { id, lessonId } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const lessonData = await getLessonPageData(id, lessonId, session.user.id);

  if (!lessonData) {
    notFound();
  }

  return <CourseLessonPage lessonData={lessonData} />;
}
