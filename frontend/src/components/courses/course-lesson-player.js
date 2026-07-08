import Image from "next/image";
import styles from "./course-lesson-player.module.css";

export default function CourseLessonPlayer({ image, ariaLabel = "Reproducir lección" }) {
  return (
    <div className={styles.player}>
      <Image src={image} alt="" fill className={styles.image} priority />
      <div className={styles.overlay}>
        <button type="button" className={styles.playButton} aria-label={ariaLabel}>
          <Image src="/icons/course-play.svg" alt="" width={32} height={32} />
        </button>
      </div>
    </div>
  );
}
