import Image from "next/image";
import Link from "next/link";
import styles from "./course-detail-panel.module.css";

const stats = [
  { icon: "/icons/clock.svg", key: "videoHoursLabel" },
  { icon: "/icons/course-level.svg", key: "level" },
  { icon: "/icons/course-transcript.svg", key: "transcriptsLabel" },
  { icon: "/icons/course-certificate.svg", key: "certificateLabel" },
];

export default function CourseDetailPanel({ course }) {
  const panelCourse = {
    ...course,
    transcriptsLabel: "Incluye transcripciones",
    certificateLabel: "Certificado al finalizar",
  };
  const lessonUrl = course.firstLessonPath
    ? `/cursos/${course.id}/${course.firstLessonPath}`
    : `/cursos/${course.id}`;
  const examUrl = `/cursos/${course.id}/examen`;

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

        <Link href={examUrl} className={styles.examCtaButton}>
          <Image src="/icons/exam-medal.svg" alt="" width={20} height={20} />
          Realizar examen
        </Link>

        <ul className={styles.stats}>
          {stats.map(
            (stat) =>
              panelCourse[stat.key] && (
                <li key={stat.key} className={styles.stat}>
                  <Image src={stat.icon} alt="" width={20} height={20} />
                  <span>{panelCourse[stat.key]}</span>
                </li>
              ),
          )}
        </ul>

        <div className={styles.certificate}>
          <div className={styles.certificateContent}>
            <span className={styles.certificateIcon}>
              <Image src="/icons/course-certificate.svg" alt="" width={20} height={20} />
            </span>
            <div className={styles.certificateText}>
              <p className={styles.certificateLabel}>Certificado</p>
              <p className={styles.certificateName}>{course.title}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
