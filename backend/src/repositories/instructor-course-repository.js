import prisma from '../config/db.js';

export function findCoursesByInstructor(instructorId) {
  return prisma.course.findMany({
    where: { instructorId },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { enrollments: true } } },
  });
}

export function findCourseBySlugForInstructor(slug, instructorId) {
  return prisma.course.findFirst({ where: { slug, instructorId } });
}

export function findEnrollmentsForCourse(courseId) {
  return prisma.enrollment.findMany({
    where: { courseId },
    orderBy: { enrolledAt: 'desc' },
    include: { user: { select: { id: true, nombre: true, email: true } } },
  });
}

// Sin filtro de propietario: solo para uso por un actor ADMIN.
export function findCourseBySlugAny(slug) {
  return prisma.course.findFirst({ where: { slug } });
}

export function deleteCourse(courseId) {
  return prisma.course.delete({ where: { id: courseId } });
}

const courseDetailInclude = {
  department: { select: { label: true } },
  category: { select: { label: true } },
  modules: {
    orderBy: { order: 'asc' },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: { materials: { orderBy: { createdAt: 'asc' } } },
      },
    },
  },
};

export function findCourseDetailForInstructor(slug, instructorId) {
  return prisma.course.findFirst({
    where: { slug, instructorId },
    include: courseDetailInclude,
  });
}

// Sin filtro de propietario: solo para uso por un actor ADMIN.
export function findCourseDetailAny(slug) {
  return prisma.course.findFirst({ where: { slug }, include: courseDetailInclude });
}

export function findCourseBySlug(slug) {
  return prisma.course.findUnique({ where: { slug }, select: { id: true } });
}

export function createDraftCourse({ slug, title, description, instructorId }) {
  return prisma.course.create({
    data: { slug, title, description, instructorId, status: 'DRAFT' },
  });
}

export function updateCourse(courseId, data) {
  return prisma.course.update({ where: { id: courseId }, data });
}

export function publishCourse(courseId) {
  return prisma.course.update({
    where: { id: courseId },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  });
}

export function countModules(courseId) {
  return prisma.module.count({ where: { courseId } });
}

export function createModule(courseId, { title, slug, order }) {
  return prisma.module.create({ data: { courseId, title, slug, order } });
}

export function findModuleBySlug(courseId, slug) {
  return prisma.module.findUnique({
    where: { courseId_slug: { courseId, slug } },
    select: { id: true },
  });
}

export function findModuleForCourse(moduleId, courseId) {
  return prisma.module.findFirst({ where: { id: moduleId, courseId } });
}

// Scoped por courseId: las lecciones del modulo se borran en cascada
// (Lesson.moduleId tiene onDelete: Cascade).
export function deleteModule(moduleId, courseId) {
  return prisma.module.deleteMany({ where: { id: moduleId, courseId } });
}

export function countLessons(moduleId) {
  return prisma.lesson.count({ where: { moduleId } });
}

export function createLesson(moduleId, { title, slug, type, order }) {
  return prisma.lesson.create({ data: { moduleId, title, slug, type, order } });
}

export function findLessonBySlug(moduleId, slug) {
  return prisma.lesson.findUnique({
    where: { moduleId_slug: { moduleId, slug } },
    select: { id: true },
  });
}

export function findLessonForInstructor(lessonId, instructorId) {
  return prisma.lesson.findFirst({
    where: { id: lessonId, module: { course: { instructorId } } },
  });
}

// Sin filtro de propietario: solo para uso por un actor ADMIN.
export function findLessonAny(lessonId) {
  return prisma.lesson.findUnique({ where: { id: lessonId } });
}

export function updateLessonVideoKey(lessonId, videoKey, durationSeconds) {
  return prisma.lesson.update({ where: { id: lessonId }, data: { videoKey, durationSeconds } });
}

export function updateLesson(lessonId, data) {
  return prisma.lesson.update({ where: { id: lessonId }, data });
}

export function createLessonMaterial(lessonId, { fileName, fileUrl, fileType }) {
  return prisma.lessonMaterial.create({ data: { lessonId, fileName, fileUrl, fileType } });
}

// Filtra tambien por lessonId para no poder borrar el material de una
// leccion ajena aunque se adivine el materialId.
export function deleteLessonMaterial(materialId, lessonId) {
  return prisma.lessonMaterial.deleteMany({ where: { id: materialId, lessonId } });
}
