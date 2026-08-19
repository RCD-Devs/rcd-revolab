import * as adminRepository from '../repositories/admin-repository.js';

export async function getAdminStats() {
  const [activeUsers, publishedCourses, totalEnrollments, completedEnrollments] =
    await Promise.all([
      adminRepository.countUsers(),
      adminRepository.countPublishedCourses(),
      adminRepository.countEnrollments(),
      adminRepository.countCompletedEnrollments(),
    ]);

  const completionRate =
    totalEnrollments === 0 ? 0 : Math.round((completedEnrollments / totalEnrollments) * 100);

  return { activeUsers, publishedCourses, completionRate };
}

export async function getAdminUsers() {
  const users = await adminRepository.findAllUsersWithStats();

  return users.map((user) => ({
    id: user.id,
    name: user.nombre,
    email: user.email,
    role: user.role,
    area: user.department?.label ?? null,
    rank: user.rank?.title ?? null,
    completedCourses: user._count.enrollments,
    lastActivity: user.updatedAt,
  }));
}
