import Image from "next/image";
import Link from "next/link";
import styles from "./course-exam.module.css";

const PANEL_CONFIG = {
  intro: {
    icon: "/icons/exam-medal.svg",
    iconWrap: styles.iconWrapExam,
    iconSize: 40,
  },
  success: {
    icon: "/icons/exam-medal.svg",
    iconWrap: styles.iconWrapSuccess,
    iconSize: 48,
  },
  failure: {
    icon: "/icons/exam-failure.svg",
    iconWrap: styles.iconWrapFailure,
    iconSize: 40,
  },
};

export default function CourseExamPanel({
  variant,
  title,
  description,
  score,
  onStart,
  certificateUrl,
  onRetry,
  pdfUrl,
  startLabel,
  successCtaLabel,
  failureReviewLabel,
  pdfLabel,
}) {
  const { icon, iconWrap, iconSize } = PANEL_CONFIG[variant];

  return (
    <section
      className={`${styles.card} ${styles.cardCentered} ${
        variant === "failure" ? styles.cardFailure : ""
      }`}
    >
      <div className={`${styles.iconWrap} ${iconWrap}`}>
        <Image src={icon} alt="" width={iconSize} height={iconSize} />
      </div>

      <h1 className={styles.title}>{title}</h1>

      {typeof score === "number" && (variant === "success" || variant === "failure") && (
        <p className={variant === "success" ? styles.scoreSuccess : styles.scoreFailure}>
          Puntuación: {score}%
        </p>
      )}

      <p className={styles.description}>{description}</p>

      {variant === "intro" && (
        <button type="button" className={styles.ctaPrimary} onClick={onStart}>
          {startLabel}
        </button>
      )}

      {variant === "success" && (
        <Link href={certificateUrl} className={styles.ctaPrimary}>
          {successCtaLabel}
        </Link>
      )}

      {variant === "failure" && (
        <div className={styles.failureActions}>
          <a href={pdfUrl} className={styles.ctaPdf} download>
            <Image src="/icons/download-white.svg" alt="" width={16} height={16} />
            {pdfLabel}
          </a>
          <button type="button" className={styles.ctaFailureMain} onClick={onRetry}>
            {failureReviewLabel}
          </button>
        </div>
      )}
    </section>
  );
}
