import CourseModuleCta from "./course-module-cta";
import ctaStyles from "./course-module-cta.module.css";

export default function CourseLessonQuizCta({ courseId, lessonId, quiz }) {
  return (
    <CourseModuleCta
      ariaLabel="Quiz de lección"
      iconSrc="/icons/quiz-brain.svg"
      iconWrapClassName={ctaStyles.iconWrapQuiz}
      title={quiz.title}
      description={quiz.description}
      href={`/cursos/${courseId}/leccion/${lessonId}/quiz`}
      ctaLabel="Comenzar Quiz"
      inline
    />
  );
}
