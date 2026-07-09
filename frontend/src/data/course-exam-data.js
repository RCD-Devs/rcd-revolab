import { getCourseDetail } from "./course-detail-data";
import { getCourseLesson } from "./course-lesson-data";

const PASS_THRESHOLD = 80;

const defaultQuestions = [
  {
    id: "q1",
    text: "¿Cuál es el objetivo principal de una estrategia de marketing digital?",
    options: [
      { id: "a", label: "Generar resultados medibles y sostenibles", correct: true },
      { id: "b", label: "Publicar contenido sin planificación" },
      { id: "c", label: "Reducir la presencia en redes sociales" },
      { id: "d", label: "Eliminar el seguimiento de métricas" },
    ],
  },
  {
    id: "q2",
    text: "¿Qué indica una buena tasa de conversión en un embudo?",
    options: [
      { id: "a", label: "Que el tráfico es alto sin importar ventas" },
      { id: "b", label: "Que los usuarios completan la acción deseada", correct: true },
      { id: "c", label: "Que no se necesitan optimizaciones" },
      { id: "d", label: "Que el presupuesto publicitario es ilimitado" },
    ],
  },
  {
    id: "q3",
    text: "¿Por qué es importante medir el ROI en campañas digitales?",
    options: [
      { id: "a", label: "Para validar si la inversión genera retorno", correct: true },
      { id: "b", label: "Para evitar usar datos en decisiones" },
      { id: "c", label: "Para duplicar gastos sin evaluar resultados" },
      { id: "d", label: "Para reemplazar la estrategia del negocio" },
    ],
  },
];

const growthHackingQuestions = [
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
];

const EXAM_OVERRIDES = {
  "growth-hacking": {
    questions: growthHackingQuestions,
    certificate: {
      courseTitle: "Growth Hacking Avanzado",
      linkedinMessage:
        '¡Feliz de anunciar que he completado la especialización en "Growth Hacking Avanzado" en REVO Lab! 🚀 Siempre buscando expandir mis conocimientos. #Marketing #GrowthHacking #REVO #Elearning',
    },
  },
};

function createDefaultExam(course) {
  return {
    title: "Examen Final",
    description:
      "Pon a prueba todo lo aprendido. Necesitas un 80% para aprobar y obtener tu certificación.",
    passThreshold: PASS_THRESHOLD,
    startLabel: "Comenzar Examen",
    questions: defaultQuestions,
    success: {
      title: "¡Felicidades!",
      description: "Has completado el curso y desbloqueado tu certificado oficial.",
      ctaLabel: "Ver Certificado",
    },
    failure: {
      title: "No has aprobado",
      description:
        "Te sugerimos descargar la guía resumen y repasar antes de volver a intentarlo.",
      reviewLabel: "Repasar",
      pdfLabel: "Guía resumen PDF",
      pdfUrl: "#",
    },
    certificate: {
      recipientName: "Nombre Apellido",
      courseTitle: course.title,
      issuedAt: "8 de Mayo, 2026",
      issuedAtLabel: "Fecha de emisión",
      instructorSignature: "Firma del Instructor",
      careerIqTitle: "Career IQ Actualizado",
      careerIqDescription:
        "Este logro suma puntos a tu Career IQ como Especialidad. Has avanzado un 5% hacia el siguiente rango.",
      missionTitle: "¡Misión cumplida!",
      missionDescription:
        "Tu certificado oficial ya está disponible. Puedes descargarlo o añadirlo directamente a tu perfil de LinkedIn.",
      linkedinMessage: `¡Feliz de anunciar que he completado "${course.title}" en REVO Lab! 🚀 Siempre buscando expandir mis conocimientos. #Marketing #REVO #Elearning`,
      pdfUrl: "#",
    },
  };
}

function buildExam(course) {
  const override = EXAM_OVERRIDES[course.id];
  const base = createDefaultExam(course);

  if (!override) return base;

  return {
    ...base,
    ...override,
    certificate: {
      ...base.certificate,
      ...override.certificate,
    },
  };
}

export function getCourseExam(courseId) {
  const course = getCourseDetail(courseId);
  if (!course) return null;

  const lastLesson = getCourseLesson(courseId, "3");

  return {
    course,
    lastLessonId: lastLesson?.lesson.id ?? null,
    exam: buildExam(course),
  };
}

export function calculateExamScore(questions, answers) {
  const total = questions.length;
  if (total === 0) return 0;

  const correct = questions.reduce((count, question) => {
    const selectedId = answers[question.id];
    const selected = question.options.find((option) => option.id === selectedId);
    return selected?.correct ? count + 1 : count;
  }, 0);

  return Math.round((correct / total) * 100);
}
