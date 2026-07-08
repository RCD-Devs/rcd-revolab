import Image from "next/image";
import styles from "./course-detail-hero.module.css";

export default function CourseDetailHero({ course }) {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <Image
          src={course.image}
          alt=""
          fill
          className={styles.backgroundImage}
          priority
        />
        <div className={styles.backgroundOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.badges}>
          <span className={styles.badgePrimary}>{course.categoryTag}</span>
          <span className={styles.badgeSecondary}>{course.specialtyLabel}</span>
        </div>

        <h1 className={styles.title}>{course.title}</h1>

        <div className={styles.instructor}>
          <Image
            src={course.instructorImage}
            alt=""
            width={40}
            height={40}
            className={styles.instructorPhoto}
          />
          <div className={styles.instructorInfo}>
            <p className={styles.instructorName}>{course.instructorName}</p>
            <p className={styles.instructorRole}>{course.instructorRole}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
