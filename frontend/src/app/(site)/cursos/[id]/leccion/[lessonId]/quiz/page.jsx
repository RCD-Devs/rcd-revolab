import { notFound } from "next/navigation";
import CourseQuizPage from "@/components/courses/course-quiz-page";
import { getCourseQuiz } from "@/data/course-quiz-data";

export default async function QuizPage({ params }) {
  const { id, lessonId } = await params;
  const quizData = getCourseQuiz(id, lessonId);

  if (!quizData) {
    notFound();
  }

  return <CourseQuizPage quizData={quizData} />;
}
