import { getAllCatalogCourses } from "./course-detail-data";

export const featuredSlides = [
  {
    id: "redes-sociales",
    courseId: "growth-hacking",
    title: "El Segundo Curso: REDES SOCIALES",
    description: "Lorem ipsum dolor ipsum dolor ipsum dolor ipsum dolor",
    instructorName: "Ariel Jeria",
    instructorRole: "Gerente General Rompecabeza",
    instructorImage: "/images/home/instructor-ariel.webp",
  },
  {
    id: "marketing-digital",
    courseId: "marketing-digital",
    title: "Marketing Digital Estratégico",
    description: "Domina las tácticas de marketing que generan resultados medibles.",
    instructorName: "Ariel Jeria",
    instructorRole: "Gerente General Rompecabeza",
    instructorImage: "/images/home/instructor-ariel.webp",
  },
];

function toHomeCard(course, { isNew = false } = {}) {
  return {
    id: course.id,
    category: course.category,
    title: course.title,
    description: course.description,
    students: course.students,
    duration: course.duration,
    image: course.image,
    ...(isNew ? { isNew: true } : {}),
  };
}

function pickHomeCourses(ids, options = {}) {
  const catalog = getAllCatalogCourses();

  return ids
    .map((id) => catalog.find((course) => course.id === id))
    .filter(Boolean)
    .map((course) => toHomeCard(course, options));
}

const recommendedCourseIds = [
  "growth-hacking",
  "data-science-0",
  "marketing-integral",
  "diseno-0",
  "analytics-seo-0",
  "marketing-digital",
  "analytics-seo-1",
  "content-marketing",
];

const newCourseIds = [
  "growth-hacking",
  "analytics-seo-0",
  "marketing-digital",
  "analytics-seo-1",
];

export const recommendedCourses = pickHomeCourses(recommendedCourseIds);
export const newCourses = pickHomeCourses(newCourseIds, { isNew: true });

export const continueCourses = [
  {
    id: "ux-ui-progress",
    title: "Diseño UX/UI",
    module: "Módulo 2: Wireframes",
    progress: 45,
    image: "/images/home/course-continue.webp",
  },
  {
    id: "web-progress",
    title: "Desarrollo Web",
    module: "Módulo 2: Mobile First",
    progress: 95,
    image: "/images/home/course-continue.webp",
  },
];
