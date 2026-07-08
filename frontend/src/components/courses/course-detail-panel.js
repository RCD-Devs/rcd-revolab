import Image from "next/image";
import Link from "next/link";
import styles from "./course-detail-panel.module.css";

const stats = [
  { icon: "/icons/clock.svg", key: "videoHours" },
  { icon: "/icons/course-level.svg", key: "level" },
  { icon: "/icons/course-transcript.svg", key: "includesTranscripts" },
  { icon: "/icons/course-certificate.svg", key: "includesCertificate" },
];

export default function CourseDetailPanel({ course }) {
  const lessonUrl = `/cursos/${course.id}/leccion/1`;

  return (
    <aside className={styles.panel}>
      <div className={styles.preview}>
        <Image src={course.image} alt="" fill className={styles.previewImage} />
        <div className={styles.previewOverlay}>
          <Link href={lessonUrl} className={styles.playButton} aria-label="Comenzar curso">
            <Image src="/icons/course-play.svg" alt="" width={24} height={24} />
          </Link>
        </div>
      </div>

      <div className={styles.body}>
        <Link href={lessonUrl} className={styles.ctaButton}>
          Comenzar curso
          <Image src="/icons/course-play.svg" alt="" width={16} height={16} />
        </Link>

        <ul className={styles.stats}>
          {stats.map((stat) => (
            <li key={stat.key} className={styles.stat}>
              <Image src={stat.icon} alt="" width={20} height={20} />
              <span>{course[stat.key]}</span>
            </li>
          ))}
        </ul>

        <div className={styles.certificate}>
          <div className={styles.certificateContent}>
            <span className={styles.certificateIcon}>
              <Image src="/icons/course-certificate.svg" alt="" width={20} height={20} />
            </span>
            <div className={styles.certificateText}>
              <p className={styles.certificateLabel}>Certificado</p>
              <p className={styles.certificateName}>{course.certificateName}</p>
            </div>
          </div>
          <div className={styles.certificateLock}>
            <Image src="/icons/course-lock.svg" alt="" width={24} height={24} />
          </div>
        </div>
      </div>
    </aside>
  );
}
