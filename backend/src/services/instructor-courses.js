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

export async function listInstructorCourses(instructorId) {
  const courses = await instructorCourseRepository.findCoursesByInstructor(instructorId);
  return courses.map(mapCourseSummary);
}

export async function getCourseForEdit(slug, instructorId) {
  const course = await instructorCourseRepository.findCourseDetailForInstructor(
    slug,
    instructorId,
  );
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

export async function updateCourseBasics(slug, instructorId, payload) {
  const course = await instructorCourseRepository.findCourseBySlugForInstructor(
    slug,
    instructorId,
  );
  if (!course) return null;

  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (payload[field] !== undefined) data[field] = payload[field];
  }

  const updated = await instructorCourseRepository.updateCourse(course.id, data);
  return { id: updated.slug, status: updated.status };
}

export async function publishCourse(slug, instructorId) {
  const course = await instructorCourseRepository.findCourseBySlugForInstructor(
    slug,
    instructorId,
  );
  if (!course) return null;

  const updated = await instructorCourseRepository.publishCourse(course.id);
  return { id: updated.slug, status: updated.status, publishedAt: updated.publishedAt };
}

export async function uploadCourseCover(slug, instructorId, buffer, contentType) {
  const course = await instructorCourseRepository.findCourseBySlugForInstructor(
    slug,
    instructorId,
  );
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

export async function addModule(slug, instructorId, { title }) {
  const course = await instructorCourseRepository.findCourseBySlugForInstructor(
    slug,
    instructorId,
  );
  if (!course) return null;

  const order = await instructorCourseRepository.countModules(course.id);
  const module_ = await instructorCourseRepository.createModule(course.id, {
    title: title || `Módulo ${order + 1}`,
    order,
  });

  return { id: module_.id, title: module_.title, order: module_.order };
}

export async function addLesson(slug, moduleId, instructorId, { title, type }) {
  const course = await instructorCourseRepository.findCourseBySlugForInstructor(
    slug,
    instructorId,
  );
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

export async function uploadLessonVideo(lessonId, instructorId, buffer, contentType) {
  const lesson = await instructorCourseRepository.findLessonForInstructor(
    lessonId,
    instructorId,
  );
  if (!lesson) return null;

  const storage = getStorageProvider();
  const key = `lessons/${lessonId}/video-${Date.now()}`;
  await storage.upload(key, buffer, contentType);

  const updated = await instructorCourseRepository.updateLessonVideoKey(lessonId, key);
  return { id: updated.id, videoUrl: await storage.getSignedUrl(key) };
}
