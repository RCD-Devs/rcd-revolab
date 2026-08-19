import * as notificationRepository from '../repositories/notification-repository.js';

export async function getNotifications(userId) {
  const notifications = await notificationRepository.findNotificationsForUser(userId);

  return notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    description: notification.description,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  }));
}

export async function markAsRead(notificationId, userId) {
  const notification = await notificationRepository.findNotificationById(notificationId);
  if (!notification) return null;
  if (notification.userId !== null && notification.userId !== userId) return null;

  const updated = await notificationRepository.markNotificationRead(notificationId);
  return { id: updated.id, isRead: updated.isRead };
}
