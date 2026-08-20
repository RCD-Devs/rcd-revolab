import prisma from '../config/db.js';

export function countUsers() {
  return prisma.user.count({ where: { isActive: true } });
}

export function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export function createUser(data) {
  return prisma.user.create({ data });
}

export function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data });
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

export function findAllCoursesForAdmin() {
  return prisma.course.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      instructor: { select: { nombre: true } },
      _count: { select: { enrollments: true } },
    },
  });
}

export function findAllUsersWithStats() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nombre: true,
      email: true,
      role: true,
      isActive: true,
      departmentId: true,
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
