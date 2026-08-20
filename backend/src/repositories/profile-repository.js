import prisma from '../config/db.js';

export function findUserProfile(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nombre: true,
      email: true,
      avatarUrl: true,
      careerIqNote: true,
      department: { select: { label: true } },
      rank: { select: { key: true, title: true, category: true, order: true } },
    },
  });
}

export function findEnrollmentsByStatus(userId, status) {
  return prisma.enrollment.findMany({
    where: { userId, status },
    orderBy: { enrolledAt: 'desc' },
    include: {
      course: { select: { slug: true, title: true, coverImageUrl: true } },
    },
  });
}

export function findCertificatesByUser(userId) {
  return prisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: 'desc' },
    include: {
      course: { select: { slug: true, title: true } },
    },
  });
}

export function findAllRanksOrdered() {
  return prisma.rank.findMany({ orderBy: { order: 'asc' } });
}

export function findRankByKey(key) {
  return prisma.rank.findUnique({ where: { key } });
}

export function updateUserProfile(userId, data) {
  return prisma.user.update({ where: { id: userId }, data });
}

export function findUserPasswordHash(userId) {
  return prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
}
