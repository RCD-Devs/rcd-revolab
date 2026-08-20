import * as lessonRepository from '../repositories/lesson-repository.js';
import * as profileRepository from '../repositories/profile-repository.js';

const SPECIALIST_RANK_KEY = 'especialista';

// Gate de acceso al contenido de un curso (lecciones, quizzes, examen).
// Admin y el instructor dueño del curso siempre pasan. Para el resto, si
// el curso exige rango Especialista o superior y el usuario no lo tiene,
// se bloquea. Si pasa, se asegura su Enrollment (se crea en el primer
// acceso real al contenido; si ya existe no se toca su progreso/estado).
export async function ensureCourseAccess({ userId, role, course }) {
  const isAdmin = role === 'ADMIN';
  const isOwnerInstructor = role === 'INSTRUCTOR' && course.instructorId === userId;
  if (isAdmin || isOwnerInstructor) return { allowed: true };

  if (course.enrollmentRequirement === 'RANK_SPECIALIST') {
    const [profile, requiredRank] = await Promise.all([
      profileRepository.findUserProfile(userId),
      profileRepository.findRankByKey(SPECIALIST_RANK_KEY),
    ]);
    const userOrder = profile?.rank?.order ?? -1;
    const requiredOrder = requiredRank?.order ?? 0;

    if (userOrder < requiredOrder) {
      return {
        allowed: false,
        reason: 'RANK_REQUIRED',
        message: `Este curso requiere el rango ${requiredRank?.title ?? 'Especialista de Misión'} o superior.`,
      };
    }
  }

  await lessonRepository.ensureEnrollment(userId, course.id);
  return { allowed: true };
}

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
