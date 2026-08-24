import { cache } from "react";
import { notFound } from "next/navigation";
import CourseLessonPage from "@/components/courses/course-lesson-page";
import { auth } from "@/auth";
import { getLessonPageData as getLessonPageDataUncached } from "@revolab/backend/services/lessons";

// generateMetadata y el componente de la ruta corren ambos por request:
// sin memoizar, cada navegación dispara la consulta (con joins) dos veces.
const getLessonPageData = cache(getLessonPageDataUncached);

export async function generateMetadata({ params }) {
  const { id, lessonId } = await params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Lección" };

  const lessonData = await getLessonPageData(id, lessonId, session.user.id, session.user.role);

  if (!lessonData || lessonData.accessDenied) {
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

  const lessonData = await getLessonPageData(id, lessonId, session.user.id, session.user.role);

  if (!lessonData) {
    notFound();
  }

  if (lessonData.accessDenied) {
    return (
      <div style={{ padding: "64px 24px", textAlign: "center" }}>
        <p>{lessonData.message}</p>
      </div>
    );
  }

  return <CourseLessonPage lessonData={lessonData} />;
}
