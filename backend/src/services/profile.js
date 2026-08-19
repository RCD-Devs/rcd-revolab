import * as profileRepository from '../repositories/profile-repository.js';

export async function getProfile(userId) {
  const user = await profileRepository.findUserProfile(userId);
  if (!user) return null;

  return {
    id: user.id,
    name: user.nombre,
    email: user.email,
    avatar: user.avatarUrl,
    department: user.department?.label ?? null,
    rank: user.rank ? { key: user.rank.key, title: user.rank.title } : null,
    careerIqNote: user.careerIqNote,
  };
}

const STATUS_BY_QUERY = { 'in-progress': 'IN_PROGRESS', completed: 'COMPLETED' };

export async function getProfileCourses(userId, statusQuery) {
  if (statusQuery === 'certificates') {
    const certificates = await profileRepository.findCertificatesByUser(userId);
    return certificates.map((certificate) => ({
      id: certificate.id,
      title: certificate.course.title,
      courseId: certificate.course.slug,
      issuedAt: certificate.issuedAt,
    }));
  }

  const status = STATUS_BY_QUERY[statusQuery] ?? 'IN_PROGRESS';
  const enrollments = await profileRepository.findEnrollmentsByStatus(userId, status);

  return enrollments.map((enrollment) => ({
    id: enrollment.course.slug,
    title: enrollment.course.title,
    image: enrollment.course.coverImageUrl,
    progress: enrollment.progressPercent,
  }));
}

export async function getProfileRank(userId) {
  const user = await profileRepository.findUserProfile(userId);
  if (!user) return null;

  const ranks = await profileRepository.findAllRanksOrdered();
  const currentIndex = user.rank ? ranks.findIndex((rank) => rank.key === user.rank.key) : -1;
  const nextRank = currentIndex >= 0 ? ranks[currentIndex + 1] : ranks[0];

  return {
    current: user.rank ? { key: user.rank.key, title: user.rank.title, category: user.rank.category } : null,
    next: nextRank ? { key: nextRank.key, title: nextRank.title, category: nextRank.category } : null,
    careerIqNote: user.careerIqNote,
    allRanks: ranks.map((rank) => ({ key: rank.key, title: rank.title, category: rank.category })),
  };
}
