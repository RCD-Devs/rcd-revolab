import * as lessonRepository from '../repositories/lesson-repository.js';
import { recalculateEnrollmentProgress, ensureCourseAccess } from './enrollment.js';
import { getStorageProvider } from '../integrations/storage/storage-provider.js';

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// Arma todo lo que necesita la pagina de una leccion: la leccion actual,
// el modulo (con progreso real por leccion para el sidebar), navegacion
// anterior/siguiente y, si la leccion tiene quiz, sus metadatos.
export async function getLessonPageData(courseSlug, lessonId, userId, role) {
  const course = await lessonRepository.findCourseStructureBySlug(courseSlug);
  if (!course) return null;

  const access = await ensureCourseAccess({ userId, role, course });
  if (!access.allowed) return { accessDenied: true, message: access.message };

  const allLessons = course.modules.flatMap((moduleItem) => moduleItem.lessons);
  const lessonIndex = allLessons.findIndex((item) => item.id === lessonId);
  if (lessonIndex === -1) return null;

  const currentLesson = allLessons[lessonIndex];
  const currentModule = course.modules.find((moduleItem) =>
    moduleItem.lessons.some((item) => item.id === lessonId),
  );

  const progressRows = await lessonRepository.findLessonProgressForCourse(userId, course.id);
  const progressMap = new Map(progressRows.map((row) => [row.lessonId, row.completed]));

  const completedCount = allLessons.filter((item) => progressMap.get(item.id)).length;
  const progressPercent =
    allLessons.length === 0 ? 0 : Math.round((completedCount / allLessons.length) * 100);

  return {
    course: { id: course.slug, title: course.title, image: course.coverImageUrl },
    module: {
      title: currentModule.title,
      lessons: currentModule.lessons.map((item) => ({
        id: item.id,
        title: item.title,
        duration: formatDuration(item.durationSeconds),
        completed: progressMap.get(item.id) ?? false,
      })),
      exam: course.finalExam
        ? { title: course.finalExam.title, locked: progressPercent < 100 }
        : null,
    },
    lesson: {
      id: currentLesson.id,
      title: currentLesson.title,
      videoUrl: currentLesson.videoKey
        ? await getStorageProvider().getPublicUrl(currentLesson.videoKey)
        : null,
    },
    previousLesson: lessonIndex > 0 ? { id: allLessons[lessonIndex - 1].id } : null,
    nextLesson:
      lessonIndex < allLessons.length - 1 ? { id: allLessons[lessonIndex + 1].id } : null,
    progress: progressPercent,
    transcript: currentLesson.transcript,
    lessonLabel: `${currentModule.title} • ${currentLesson.title}`,
    quiz: currentLesson.quiz
      ? { title: currentLesson.quiz.title, description: currentLesson.quiz.description }
      : null,
  };
}

export async function getLessonForUser(lessonId, userId, role) {
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) return null;

  const access = await ensureCourseAccess({ userId, role, course: lesson.module.course });
  if (!access.allowed) return { accessDenied: true, message: access.message };

  const progress = await lessonRepository.findLessonProgress(userId, lessonId);

  return {
    id: lesson.id,
    title: lesson.title,
    type: lesson.type,
    order: lesson.order,
    durationSeconds: lesson.durationSeconds,
    transcript: lesson.transcript,
    videoUrl: lesson.videoKey ? await getStorageProvider().getPublicUrl(lesson.videoKey) : null,
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

export async function completeLesson(lessonId, userId, role) {
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) return null;

  const access = await ensureCourseAccess({ userId, role, course: lesson.module.course });
  if (!access.allowed) return { accessDenied: true, message: access.message };

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

export async function updateLessonPosition(lessonId, userId, positionSeconds, role) {
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) return null;

  const access = await ensureCourseAccess({ userId, role, course: lesson.module.course });
  if (!access.allowed) return { accessDenied: true, message: access.message };

  const progress = await lessonRepository.upsertLessonProgress(userId, lessonId, {
    lastPositionSeconds: positionSeconds,
  });

  return { lessonId, lastPositionSeconds: progress.lastPositionSeconds };
}
