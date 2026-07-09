import { notFound } from "next/navigation";
import CourseExamPage from "@/components/courses/course-exam-page";
import { getCourseExam } from "@/data/course-exam-data";

export default async function ExamPage({ params }) {
  const { id } = await params;
  const examData = getCourseExam(id);

  if (!examData) {
    notFound();
  }

  return <CourseExamPage examData={examData} />;
}
