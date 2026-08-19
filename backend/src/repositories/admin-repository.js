import prisma from '../config/db.js';

export function countUsers() {
  return prisma.user.count();
}

export function countPublishedCourses() {
  return prisma.course.count({ where: { status: 'PUBLISHED' } });
}

export function countEnrollments() {
  return prisma.enrollment.count();
}

export function countCompletedEnrollments() {
  return prisma.enrollment.count({ where: { status: 'COMPLETED' } });
}

export function findAllUsersWithStats() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nombre: true,
      email: true,
      role: true,
      department: { select: { label: true } },
      rank: { select: { title: true } },
      updatedAt: true,
      _count: {
        select: {
          enrollments: { where: { status: 'COMPLETED' } },
        },
      },
    },
  });
}
