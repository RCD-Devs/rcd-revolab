import {
  courseSections,
  marketingCourses,
} from "./courses-data";

const defaultDetail = {
  specialtyLabel: "Especialidad",
  instructorName: "Ariel Jeria",
  instructorRole: "Gerente General Rompecabeza",
  instructorImage: "/images/home/instructor-ariel.webp",
  about: [
    "Aprende las estrategias que usan las startups para crecer exponencialmente. En este curso profundizarás en metodologías probadas para adquirir y retener usuarios utilizando datos y experimentación continua.",
    "Ideal para perfiles de marketing, producto y fundadores que buscan escalar sus proyectos sin depender de grandes presupuestos publicitarios.",
  ],
  learningOutcomes: [
    "Crear embudos de conversión efectivos",
    "Optimizar la retención de usuarios (Cohort analysis)",
    "Diseñar y ejecutar experimentos A/B",
    "Automatizar procesos de marketing",
  ],
  tools: [
    { emoji: "🎨", name: "Figma" },
    { emoji: "🤖", name: "ChatGPT (IA)" },
    { emoji: "📊", name: "Mixpanel" },
    { emoji: "📝", name: "Notion" },
  ],
  videoHours: "3 horas de contenido en video",
  level: "Nivel Intermedio",
  includesTranscripts: "Incluye transcripciones IA",
  includesCertificate: "Certificado al finalizar",
  certificateName: "Growth Hacking",
};

const detailOverrides = {
  "growth-hacking": {
    title: "El segundo curso: Redes Sociales",
    categoryTag: "Growth Hacking",
    certificateName: "Growth Hacking",
  },
};

export const courseDetailTabs = [
  "Descripción",
  "Contenido",
  "Transcripciones",
  "Comentarios",
  "Quiz",
];

export function getAllCatalogCourses() {
  const courses = [
    ...marketingCourses,
    ...courseSections.flatMap((section) => section.courses),
  ];

  const unique = new Map();
  courses.forEach((course) => {
    if (!unique.has(course.id)) unique.set(course.id, course);
  });

  return Array.from(unique.values());
}

export function getCourseDetail(id) {
  const course = getAllCatalogCourses().find((item) => item.id === id);
  if (!course) return null;

  const override = detailOverrides[id] ?? {};

  return {
    ...course,
    ...defaultDetail,
    ...override,
    title: override.title ?? course.title,
    categoryTag: override.categoryTag ?? course.category,
    certificateName: override.certificateName ?? course.category,
  };
}
