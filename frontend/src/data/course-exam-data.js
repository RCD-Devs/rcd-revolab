import { getCourseDetail } from "./course-detail-data";
import { getCourseLesson } from "./course-lesson-data";
import {
  defaultAssessmentQuestions,
  growthHackingAssessmentQuestions,
} from "./course-assessment-questions";

const PASS_THRESHOLD = 80;

const EXAM_OVERRIDES = {
  "growth-hacking": {
    questions: growthHackingAssessmentQuestions,
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
    questions: defaultAssessmentQuestions,
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
