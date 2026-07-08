import Image from "next/image";
import Link from "next/link";
import styles from "./course-card.module.css";

export default function CourseCard({
  id,
  category,
  title,
  description,
  students,
  duration,
  image,
  isNew = false,
  compact = false,
}) {
  return (
    <article className={`${styles.card} ${compact ? styles.compact : ""}`}>
      <div className={styles.imageWrap}>
        <Image
          src={image}
          alt=""
          width={347}
          height={194}
          className={styles.image}
        />
        <span className={styles.category}>{category}</span>
        {isNew && <span className={styles.newBadge}>NUEVO</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <Image src="/icons/users.svg" alt="" width={16} height={16} />
          {students}
        </span>
        <span className={styles.metaItem}>
          <Image src="/icons/clock.svg" alt="" width={16} height={16} />
          {duration}
        </span>
      </div>

      <Link href={`/cursos/${id}`} className={styles.button}>
        <span>Realizar curso</span>
        <Image
          src="/icons/arrow-right-primary.svg"
          alt=""
          width={16}
          height={16}
          className={styles.buttonIconOutline}
        />
        <Image
          src="/icons/arrow-right-white.svg"
          alt=""
          width={16}
          height={16}
          className={styles.buttonIconFilled}
        />
      </Link>
    </article>
  );
}
