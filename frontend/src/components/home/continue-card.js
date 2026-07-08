import Image from "next/image";
import styles from "./continue-card.module.css";

export default function ContinueCard({ title, module, progress, image }) {
  return (
    <article className={styles.card}>
      <div className={styles.thumbnailWrap}>
        <Image
          src={image}
          alt=""
          width={128}
          height={96}
          className={styles.thumbnail}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.moduleRow}>
          <span className={styles.module}>
            <Image src="/icons/book-open.svg" alt="" width={12} height={12} />
            {module}
          </span>
          <span className={styles.percent}>{progress}%</span>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        <button type="button" className={styles.continueButton}>
          Continuar
          <Image
            src="/icons/arrow-right-primary.svg"
            alt=""
            width={16}
            height={16}
          />
        </button>
      </div>
    </article>
  );
}
