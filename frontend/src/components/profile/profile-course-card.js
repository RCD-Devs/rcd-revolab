import Image from "next/image";
import Link from "next/link";
import styles from "./profile-course-card.module.css";

export default function ProfileCourseCard({ course, completed = false }) {
  return (
    <Link
      href={course.href}
      className={`${styles.card} ${completed ? styles.cardCompleted : ""}`}
    >
      <div className={styles.thumbnail}>
        <Image
          src={course.image}
          alt=""
          fill
          className={`${styles.thumbnailImage} ${completed ? styles.thumbnailImageCompleted : ""}`}
        />
        <span className={styles.thumbnailOverlay}>
          {completed ? (
            <Image src="/icons/profile-course-check.svg" alt="" width={32} height={32} />
          ) : (
            <Image src="/icons/course-play.svg" alt="" width={32} height={32} />
          )}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{course.title}</h3>
        <div className={`${styles.meta} ${completed ? styles.metaCompleted : ""}`}>
          <span>{completed ? course.statusLabel : course.module}</span>
          <span>{course.progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${course.progress}%` }} />
        </div>
      </div>
    </Link>
  );
}
