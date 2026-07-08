import Image from "next/image";
import Link from "next/link";
import styles from "./course-quiz.module.css";

const PANEL_CONFIG = {
  intro: {
    icon: "/icons/quiz-brain.svg",
    iconWrap: styles.iconWrapTeal,
  },
  success: {
    icon: "/icons/quiz-success.svg",
    iconWrap: styles.iconWrapSuccess,
  },
  failure: {
    icon: "/icons/quiz-failure.svg",
    iconWrap: styles.iconWrapFailure,
  },
};

export default function CourseQuizPanel({
  variant,
  title,
  description,
  onStart,
  continueUrl,
  lessonUrl,
  onRetry,
  successCtaLabel,
  failureReviewLabel,
  failureRetryLabel,
}) {
  const { icon, iconWrap } = PANEL_CONFIG[variant];

  return (
    <section className={`${styles.card} ${styles.cardCentered}`}>
      <div className={`${styles.iconWrap} ${iconWrap}`}>
        <Image src={icon} alt="" width={40} height={40} />
      </div>

      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>

      {variant === "intro" && (
        <button type="button" className={styles.ctaPrimary} onClick={onStart}>
          Comenzar Quiz
        </button>
      )}

      {variant === "success" && (
        <Link href={continueUrl} className={styles.ctaSuccess}>
          {successCtaLabel}
          <Image src="/icons/arrow-right-white.svg" alt="" width={20} height={20} />
        </Link>
      )}

      {variant === "failure" && (
        <div className={styles.actions}>
          <Link href={lessonUrl} className={styles.ctaOutline}>
            {failureReviewLabel}
          </Link>
          <button type="button" className={styles.ctaFailure} onClick={onRetry}>
            {failureRetryLabel}
          </button>
        </div>
      )}
    </section>
  );
}
