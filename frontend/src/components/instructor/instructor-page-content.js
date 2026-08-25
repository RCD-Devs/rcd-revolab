"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./instructor-page.module.css";

const instructorPageMeta = {
  title: "Panel de Instructor",
  subtitle: "Crea y administra tus cursos.",
  createCourseLabel: "Crear Curso",
  coursesSectionTitle: "Mis Cursos",
  searchPlaceholder: "Buscar cursos...",
  backHref: "/home",
  learningPathsTitle: "Rutas de Aprendizaje",
  learningPathsDescription:
    "Construye secuencias de cursos arrastrando y soltando para crear especialidades.",
  learningPathsButton: "Constructor de Rutas",
};

function getStatusConfig(status) {
  if (status === "PUBLISHED") {
    return {
      label: "PUBLICADO",
      icon: "/icons/instructor-status-published.svg",
      className: "published",
    };
  }
  if (status === "DRAFT") {
    return {
      label: "BORRADOR",
      icon: "/icons/instructor-status-review.svg",
      className: "review",
    };
  }
  return {
    label: "EN REVISIÓN",
    icon: "/icons/instructor-status-review.svg",
    className: "review",
  };
}

function CourseAction({ course }) {
  return (
    <div className={styles.courseActions}>
      <Link href={`/instructor/cursos/${course.id}/editar`} className={styles.courseAction}>
        <Image src="/icons/instructor-edit.svg" alt="" width={12} height={12} />
        Editar
      </Link>
      <Link href={`/instructor/cursos/${course.id}/estudiantes`} className={styles.courseAction}>
        <Image src="/icons/users.svg" alt="" width={12} height={12} />
        Estudiantes
      </Link>
    </div>
  );
}

function CourseCard({ course }) {
  const status = getStatusConfig(course.status);
  const hasCover = Boolean(course.coverImageUrl);

  return (
    <article className={styles.courseCard}>
      <div className={`${styles.courseCover} ${hasCover ? "" : styles.courseCoverEmpty}`}>
        {hasCover ? (
          <Image
            src={course.coverImageUrl}
            alt=""
            fill
            sizes="(min-width: 769px) 128px, 100vw"
            className={styles.courseCoverImage}
          />
        ) : (
          <span className={styles.courseCoverPlaceholder}>Sin portada</span>
        )}
      </div>

      <div className={styles.courseBody}>
        <div className={styles.courseHeader}>
          <h3 className={styles.courseTitle}>{course.title}</h3>
          <span className={`${styles.statusBadge} ${styles[status.className]}`}>
            <Image src={status.icon} alt="" width={12} height={12} />
            {status.label}
          </span>
        </div>

        <p className={styles.courseStats}>{course.students} estudiantes inscritos</p>
        <CourseAction course={course} />
      </div>
    </article>
  );
}

export default function InstructorPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructor/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data.courses ?? []))
      .catch(() => setCourses([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter((course) => course.title.toLowerCase().includes(query));
  }, [courses, searchQuery]);

  return (
    <div className={styles.page}>
      <div className={styles.subheader}>
        <Link href={instructorPageMeta.backHref} className={styles.subheaderBack}>
          <Image src="/icons/chevron-left.svg" alt="" width={24} height={24} />
          <div className={styles.subheaderCopy}>
            <h1 className={styles.subheaderTitle}>{instructorPageMeta.title}</h1>
            <p className={styles.subheaderSubtitle}>{instructorPageMeta.subtitle}</p>
          </div>
        </Link>

        <Link href="/instructor/cursos/nuevo" className={styles.createButton}>
          <Image src="/icons/instructor-plus.svg" alt="" width={20} height={20} />
          <span>{instructorPageMeta.createCourseLabel}</span>
        </Link>
      </div>

      <div className={styles.container}>
        <section className={styles.hero} aria-label="Panel de instructor">
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>{instructorPageMeta.title}</h1>
            <p className={styles.heroSubtitle}>{instructorPageMeta.subtitle}</p>
          </div>

          <Link href="/instructor/cursos/nuevo" className={styles.heroCreateButton}>
            <Image src="/icons/instructor-plus.svg" alt="" width={20} height={20} />
            <span>{instructorPageMeta.createCourseLabel}</span>
          </Link>
        </section>

        <label className={styles.mobileSearch}>
          <Image
            className={styles.searchIcon}
            src="/icons/search.svg"
            alt=""
            width={16}
            height={16}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={instructorPageMeta.searchPlaceholder}
            className={styles.searchInput}
          />
        </label>

        <div className={styles.layout}>
          <section className={styles.coursesSection} aria-labelledby="instructor-courses-title">
            <h2 id="instructor-courses-title" className={styles.sectionTitle}>
              {instructorPageMeta.coursesSectionTitle}
            </h2>

            <div className={styles.courseList}>
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              {!isLoading && filteredCourses.length === 0 && (
                <p className={styles.emptyState}>No se encontraron cursos.</p>
              )}
            </div>
          </section>

          <aside className={styles.learningPathsCard} aria-labelledby="learning-paths-title">
            <h3 id="learning-paths-title" className={styles.learningPathsTitle}>
              {instructorPageMeta.learningPathsTitle}
            </h3>
            <p className={styles.learningPathsDescription}>
              {instructorPageMeta.learningPathsDescription}
            </p>
            <button type="button" className={styles.learningPathsButton}>
              {instructorPageMeta.learningPathsButton}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
