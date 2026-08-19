import * as instructorCourseRepository from '../repositories/instructor-course-repository.js';
import { getStorageProvider } from '../integrations/storage/storage-provider.js';
import { slugify } from '../validations/slug.js';

function mapCourseSummary(course) {
  return {
    id: course.slug,
    title: course.title,
    status: course.status,
    coverImageUrl: course.coverImageUrl,
    students: course._count.enrollments,
  };
}

// Un ADMIN puede operar sobre el curso de cualquier instructor; un
// INSTRUCTOR solo sobre los propios. Centraliza esa resolucion aqui
// para que cada operacion de este servicio respete el mismo control.
function resolveCourse(slug, actorId, isAdmin) {
  if (isAdmin) return instructorCourseRepository.findCourseBySlugAny(slug);
  return instructorCourseRepository.findCourseBySlugForInstructor(slug, actorId);
}

function resolveCourseDetail(slug, actorId, isAdmin) {
  if (isAdmin) return instructorCourseRepository.findCourseDetailAny(slug);
  return instructorCourseRepository.findCourseDetailForInstructor(slug, actorId);
}

function resolveLesson(lessonId, actorId, isAdmin) {
  if (isAdmin) return instructorCourseRepository.findLessonAny(lessonId);
  return instructorCourseRepository.findLessonForInstructor(lessonId, actorId);
}

export async function listInstructorCourses(instructorId) {
  const courses = await instructorCourseRepository.findCoursesByInstructor(instructorId);
  return courses.map(mapCourseSummary);
}

export async function getCourseForEdit(slug, actorId, isAdmin = false) {
  const course = await resolveCourseDetail(slug, actorId, isAdmin);
  if (!course) return null;

  return {
    id: course.slug,
    title: course.title,
    description: course.description,
    status: course.status,
    coverImageUrl: course.coverImageUrl,
    visibility: course.visibility,
    enrollmentRequirement: course.enrollmentRequirement,
    autoCertificate: course.autoCertificate,
    departmentId: course.departmentId,
    department: course.department?.label ?? null,
    modules: course.modules.map((moduleItem) => ({
      id: moduleItem.id,
      title: moduleItem.title,
      lessons: moduleItem.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
      })),
    })),
  };
}

async function generateUniqueSlug(title) {
  const base = slugify(title) || 'curso';
  let slug = base;
  let suffix = 2;

  while (await instructorCourseRepository.findCourseBySlug(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createDraftCourse(instructorId, { title, description }) {
  const slug = await generateUniqueSlug(title || 'nuevo-curso');

  const course = await instructorCourseRepository.createDraftCourse({
    slug,
    title: title || 'Nuevo curso',
    description: description || '',
    instructorId,
  });

  return { id: course.slug, status: course.status };
}

const EDITABLE_FIELDS = [
  'title',
  'description',
  'level',
  'durationLabel',
  'videoHoursLabel',
  'visibility',
  'enrollmentRequirement',
  'autoCertificate',
  'about',
  'learningOutcomes',
  'tools',
  'categoryId',
  'departmentId',
];

export async function updateCourseBasics(slug, actorId, payload, isAdmin = false) {
  const course = await resolveCourse(slug, actorId, isAdmin);
  if (!course) return null;

  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (payload[field] !== undefined) data[field] = payload[field];
  }

  const updated = await instructorCourseRepository.updateCourse(course.id, data);
  return { id: updated.slug, status: updated.status };
}

export async function publishCourse(slug, actorId, isAdmin = false) {
  const course = await resolveCourse(slug, actorId, isAdmin);
  if (!course) return null;

  const updated = await instructorCourseRepository.publishCourse(course.id);
  return { id: updated.slug, status: updated.status, publishedAt: updated.publishedAt };
}

export async function unpublishCourse(slug, actorId, isAdmin = false) {
  const course = await resolveCourse(slug, actorId, isAdmin);
  if (!course) return null;

  const updated = await instructorCourseRepository.updateCourse(course.id, {
    status: 'DRAFT',
    publishedAt: null,
  });
  return { id: updated.slug, status: updated.status };
}

export async function deleteCourse(slug, actorId, isAdmin = false) {
  const course = await resolveCourse(slug, actorId, isAdmin);
  if (!course) return null;

  try {
    await instructorCourseRepository.deleteCourse(course.id);
    return { id: slug, deleted: true };
  } catch (error) {
    if (error.code === 'P2003' || error.code === 'P2014') {
      return {
        id: slug,
        deleted: false,
        error:
          'No se puede eliminar: hay estudiantes inscritos o certificados emitidos. Despublícalo en su lugar.',
      };
    }
    throw error;
  }
}

export async function uploadCourseCover(slug, actorId, buffer, contentType, isAdmin = false) {
  const course = await resolveCourse(slug, actorId, isAdmin);
  if (!course) return null;

  const storage = getStorageProvider();
  const key = `courses/${slug}/cover-${Date.now()}`;
  await storage.upload(key, buffer, contentType);
  const url = await storage.getSignedUrl(key);

  const updated = await instructorCourseRepository.updateCourse(course.id, {
    coverImageUrl: url,
  });

  return { id: updated.slug, coverImageUrl: updated.coverImageUrl };
}

export async function addModule(slug, actorId, { title }, isAdmin = false) {
  const course = await resolveCourse(slug, actorId, isAdmin);
  if (!course) return null;

  const order = await instructorCourseRepository.countModules(course.id);
  const module_ = await instructorCourseRepository.createModule(course.id, {
    title: title || `Módulo ${order + 1}`,
    order,
  });

  return { id: module_.id, title: module_.title, order: module_.order };
}

export async function addLesson(slug, moduleId, actorId, { title, type }, isAdmin = false) {
  const course = await resolveCourse(slug, actorId, isAdmin);
  if (!course) return null;

  const moduleRecord = await instructorCourseRepository.findModuleForCourse(
    moduleId,
    course.id,
  );
  if (!moduleRecord) return null;

  const order = await instructorCourseRepository.countLessons(moduleId);
  const lesson = await instructorCourseRepository.createLesson(moduleId, {
    title: title || `Lección ${order + 1}`,
    type: type || 'VIDEO',
    order,
  });

  return { id: lesson.id, title: lesson.title, type: lesson.type, order: lesson.order };
}

export async function uploadLessonVideo(lessonId, actorId, buffer, contentType, isAdmin = false) {
  const lesson = await resolveLesson(lessonId, actorId, isAdmin);
  if (!lesson) return null;

  const storage = getStorageProvider();
  const key = `lessons/${lessonId}/video-${Date.now()}`;
  await storage.upload(key, buffer, contentType);

  const updated = await instructorCourseRepository.updateLessonVideoKey(lessonId, key);
  return { id: updated.id, videoUrl: await storage.getSignedUrl(key) };
}
