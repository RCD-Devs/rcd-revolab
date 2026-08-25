import { notFound } from "next/navigation";
import CourseQuizPage from "@/components/courses/course-quiz-page";
import { auth } from "@/auth";
import { getLessonPageData } from "@revolab/backend/services/lessons";
import { getLessonQuiz } from "@revolab/backend/services/quiz";

export default async function QuizPage({ params }) {
  const { id, moduleSlug, lessonSlug } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const lessonData = await getLessonPageData(
    id,
    moduleSlug,
    lessonSlug,
    session.user.id,
    session.user.role,
  );

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

  // El quiz se busca por el id interno de la leccion (lessonData.lesson.id),
  // ya resuelto arriba a partir de moduleSlug/lessonSlug — la URL nunca
  // expone ese id.
  const quiz = await getLessonQuiz(lessonData.lesson.id, session.user.id, session.user.role);

  if (!quiz) {
    notFound();
  }

  if (quiz.accessDenied) {
    return (
      <div style={{ padding: "64px 24px", textAlign: "center" }}>
        <p>{quiz.message}</p>
      </div>
    );
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
