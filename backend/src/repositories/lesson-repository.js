import prisma from '../config/db.js';

export function findLessonById(lessonId) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              instructorId: true,
              enrollmentRequirement: true,
            },
          },
        },
      },
    },
  });
}

export function findLessonProgress(userId, lessonId) {
  return prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
}

export function upsertLessonProgress(userId, lessonId, data) {
  return prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: data,
    create: { userId, lessonId, ...data },
  });
}

export function countCourseLessons(courseId) {
  return prisma.lesson.count({ where: { module: { courseId } } });
}

export function countCompletedLessonsForUser(userId, courseId) {
  return prisma.lessonProgress.count({
    where: { userId, completed: true, lesson: { module: { courseId } } },
  });
}

export async function findCourseFinalExamId(courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { finalExam: { select: { id: true } } },
  });
  return course?.finalExam?.id ?? null;
}

// Filtra por el slug publico del curso (no el id interno) porque asi es
// como el frontend identifica cursos en cualquier URL.
export function dropEnrollmentByCourseSlug(userId, courseSlug) {
  return prisma.enrollment.updateMany({
    where: { userId, course: { slug: courseSlug }, status: { not: 'COMPLETED' } },
    data: { status: 'DROPPED' },
  });
}

export function upsertEnrollment(userId, courseId, data) {
  return prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: data,
    create: { userId, courseId, ...data },
  });
}

// Crea el Enrollment en el primer acceso al contenido del curso; si ya
// existe no lo toca salvo que este DROPPED (el usuario lo habia cancelado
// y volvio) - ahi lo reactiva a IN_PROGRESS sin tocar progressPercent ni
// el historial de LessonProgress, que no se borran al cancelar. No usa
// upsert con update vacio porque Prisma igual tira P2002 en ese caso.
export async function ensureEnrollment(userId, courseId) {
  try {
    return await prisma.enrollment.create({
      data: { userId, courseId, status: 'IN_PROGRESS', progressPercent: 0 },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
      if (existing?.status === 'DROPPED') {
        return prisma.enrollment.update({
          where: { userId_courseId: { userId, courseId } },
          data: { status: 'IN_PROGRESS' },
        });
      }
      return existing;
    }
    throw error;
  }
}

export function findCourseStructureBySlug(slug) {
  return prisma.course.findFirst({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: {
              quiz: { select: { id: true, title: true, description: true } },
              materials: { orderBy: { createdAt: 'asc' } },
            },
          },
        },
      },
      finalExam: { select: { id: true, title: true } },
    },
  });
}

export function findLessonProgressForCourse(userId, courseId) {
  return prisma.lessonProgress.findMany({
    where: { userId, lesson: { module: { courseId } } },
    select: { lessonId: true, completed: true },
  });
}
