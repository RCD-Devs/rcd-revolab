import * as courseRepository from '../repositories/course-repository.js';
import { sumVideoSeconds, formatCourseDuration } from '../utils/course-duration.js';

const FEATURED_LIMIT = 6;
const RECOMMENDED_LIMIT = 4;

function mapCourseSummary(course) {
  return {
    id: course.slug,
    title: course.title,
    description: course.description,
    image: course.coverImageUrl,
    level: course.level,
    duration: formatCourseDuration(sumVideoSeconds(course)),
    category: course.category?.label ?? null,
    categoryId: course.category?.slug ?? null,
    students: course._count.enrollments,
    instructor: course.instructor
      ? {
          name: course.instructor.nombre,
          avatarUrl: course.instructor.avatarUrl,
          role: course.instructor.department?.label ?? 'Instructor',
        }
      : null,
  };
}

export async function listCourses({ category, filter, search } = {}) {
  if (filter === 'nuevos') {
    const courses = await courseRepository.findNewestCourses(FEATURED_LIMIT);
    return courses.map(mapCourseSummary);
  }

  if (filter === 'populares') {
    const courses = await courseRepository.findMostPopularCourses(FEATURED_LIMIT);
    return courses.map(mapCourseSummary);
  }

  const courses = await courseRepository.findPublishedCourses({
    categorySlug: category,
    search,
  });
  return courses.map(mapCourseSummary);
}

export async function searchCourses(query) {
  if (!query?.trim()) return [];
  const courses = await courseRepository.findPublishedCourses({ search: query });
  return courses.map(mapCourseSummary);
}

export async function getRecommendedCourses() {
  const courses = await courseRepository.findNewestCourses(RECOMMENDED_LIMIT);
  return courses.map(mapCourseSummary);
}

export async function getCourseDetail(slug) {
  const course = await courseRepository.findCourseDetailBySlug(slug);
  if (!course) return null;

  const firstLessonPath = await courseRepository.findFirstLessonPath(course.id);
  const durationText = formatCourseDuration(sumVideoSeconds(course));

  return {
    id: course.slug,
    title: course.title,
    description: course.description,
    // Nunca confiar en que un curso publicado llenó "Acerca de este
    // curso"/"Herramientas": about y learningOutcomes son String[] no
    // nulos, pero tools es Json? y queda null si nadie lo llenó — sin este
    // default, un .map() sobre null tumbaba toda la pagina (500).
    about: course.about ?? [],
    learningOutcomes: course.learningOutcomes ?? [],
    tools: course.tools ?? [],
    image: course.coverImageUrl,
    level: course.level,
    duration: durationText,
    videoHoursLabel: durationText,
    category: course.category?.label ?? null,
    categoryId: course.category?.slug ?? null,
    department: course.department?.label ?? null,
    students: course._count.enrollments,
    instructorName: course.instructor.nombre,
    instructorImage: course.instructor.avatarUrl,
    enrollmentRequirement: course.enrollmentRequirement,
    autoCertificate: course.autoCertificate,
    firstLessonPath,
  };
}

function formatLessonDuration(seconds) {
  if (!seconds) return null;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// Temario publico del curso (para la pestaña "Contenido" antes de
// inscribirse): titulos y tipo de cada leccion, sin video_url ni contenido
// de texto — eso sigue gateado por enrollment en getLessonPageData.
export async function getCourseModules(slug) {
  const course = await courseRepository.findCourseModulesBySlug(slug);
  if (!course) return null;

  return course.modules.map((moduleItem) => ({
    id: moduleItem.id,
    title: moduleItem.title,
    lessons: moduleItem.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      duration: formatLessonDuration(lesson.durationSeconds),
    })),
  }));
}
