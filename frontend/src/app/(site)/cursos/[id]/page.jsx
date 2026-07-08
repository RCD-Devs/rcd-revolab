import { notFound } from "next/navigation";
import CourseDetailPage from "@/components/courses/course-detail-page";
import { getCourseDetail } from "@/data/course-detail-data";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = getCourseDetail(id);

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
  const course = getCourseDetail(id);

  if (!course) {
    notFound();
  }

  return <CourseDetailPage course={course} />;
}
