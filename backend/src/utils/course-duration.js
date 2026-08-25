// Duracion total de video de un curso, calculada a partir de la suma de
// Lesson.durationSeconds (se completa al subir cada video, ver
// instructor-courses.js#confirmLessonVideoUpload). Reemplaza a los campos
// Course.durationLabel/videoHoursLabel, que nunca tuvieron un formulario
// que los llenara.
export function sumVideoSeconds(course) {
  return (course.modules ?? []).reduce(
    (total, moduleItem) =>
      total + (moduleItem.lessons ?? []).reduce((sum, lesson) => sum + (lesson.durationSeconds ?? 0), 0),
    0,
  );
}

export function formatCourseDuration(totalSeconds) {
  if (!totalSeconds) return null;

  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
}
