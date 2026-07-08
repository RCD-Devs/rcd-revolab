import { getCourseLesson } from "./course-lesson-data";

const growthHackingQuiz = {
  title: "Quiz de Lección",
  description:
    "Responde las preguntas generadas por IA sobre la última lección para asegurar tu aprendizaje y continuar.",
  questions: [
    {
      id: "q1",
      text: "¿Cuál es la principal diferencia entre Marketing Tradicional y Growth Hacking?",
      options: [
        { id: "a", label: "El presupuesto publicitario" },
        { id: "b", label: "El enfoque en todo el embudo (AARRR)", correct: true },
        { id: "c", label: "El uso de redes sociales" },
        { id: "d", label: "Ninguna de las anteriores" },
      ],
    },
    {
      id: "q2",
      text: "¿Qué significa la métrica de Retención en el modelo AARRR?",
      options: [
        { id: "a", label: "Cuántos usuarios nuevos llegan al producto" },
        { id: "b", label: "Cuántos usuarios vuelven y permanecen activos", correct: true },
        { id: "c", label: "Cuánto dinero genera cada cliente" },
        { id: "d", label: "Cuántas veces se comparte el producto" },
      ],
    },
    {
      id: "q3",
      text: "¿Cuál es el objetivo principal de un experimento en Growth Hacking?",
      options: [
        { id: "a", label: "Validar hipótesis con datos medibles", correct: true },
        { id: "b", label: "Aumentar el presupuesto de marketing" },
        { id: "c", label: "Crear más contenido en redes sociales" },
        { id: "d", label: "Reducir el equipo de ventas" },
      ],
    },
  ],
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

const QUIZ_BY_COURSE = {
  "growth-hacking": growthHackingQuiz,
};

export function getLessonQuiz(courseId) {
  return QUIZ_BY_COURSE[courseId] ?? null;
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
