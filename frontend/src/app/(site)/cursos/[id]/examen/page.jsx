import { notFound } from "next/navigation";
import CourseExamPage from "@/components/courses/course-exam-page";
import { auth } from "@/auth";
import { getCourseDetail } from "@revolab/backend/services/courses";
import { getCourseExam } from "@revolab/backend/services/quiz";

export default async function ExamPage({ params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [course, exam] = await Promise.all([
    getCourseDetail(id),
    getCourseExam(id, session.user.id, session.user.role),
  ]);

  if (!course || !exam) {
    notFound();
  }

  if (exam.accessDenied) {
    return (
      <div style={{ padding: "64px 24px", textAlign: "center" }}>
        <p>{exam.message}</p>
      </div>
    );
  }

  return (
    <CourseExamPage
      examData={{
        course: { id: course.id, title: course.title },
        exam,
        lastLessonId: course.firstLessonId,
      }}
    />
  );
}
