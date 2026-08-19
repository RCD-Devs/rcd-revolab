import * as lessonRepository from '../repositories/lesson-repository.js';
import { recalculateEnrollmentProgress } from './enrollment.js';

export async function getLessonForUser(lessonId, userId) {
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) return null;

  const progress = await lessonRepository.findLessonProgress(userId, lessonId);

  return {
    id: lesson.id,
    title: lesson.title,
    type: lesson.type,
    order: lesson.order,
    durationSeconds: lesson.durationSeconds,
    transcript: lesson.transcript,
    videoUrl: lesson.videoKey ? `/api/media/${lesson.videoKey}` : null,
    documentUrl: lesson.documentUrl,
    course: {
      id: lesson.module.course.slug,
      title: lesson.module.course.title,
    },
    progress: {
      completed: progress?.completed ?? false,
      lastPositionSeconds: progress?.lastPositionSeconds ?? 0,
    },
  };
}

export async function completeLesson(lessonId, userId) {
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) return null;

  await lessonRepository.upsertLessonProgress(userId, lessonId, {
    completed: true,
    completedAt: new Date(),
  });

  const enrollment = await recalculateEnrollmentProgress(userId, lesson.module.course.id);

  return {
    lessonId,
    completed: true,
    courseProgressPercent: enrollment.progressPercent,
    courseStatus: enrollment.status,
  };
}

export async function updateLessonPosition(lessonId, userId, positionSeconds) {
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) return null;

  const progress = await lessonRepository.upsertLessonProgress(userId, lessonId, {
    lastPositionSeconds: positionSeconds,
  });

  return { lessonId, lastPositionSeconds: progress.lastPositionSeconds };
}
