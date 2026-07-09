import { getCourseDetail } from "./course-detail-data";
import { getCourseLesson } from "./course-lesson-data";
import {
  defaultAssessmentQuestions,
  growthHackingAssessmentQuestions,
} from "./course-assessment-questions";

export const DEFAULT_QUIZ_LESSON_ID = "1";

const QUIZ_OVERRIDES = {
  "growth-hacking": {
    questions: growthHackingAssessmentQuestions,
  },
};

function createDefaultQuiz() {
  return {
    title: "Quiz de Lección",
    description:
      "Responde las preguntas generadas por IA sobre la última lección para asegurar tu aprendizaje y continuar.",
    questions: defaultAssessmentQuestions,
    success: {
      title: "¡Excelente trabajo!",
      description: "Has superado el quiz con éxito y dominado los conceptos de la lección.",
      ctaLabel: "Continuar clase",
    },
    failure: {
      title: "No has aprobado",
      description:
        "Te sugerimos repasar la lección e intentarlo de nuevo para asentar los conocimientos.",
      reviewLabel: "Repasar lección",
      retryLabel: "Reintentar quiz",
    },
  };
}

function buildQuiz(course) {
  const override = QUIZ_OVERRIDES[course.id];
  const base = createDefaultQuiz();

  if (!override) return base;

  return {
    ...base,
    ...override,
  };
}

export function getQuizPath(courseId, lessonId = DEFAULT_QUIZ_LESSON_ID) {
  return `/cursos/${courseId}/leccion/${lessonId}/quiz`;
}

export function getLessonQuiz(courseId) {
  const course = getCourseDetail(courseId);
  if (!course) return null;

  return buildQuiz(course);
}

export function getCourseQuiz(courseId, lessonId) {
  const lessonData = getCourseLesson(courseId, lessonId);
  const quiz = getLessonQuiz(courseId);

  if (!lessonData || !quiz) return null;

  return {
    ...lessonData,
    quiz,
  };
}
