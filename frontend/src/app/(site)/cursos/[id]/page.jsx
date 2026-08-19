import { notFound } from "next/navigation";
import CourseDetailPage from "@/components/courses/course-detail-page";
import { getCourseDetail } from "@revolab/backend/services/courses";

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
