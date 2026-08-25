import styles from "./course-lesson-player.module.css";

export default function CourseLessonPlayer({ videoUrl, ariaLabel = "Reproducir lección" }) {
  if (!videoUrl) {
    return (
      <div className={styles.player}>
        <p className={styles.empty}>Esta lección todavía no tiene video.</p>
      </div>
    );
  }

  return (
    <div className={styles.player}>
      {/* preload="metadata" hace que el navegador muestre el primer frame
          real del video como preview, en vez de una imagen aparte. */}
      <video src={videoUrl} controls preload="metadata" className={styles.video} aria-label={ariaLabel} />
    </div>
  );
}
