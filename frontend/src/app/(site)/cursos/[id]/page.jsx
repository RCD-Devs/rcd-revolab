import { cache } from "react";
import { notFound } from "next/navigation";
import CourseDetailPage from "@/components/courses/course-detail-page";
import { getCourseDetail as getCourseDetailUncached } from "@revolab/backend/services/courses";

// generateMetadata y el componente de la ruta corren ambos por request:
// sin memoizar, cada navegación dispara la consulta (con joins) dos veces.
const getCourseDetail = cache(getCourseDetailUncached);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = await getCourseDetail(id);

  if (!course) {
    return { title: "Curso no encontrado" };
  }

  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CourseDetailRoute({ params }) {
  const { id } = await params;
  const course = await getCourseDetail(id);

  if (!course) {
    notFound();
  }

  return <CourseDetailPage course={course} />;
}
