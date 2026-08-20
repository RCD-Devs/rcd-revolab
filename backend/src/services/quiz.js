import * as quizRepository from '../repositories/quiz-repository.js';
import * as courseRepository from '../repositories/course-repository.js';
import { recalculateEnrollmentProgress, ensureCourseAccess } from './enrollment.js';
import { issueCertificate } from './certificates.js';

// Misma lógica que calculateExamScore en frontend/src/data/course-exam-data.js,
// movida a servidor para que sea la fuente de verdad (el cliente no debe
// poder inflar su propio puntaje).
function calculateScore(questions, answers) {
  const total = questions.length;
  if (total === 0) return 0;

  const correct = questions.reduce((count, question) => {
    const selectedId = answers[question.id];
    const selected = question.options.find((option) => option.id === selectedId);
    return selected?.isCorrect ? count + 1 : count;
  }, 0);

  return Math.round((correct / total) * 100);
}

function toPublicQuestion(question) {
  return {
    id: question.id,
    text: question.text,
    order: question.order,
    options: question.options.map((option) => ({ id: option.id, label: option.label })),
  };
}

export async function getLessonQuiz(lessonId, userId, role) {
  const quiz = await quizRepository.findLessonQuiz(lessonId);
  if (!quiz) return null;

  const access = await ensureCourseAccess({ userId, role, course: quiz.lesson.module.course });
  if (!access.allowed) return { accessDenied: true, message: access.message };

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    passThreshold: quiz.passThreshold,
    questions: quiz.questions.map(toPublicQuestion),
  };
}

export async function submitLessonQuiz(lessonId, userId, answers, role) {
  const quiz = await quizRepository.findLessonQuiz(lessonId);
  if (!quiz) return null;

  const access = await ensureCourseAccess({ userId, role, course: quiz.lesson.module.course });
  if (!access.allowed) return { accessDenied: true, message: access.message };

  const score = calculateScore(quiz.questions, answers);
  const passed = score >= quiz.passThreshold;

  await quizRepository.createQuizAttempt({ userId, quizId: quiz.id, answers, score, passed });

  return { score, passed, passThreshold: quiz.passThreshold };
}

export async function getCourseExam(courseSlug, userId, role) {
  const course = await courseRepository.findCourseForExamBySlug(courseSlug);
  if (!course) return null;

  const access = await ensureCourseAccess({ userId, role, course });
  if (!access.allowed) return { accessDenied: true, message: access.message };

  const quiz = await quizRepository.findCourseExam(course.id);
  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    passThreshold: quiz.passThreshold,
    questions: quiz.questions.map(toPublicQuestion),
  };
}

export async function submitCourseExam(courseSlug, userId, answers, role) {
  const course = await courseRepository.findCourseForExamBySlug(courseSlug);
  if (!course) return null;

  const access = await ensureCourseAccess({ userId, role, course });
  if (!access.allowed) return { accessDenied: true, message: access.message };

  const quiz = await quizRepository.findCourseExam(course.id);
  if (!quiz) return null;

  const score = calculateScore(quiz.questions, answers);
  const passed = score >= quiz.passThreshold;

  await quizRepository.createQuizAttempt({ userId, quizId: quiz.id, answers, score, passed });

  let certificate = null;

  if (passed) {
    await recalculateEnrollmentProgress(userId, course.id);
    if (course.autoCertificate) {
      certificate = await issueCertificate({ userId, course });
    }
  }

  return {
    score,
    passed,
    passThreshold: quiz.passThreshold,
    certificateId: certificate?.id ?? null,
  };
}
