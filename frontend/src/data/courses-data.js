import { courseCategories } from "./courses-menu-data";

const courseImages = [
  "/images/home/course-growth-hacking.webp",
  "/images/home/course-seo.webp",
  "/images/home/course-data-analytics.webp",
  "/images/home/course-marketing-ecommerce.webp",
];

const levels = [
  {
    suffix: "Fundamentos",
    description:
      "Domina las bases y los conceptos esenciales para comenzar con paso firme.",
    students: 30,
    duration: "8h",
  },
  {
    suffix: "Nivel Intermedio",
    description:
      "Profundiza en técnicas prácticas y casos reales para aplicar en tu día a día.",
    students: 22,
    duration: "12h",
  },
  {
    suffix: "Nivel Avanzado",
    description:
      "Estrategias avanzadas para escalar resultados y liderar proyectos complejos.",
    students: 18,
    duration: "16h",
  },
];

function makeCategoryCourses(category, categoryIndex) {
  return levels.map((level, index) => ({
    id: `${category.id}-${index}`,
    category: category.label,
    categoryId: category.id,
    title: `${category.label}: ${level.suffix}`,
    description: level.description,
    students: level.students,
    duration: level.duration,
    image: courseImages[(categoryIndex + index) % courseImages.length],
  }));
}

export const marketingCourses = [
  {
    id: "marketing-digital",
    category: "Marketing",
    categoryId: "marketing",
    title: "Marketing Digital Estratégico",
    description: "Domina las tácticas de marketing que generan resultados medibles.",
    students: 18,
    duration: "8h",
    image: "/images/home/course-marketing-ecommerce.webp",
    isNew: true,
  },
  {
    id: "marketing-integral",
    category: "Marketing",
    categoryId: "marketing",
    title: "Marketing Digital Integral",
    description: "Integra canales y estrategias para escalar tu negocio digital.",
    students: "1.2k",
    duration: "12h",
    image: "/images/home/course-growth-hacking.webp",
    isNew: true,
  },
  {
    id: "content-marketing",
    category: "Marketing",
    categoryId: "marketing",
    title: "Content Marketing Estratégico",
    description: "Crea contenido que atrae, convierte y fideliza a tu audiencia.",
    students: 27,
    duration: "14h",
    image: "/images/home/course-seo.webp",
  },
];

const growthHackingCourse = {
  id: "growth-hacking",
  category: "Growth Hacking",
  categoryId: "analytics-seo",
  title: "Growth Hacking Avanzado",
  description:
    "Aprende las estrategias que usan las startups para crecer exponencialmente.",
  students: "1.2k",
  duration: "12h",
  image: "/images/home/course-growth-hacking.webp",
  isNew: true,
};

export const courseSections = courseCategories.map((category, index) => ({
  id: category.id,
  title: category.label,
  courses:
    category.id === "analytics-seo"
      ? [growthHackingCourse, ...makeCategoryCourses(category, index).slice(0, 2)]
      : makeCategoryCourses(category, index),
}));

const allCategoryCourses = courseSections.flatMap((section) => section.courses);

const newCourses = allCategoryCourses
  .filter((_, index) => index % 4 === 0)
  .slice(0, 3)
  .map((course) => ({ ...course, isNew: true }));

const popularCourses = allCategoryCourses
  .filter((_, index) => index % 3 === 1)
  .slice(0, 3);

export const courseNavGroups = [
  {
    id: "cursos",
    label: "Cursos",
    items: [
      { id: "nuevos", label: "Cursos nuevos" },
      { id: "populares", label: "Populares" },
      { id: "marketing", label: "Marketing" },
    ],
  },
  {
    id: "categorias",
    label: "Categorías",
    items: [
      { id: "todos", label: "Todas las categorías" },
      ...courseCategories.map((category) => ({
        id: category.id,
        label: category.label,
      })),
    ],
  },
];

export const mobileCourseFilters = [
  { id: "todos", label: "Todos" },
  { id: "marketing", label: "Cursos de Marketing" },
  ...courseCategories.map((category) => ({
    id: category.id,
    label: category.label,
  })),
];

export function getBreadcrumbLabel(filterId) {
  if (filterId === "todos") return "Todos";
  if (filterId === "nuevos") return "Cursos nuevos";
  if (filterId === "populares") return "Populares";
  const mobileFilter = mobileCourseFilters.find((item) => item.id === filterId);
  if (mobileFilter) return mobileFilter.label;
  return "Todos";
}

export function getPageTitle(filterId) {
  if (filterId === "marketing" || filterId === "todos") return "Cursos de Marketing";
  if (filterId === "nuevos") return "Cursos nuevos";
  if (filterId === "populares") return "Populares";
  const category = courseCategories.find((item) => item.id === filterId);
  return category?.label ?? "Cursos";
}

export function getVisibleSections(filterId) {
  if (filterId === "todos") return courseSections;
  if (filterId === "marketing") return [];

  if (filterId === "nuevos") {
    return [{ id: "nuevos", title: "Cursos nuevos", courses: newCourses }];
  }

  if (filterId === "populares") {
    return [{ id: "populares", title: "Populares", courses: popularCourses }];
  }

  const section = courseSections.find((item) => item.id === filterId);
  return section ? [section] : [];
}

export function showFeaturedSection(filterId) {
  return filterId === "todos" || filterId === "marketing";
}
