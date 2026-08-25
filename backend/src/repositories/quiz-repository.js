import prisma from '../config/db.js';

const withQuestionsAndOptions = {
  questions: {
    orderBy: { order: 'asc' },
    include: { options: { orderBy: { order: 'asc' } } },
  },
};

export function findLessonQuiz(lessonId) {
  return prisma.quiz.findUnique({
    where: { lessonId },
    include: {
      ...withQuestionsAndOptions,
      lesson: {
        select: {
          module: {
            select: {
              course: {
                select: { id: true, instructorId: true, enrollmentRequirement: true },
              },
            },
          },
        },
      },
    },
  });
}

export function findCourseExam(courseId) {
  return prisma.quiz.findUnique({
    where: { courseId },
    include: withQuestionsAndOptions,
  });
}

export function createQuizAttempt({ userId, quizId, answers, score, passed }) {
  return prisma.quizAttempt.create({
    data: { userId, quizId, answers, score, passed },
  });
}

export async function hasPassedAttempt(userId, quizId) {
  const attempt = await prisma.quizAttempt.findFirst({
    where: { userId, quizId, passed: true },
    select: { id: true },
  });
  return Boolean(attempt);
}

// Todos los intentos de un grupo de usuarios en un quiz, mas recientes
// primero. El caller se queda con el primero por userId (el mas reciente).
export function findAttemptsForQuiz(quizId, userIds) {
  return prisma.quizAttempt.findMany({
    where: { quizId, userId: { in: userIds } },
    orderBy: { attemptedAt: 'desc' },
    select: { userId: true, score: true, passed: true, attemptedAt: true },
  });
}
