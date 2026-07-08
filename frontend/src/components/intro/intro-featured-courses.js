import Image from "next/image";
import Link from "next/link";
import styles from "./intro-featured-courses.module.css";

export default function IntroFeaturedCourses({ courses }) {
  return (
    <section id="cursos-destacados" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Cursos Destacados</h2>
        <p className={styles.subtitle}>
          Descubre los programas más populares entre nuestro equipo y da el siguiente paso
          en tu formación.
        </p>
      </div>

      <div className={styles.grid}>
        {courses.map((course) => (
          <article key={course.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image
                src={course.image}
                alt=""
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <span className={styles.imageOverlay} aria-hidden="true" />
            </div>

            <div className={styles.body}>
              <p className={styles.students}>{course.students}</p>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.description}>{course.description}</p>
            </div>
          </article>
        ))}
      </div>

      <Link href="/login" className={styles.viewAll}>
        Ver todos los cursos
        <Image src="/icons/arrow-right-white.svg" alt="" width={16} height={16} />
      </Link>
    </section>
  );
}
