import prisma from '../config/db.js';

export function findCourseForComments(slug) {
  return prisma.course.findUnique({ where: { slug }, select: { id: true, instructorId: true } });
}

export function findCommentsByCourse(courseId) {
  return prisma.comment.findMany({
    where: { courseId },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { nombre: true, avatarUrl: true } } },
  });
}

// DROPPED no cuenta: alguien que cancelo su inscripcion no deberia poder
// seguir comentando un curso que dejo de tomar.
export function findActiveEnrollment(userId, courseId) {
  return prisma.enrollment.findFirst({
    where: { userId, courseId, status: { not: 'DROPPED' } },
    select: { id: true },
  });
}

export function createComment(courseId, userId, body) {
  return prisma.comment.create({
    data: { courseId, userId, body },
    include: { user: { select: { nombre: true, avatarUrl: true } } },
  });
}
