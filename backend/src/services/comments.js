import * as commentRepository from '../repositories/comment-repository.js';

function mapComment(comment) {
  return {
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt,
    authorName: comment.user.nombre,
    authorAvatar: comment.user.avatarUrl,
  };
}

// Lectura publica (misma logica que la pestaña "Contenido": sirve como
// vitrina para quien todavia no se inscribe). Solo escribir esta gateado.
export async function getCourseComments(courseSlug) {
  const course = await commentRepository.findCourseForComments(courseSlug);
  if (!course) return null;

  const comments = await commentRepository.findCommentsByCourse(course.id);
  return comments.map(mapComment);
}

// Comentar requiere estar inscrito (o ser el instructor dueño / admin) —
// mismo criterio "si inscrito" que el resto del contenido del curso
// (spec MVP1, seccion 9). No usa ensureEnrollment: comentar no debe
// inscribir a nadie por su cuenta.
export async function addCourseComment(courseSlug, userId, role, body) {
  const course = await commentRepository.findCourseForComments(courseSlug);
  if (!course) return null;

  const trimmed = body?.trim();
  if (!trimmed) return { error: 'EMPTY' };

  const isAdmin = role === 'ADMIN';
  const isOwnerInstructor = role === 'INSTRUCTOR' && course.instructorId === userId;
  if (!isAdmin && !isOwnerInstructor) {
    const enrollment = await commentRepository.findActiveEnrollment(userId, course.id);
    if (!enrollment) return { error: 'NOT_ENROLLED' };
  }

  const comment = await commentRepository.createComment(course.id, userId, trimmed);
  return mapComment(comment);
}
