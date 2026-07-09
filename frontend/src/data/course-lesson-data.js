import { getCourseDetail } from "./course-detail-data";

const defaultTranscript = [
  "Hola, bienvenidos a esta lección. En este módulo profundizarás en conceptos clave para aplicar lo aprendido de forma práctica en tu día a día profesional.",
  "A diferencia de los enfoques tradicionales, aquí trabajaremos con metodologías basadas en datos, experimentación continua y mejora iterativa para lograr resultados medibles.",
];

const growthHackingTranscript = [
  "Hola, bienvenidos a esta lección sobre Growth Hacking. El concepto de Growth Hacking no se trata solo de tácticas de marketing, sino de un enfoque sistemático para encontrar los canales más eficientes de crecimiento.",
  "A diferencia del marketing tradicional, que a menudo se centra en el conocimiento de la marca (brand awareness), el Growth Hacking se centra en el crecimiento de todo el embudo, desde la adquisición hasta la retención y la recomendación.",
];

function buildModules(course) {
  const firstLessonTitle =
    course.id === "growth-hacking"
      ? "¿Qué es el Growth Hacking?"
      : `Introducción a ${course.title}`;

  return [
    {
      id: "module-1",
      title: "Módulo 1",
      lessons: [
        { id: "1", title: firstLessonTitle, duration: "10:30" },
        { id: "2", title: "El mindset del Growth Hacker", duration: "10:30" },
        { id: "3", title: "Métricas pirata (AARRR)", duration: "10:30" },
      ],
      exam: { id: "exam", title: "Examen Final", locked: false },
    },
  ];
}

export function getCourseLesson(courseId, lessonId) {
  const course = getCourseDetail(courseId);
  if (!course) return null;

  const module = buildModules(course)[0];
  const lesson = module.lessons.find((item) => item.id === lessonId);

  if (!lesson) return null;

  const lessonIndex = module.lessons.findIndex((item) => item.id === lessonId);
  const previousLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null;

  const transcript =
    course.id === "growth-hacking" && lessonId === "1"
      ? growthHackingTranscript
      : defaultTranscript;

  return {
    course,
    module,
    lesson,
    previousLesson,
    nextLesson,
    progress: 15,
    transcript,
    lessonLabel: `${module.title} • Lección ${lessonIndex + 1}`,
  };
}
