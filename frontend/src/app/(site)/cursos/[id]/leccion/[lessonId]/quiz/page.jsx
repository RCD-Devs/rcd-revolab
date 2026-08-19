import { notFound } from "next/navigation";
import CourseQuizPage from "@/components/courses/course-quiz-page";
import { auth } from "@/auth";
import { getLessonPageData } from "@revolab/backend/services/lessons";
import { getLessonQuiz } from "@revolab/backend/services/quiz";

export default async function QuizPage({ params }) {
  const { id, lessonId } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [lessonData, quiz] = await Promise.all([
    getLessonPageData(id, lessonId, session.user.id),
    getLessonQuiz(lessonId),
  ]);

  if (!lessonData || !quiz) {
    notFound();
  }

  return (
    <CourseQuizPage
      quizData={{
        course: lessonData.course,
        lesson: lessonData.lesson,
        previousLesson: lessonData.previousLesson,
        nextLesson: lessonData.nextLesson,
        quiz,
      }}
    />
  );
}
