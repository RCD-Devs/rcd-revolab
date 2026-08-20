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
