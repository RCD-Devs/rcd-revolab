import Image from "next/image";
import Link from "next/link";
import layoutStyles from "./course-lesson-quiz-cta.module.css";
import styles from "./course-quiz.module.css";

export default function CourseLessonQuizCta({ courseId, lessonId, quiz }) {
  return (
    <section className={layoutStyles.card} aria-label="Quiz de lección">
      <div className={layoutStyles.info}>
        <div className={`${styles.iconWrap} ${styles.iconWrapTeal} ${layoutStyles.iconWrap}`}>
          <Image src="/icons/quiz-brain.svg" alt="" width={24} height={24} />
        </div>

        <div className={layoutStyles.copy}>
          <h2 className={layoutStyles.title}>{quiz.title}</h2>
          <p className={layoutStyles.description}>{quiz.description}</p>
        </div>
      </div>

      <Link
        href={`/cursos/${courseId}/leccion/${lessonId}/quiz`}
        className={`${styles.ctaPrimary} ${styles.ctaPrimaryCompact}`}
      >
        Comenzar Quiz
      </Link>
    </section>
  );
}
