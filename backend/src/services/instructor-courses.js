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
    about: course.about ?? [],
    learningOutcomes: course.learningOutcomes ?? [],
    tools: course.tools ?? [],
    modules: await Promise.all(
      course.modules.map(async (moduleItem) => ({
        id: moduleItem.id,
        title: moduleItem.title,
        lessons: await Promise.all(moduleItem.lessons.map((lesson) => mapLessonForEdit(lesson))),
      })),
    ),
  };
}

async function mapLessonForEdit(lesson) {
  return {
    id: lesson.id,
    title: lesson.title,
    type: lesson.type,
    content: lesson.content,
    videoUrl: lesson.videoKey ? await getStorageProvider().getPublicUrl(lesson.videoKey) : null,
    materials: (lesson.materials ?? []).map((material) => ({
      id: material.id,
      fileName: material.fileName,
      fileUrl: material.fileUrl,
      fileType: material.fileType,
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
  const url = await storage.getPublicUrl(key);

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

export async function removeModule(slug, moduleId, actorId, isAdmin = false) {
  const course = await resolveCourse(slug, actorId, isAdmin);
  if (!course) return null;

  const result = await instructorCourseRepository.deleteModule(moduleId, course.id);
  return { deleted: result.count > 0 };
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

// El video no pasa por esta función serverless: el navegador lo sube
// directo al storage con la URL que devuelve esto (ver getUploadUrl en el
// contrato de storage-provider). Evita el límite de 4.5 MB que Vercel le
// impone al body de una función.
function lessonVideoKey(lessonId) {
  return `lessons/${lessonId}/video-${Date.now()}`;
}

export async function createLessonVideoUploadUrl(lessonId, actorId, contentType, isAdmin = false) {
  const lesson = await resolveLesson(lessonId, actorId, isAdmin);
  if (!lesson) return null;

  const storage = getStorageProvider();
  const key = lessonVideoKey(lessonId);
  const uploadUrl = await storage.getUploadUrl(key, contentType);
  return { key, uploadUrl };
}

// Se llama después de que el navegador terminó el PUT directo al storage,
// para recién ahí guardar la key en la lección. Verifica que el objeto
// exista de verdad antes de guardarlo, para no dejar una key "fantasma" si
// el PUT directo falló pero el frontend igual llegó a confirmar.
export async function confirmLessonVideoUpload(
  lessonId,
  actorId,
  key,
  durationSeconds,
  isAdmin = false,
) {
  const lesson = await resolveLesson(lessonId, actorId, isAdmin);
  if (!lesson) return null;

  if (!key.startsWith(`lessons/${lessonId}/video-`)) {
    return { error: 'INVALID_KEY' };
  }

  const storage = getStorageProvider();
  if (!(await storage.exists(key))) {
    return { error: 'NOT_UPLOADED' };
  }

  // El navegador mide la duracion leyendo los metadatos del archivo local
  // (ver readVideoDuration en instructor-lesson-editor-modal.js); si por lo
  // que sea no llega o no es un numero, se guarda como null en vez de
  // asumir 0 (0 se sumaria como "sin duracion" en el total del curso).
  const safeDuration = Number.isFinite(durationSeconds) ? Math.round(durationSeconds) : null;

  const updated = await instructorCourseRepository.updateLessonVideoKey(lessonId, key, safeDuration);
  return { id: updated.id, videoUrl: await storage.getPublicUrl(key) };
}

export async function updateLesson(lessonId, actorId, { title, content }, isAdmin = false) {
  const lesson = await resolveLesson(lessonId, actorId, isAdmin);
  if (!lesson) return null;

  const data = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;

  const updated = await instructorCourseRepository.updateLesson(lessonId, data);
  return { id: updated.id, title: updated.title, content: updated.content };
}

export async function uploadLessonMaterial(
  lessonId,
  actorId,
  buffer,
  contentType,
  fileName,
  isAdmin = false,
) {
  const lesson = await resolveLesson(lessonId, actorId, isAdmin);
  if (!lesson) return null;

  const storage = getStorageProvider();
  const extension = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
  const key = `lessons/${lessonId}/materials/${Date.now()}${extension}`;
  await storage.upload(key, buffer, contentType);
  const fileUrl = await storage.getPublicUrl(key);

  const material = await instructorCourseRepository.createLessonMaterial(lessonId, {
    fileName,
    fileUrl,
    fileType: contentType,
  });

  return { id: material.id, fileName: material.fileName, fileUrl: material.fileUrl, fileType: material.fileType };
}

export async function deleteLessonMaterial(materialId, lessonId, actorId, isAdmin = false) {
  const lesson = await resolveLesson(lessonId, actorId, isAdmin);
  if (!lesson) return null;

  const result = await instructorCourseRepository.deleteLessonMaterial(materialId, lessonId);
  return { deleted: result.count > 0 };
}
