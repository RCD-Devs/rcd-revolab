import Link from "next/link";
import styles from "./course-lesson-nav.module.css";

export default function CourseLessonNav({ courseId, previousLesson, nextLesson }) {
  return (
    <nav className={styles.nav} aria-label="Navegación entre lecciones">
      {previousLesson ? (
        <Link
          href={`/cursos/${courseId}/leccion/${previousLesson.id}`}
          className={styles.navButton}
        >
          <span className={`${styles.icon} ${styles.iconPrev}`} aria-hidden="true" />
          <span>Anterior</span>
        </Link>
      ) : (
        <span className={`${styles.navButton} ${styles.navButtonDisabled}`} aria-disabled="true">
          <span className={`${styles.icon} ${styles.iconPrev}`} aria-hidden="true" />
          <span>Anterior</span>
        </span>
      )}

      {nextLesson ? (
        <Link
          href={`/cursos/${courseId}/leccion/${nextLesson.id}`}
          className={`${styles.navButton} ${styles.navButtonNext}`}
        >
          <span>Siguiente lección</span>
          <span className={`${styles.icon} ${styles.iconNext}`} aria-hidden="true" />
        </Link>
      ) : (
        <span
          className={`${styles.navButton} ${styles.navButtonNext} ${styles.navButtonDisabled}`}
          aria-disabled="true"
        >
          <span>Siguiente lección</span>
          <span className={`${styles.icon} ${styles.iconNext}`} aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
