import prisma from '../config/db.js';

export function findLessonById(lessonId) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: { select: { id: true, slug: true, title: true } },
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

export function upsertEnrollment(userId, courseId, data) {
  return prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: data,
    create: { userId, courseId, ...data },
  });
}
