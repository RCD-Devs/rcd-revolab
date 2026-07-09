export const instructorPageMeta = {
  title: "Panel de Instructor",
  subtitle: "Crea y administra tus cursos.",
  createCourseLabel: "Crear Curso",
  coursesSectionTitle: "Mis Cursos",
  searchPlaceholder: "Buscar cursos...",
  backHref: "/home",
  learningPathsTitle: "Rutas de Aprendizaje",
  learningPathsDescription:
    "Construye secuencias de cursos arrastrando y soltando para crear especialidades.",
  learningPathsButton: "Constructor de Rutas",
};

export const instructorCourses = [
  {
    id: "growth-hacking",
    title: "Growth Hacking Avanzado",
    status: "published",
    stats: "156 estudiantes inscritos • Valoración: 4.8/5",
    actionLabel: "Editar",
    actionType: "edit",
    coverImage: "/images/home/course-growth-hacking.webp",
  },
  {
    id: "ia-generativa",
    title: "Introducción a la IA Generativa",
    status: "review",
    stats: "Módulos completados: 4/4 • Esperando aprobación",
    actionLabel: "Ver estado",
    actionType: "status",
    coverImage: null,
  },
];

export const instructorCourseSteps = [
  {
    id: "basic",
    label: "Información Básica",
    viewTitle: "Información Básica",
    icon: "/icons/instructor-step-info.svg",
  },
  {
    id: "content",
    label: "Contenido y Módulos",
    viewTitle: "Contenido del Curso",
    icon: "/icons/instructor-step-content.svg",
  },
  {
    id: "rules",
    label: "Reglas y Publicación",
    viewTitle: "Reglas y Publicación",
    icon: "/icons/instructor-step-rules.svg",
  },
];

export const instructorDefaultModule = {
  id: "module-1",
  title: "Módulo 1: Introducción y Mindset",
  lessons: [
    { id: "lesson-1", title: "¿Qué es el Growth Hacking?", type: "video" },
    { id: "lesson-2", title: "Plantilla AARRR", type: "document" },
  ],
};

export const instructorEmptyModule = {
  id: "module-2",
  title: "Nuevo Módulo",
  lessons: [],
};

export const instructorAreas = [
  "Experiencia Digital",
  "Marketing",
  "Tecnología",
  "Recursos Humanos",
];

export const instructorEnrollmentOptions = [
  { id: "none", label: "Sin requisitos" },
  {
    id: "rank-specialist",
    label: "Exclusivo: Rango Especialista o superior",
  },
];

export const instructorVisibilityOptions = [
  { id: "public", label: "Público (Catálogo General)" },
  { id: "hidden", label: "Oculto (Solo con enlace)" },
];

export const instructorLessonTypes = [
  { id: "video", label: "Video", icon: "/icons/instructor-lesson-video.svg", tone: "teal" },
  {
    id: "document",
    label: "Documento",
    icon: "/icons/instructor-lesson-document.svg",
    tone: "yellow",
  },
  { id: "quiz", label: "Quiz", icon: "/icons/instructor-lesson-quiz.svg", tone: "blue" },
  {
    id: "tools",
    label: "Herramientas",
    icon: "/icons/instructor-lesson-tools.svg",
    tone: "purple",
  },
];

export const defaultCourseDraft = {
  title: "",
  description: "",
  area: instructorAreas[0],
  coverImage: null,
  visibility: "public",
  enrollmentRequirement: "none",
  autoCertificate: false,
  modules: [
    {
      ...instructorDefaultModule,
      lessons: instructorDefaultModule.lessons.map((lesson) => ({ ...lesson })),
    },
  ],
};

export const instructorCourseDrafts = {
  "growth-hacking": {
    ...defaultCourseDraft,
    title: "Growth Hacking Avanzado",
    description: "Escribe un resumen atractivo para la tarjeta del curso...",
    area: "Experiencia Digital",
    coverImage: "/images/home/course-growth-hacking.webp",
    visibility: "public",
    enrollmentRequirement: "none",
    autoCertificate: true,
    modules: [
      {
        ...instructorDefaultModule,
        lessons: instructorDefaultModule.lessons.map((lesson) => ({ ...lesson })),
      },
      { ...instructorEmptyModule, lessons: [] },
    ],
  },
  nuevo: {
    ...defaultCourseDraft,
    title: "",
    description: "",
    modules: [],
  },
};

export function filterInstructorCourses(courses, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return courses;

  return courses.filter((course) =>
    course.title.toLowerCase().includes(normalized),
  );
}

export function getCourseDraft(courseId) {
  if (courseId === "nuevo") {
    return instructorCourseDrafts.nuevo;
  }

  return (
    instructorCourseDrafts[courseId] ?? {
      ...defaultCourseDraft,
      title: "Nuevo Curso",
    }
  );
}

export function getStatusConfig(status) {
  if (status === "published") {
    return {
      label: "PUBLICADO",
      icon: "/icons/instructor-status-published.svg",
      className: "published",
    };
  }

  return {
    label: "EN REVISIÓN",
    icon: "/icons/instructor-status-review.svg",
    className: "review",
  };
}
