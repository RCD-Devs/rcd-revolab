import Image from "next/image";
import Link from "next/link";
import styles from "./course-lesson-sidebar.module.css";

export default function CourseLessonSidebar({
  courseId,
  module,
  currentLessonId,
  progress,
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progreso del curso</span>
          <span className={styles.progressValue}>{progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.module}>
        <h3 className={styles.moduleTitle}>{module.title}</h3>

        <ul className={styles.lessonList}>
          {module.lessons.map((lesson) => {
            const isActive = lesson.id === currentLessonId;
            const isCompleted = lesson.completed ?? false;

            return (
              <li key={lesson.id}>
                <Link
                  href={`/cursos/${courseId}/${lesson.path}`}
                  className={`${styles.lessonItem} ${isActive ? styles.lessonItemActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Image
                    src={
                      isActive || isCompleted
                        ? "/icons/lesson-active.svg"
                        : "/icons/lesson-pending.svg"
                    }
                    alt=""
                    width={20}
                    height={20}
                  />
                  <div className={styles.lessonInfo}>
                    <span className={styles.lessonTitle}>{lesson.title}</span>
                    <span className={styles.lessonDuration}>{lesson.duration}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {module.exam && (
          module.exam.locked ? (
            <div className={styles.exam}>
              <span className={styles.examInfo}>
                <Image src="/icons/exam-medal.svg" alt="" width={20} height={20} />
                <span className={styles.examTitle}>{module.exam.title}</span>
              </span>
              <Image
                src="/icons/course-lock.svg"
                alt="Bloqueado"
                width={16}
                height={16}
                className={styles.examLock}
              />
            </div>
          ) : (
            <Link href={`/cursos/${courseId}/examen`} className={styles.exam}>
              <span className={styles.examInfo}>
                <Image src="/icons/exam-medal.svg" alt="" width={20} height={20} />
                <span className={styles.examTitle}>{module.exam.title}</span>
              </span>
              <Image
                src="/icons/chevron-right.svg"
                alt=""
                width={16}
                height={16}
                className={styles.examChevron}
              />
            </Link>
          )
        )}
      </div>
    </aside>
  );
}
