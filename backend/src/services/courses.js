import * as courseRepository from '../repositories/course-repository.js';

const FEATURED_LIMIT = 6;
const RECOMMENDED_LIMIT = 4;

function mapCourseSummary(course) {
  return {
    id: course.slug,
    title: course.title,
    description: course.description,
    image: course.coverImageUrl,
    level: course.level,
    duration: course.durationLabel,
    category: course.category?.label ?? null,
    categoryId: course.category?.slug ?? null,
    students: course._count.enrollments,
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

  return {
    id: course.slug,
    title: course.title,
    description: course.description,
    about: course.about,
    learningOutcomes: course.learningOutcomes,
    tools: course.tools,
    image: course.coverImageUrl,
    level: course.level,
    duration: course.durationLabel,
    videoHoursLabel: course.videoHoursLabel,
    category: course.category?.label ?? null,
    categoryId: course.category?.slug ?? null,
    department: course.department?.label ?? null,
    students: course._count.enrollments,
    instructorName: course.instructor.nombre,
    instructorImage: course.instructor.avatarUrl,
    enrollmentRequirement: course.enrollmentRequirement,
    autoCertificate: course.autoCertificate,
  };
}

export async function getCourseModules(slug) {
  const course = await courseRepository.findCourseModulesBySlug(slug);
  return course?.modules ?? null;
}
