import prisma from '../config/db.js';

export function findNotificationsForUser(userId) {
  return prisma.notification.findMany({
    where: { OR: [{ userId }, { userId: null }] },
    orderBy: { createdAt: 'desc' },
  });
}

export function findNotificationById(id) {
  return prisma.notification.findUnique({ where: { id } });
}

export function markNotificationRead(id) {
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
}
