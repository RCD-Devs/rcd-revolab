import Image from "next/image";
import Link from "next/link";
import styles from "./course-exam-nav.module.css";

export default function CourseExamNav({ courseId, previousLessonId, showExamActive = true }) {
  const previousHref = previousLessonId
    ? `/cursos/${courseId}/leccion/${previousLessonId}`
    : null;

  return (
    <nav className={styles.nav} aria-label="Navegación del examen">
      {previousHref ? (
        <Link href={previousHref} className={styles.navButtonLink}>
          <Image src="/icons/chevron-left.svg" alt="" width={16} height={16} />
          Anterior
        </Link>
      ) : (
        <span className={styles.navButton} aria-disabled="true">
          <Image src="/icons/chevron-left.svg" alt="" width={16} height={16} />
          Anterior
        </span>
      )}

      {showExamActive ? (
        <span className={styles.navButtonActive}>
          Examen
          <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
        </span>
      ) : null}
    </nav>
  );
}
