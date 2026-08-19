import * as lessonRepository from '../repositories/lesson-repository.js';

// Recalcula el progreso de un usuario en un curso a partir de sus
// LessonProgress reales, y actualiza (o crea) el Enrollment.
export async function recalculateEnrollmentProgress(userId, courseId) {
  const [total, completed] = await Promise.all([
    lessonRepository.countCourseLessons(courseId),
    lessonRepository.countCompletedLessonsForUser(userId, courseId),
  ]);

  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const isCompleted = total > 0 && completed >= total;

  return lessonRepository.upsertEnrollment(userId, courseId, {
    progressPercent,
    status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
    ...(isCompleted ? { completedAt: new Date() } : {}),
  });
}
