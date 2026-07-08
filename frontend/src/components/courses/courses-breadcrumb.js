import styles from "./courses-breadcrumb.module.css";

export default function CoursesBreadcrumb({ label }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <span className={styles.item}>R</span>
      <span className={styles.separator} aria-hidden="true">
        &gt;
      </span>
      <span className={styles.item}>Cursos</span>
      <span className={styles.separator} aria-hidden="true">
        &gt;
      </span>
      <span className={styles.current}>{label}</span>
    </nav>
  );
}
