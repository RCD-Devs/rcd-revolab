"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  filterInstructorCourses,
  getStatusConfig,
  instructorCourses,
  instructorPageMeta,
} from "@/data/instructor-data";
import styles from "./instructor-page.module.css";

function CourseCard({ course }) {
  const status = getStatusConfig(course.status);

  return (
    <article className={styles.courseCard}>
      <div
        className={`${styles.courseCover} ${course.hasCover ? "" : styles.courseCoverEmpty}`}
      >
        {course.hasCover ? (
          <Image
            src={course.coverImage}
            alt=""
            width={128}
            height={80}
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

        <p className={styles.courseStats}>{course.stats}</p>

        {course.actionType === "edit" ? (
          <Link
            href={`/instructor/cursos/${course.id}/editar`}
            className={styles.courseAction}
          >
            <Image src="/icons/instructor-edit.svg" alt="" width={12} height={12} />
            {course.actionLabel}
          </Link>
        ) : (
          <button type="button" className={styles.courseAction}>
            {course.actionLabel}
          </button>
        )}
      </div>
    </article>
  );
}

function MobileCourseCard({ course }) {
  const status = getStatusConfig(course.status);

  return (
    <article className={styles.mobileCourseCard}>
      <div
        className={`${styles.mobileCourseCover} ${course.hasCover ? "" : styles.courseCoverEmpty}`}
      >
        {course.hasCover ? (
          <Image
            src={course.coverImage}
            alt=""
            fill
            className={styles.mobileCourseCoverImage}
          />
        ) : (
          <span className={styles.courseCoverPlaceholder}>Sin portada</span>
        )}
      </div>

      <div className={styles.mobileCourseBody}>
        <h3 className={styles.mobileCourseTitle}>{course.title}</h3>

        <span className={`${styles.mobileStatusBadge} ${styles[status.className]}`}>
          <Image src={status.icon} alt="" width={12} height={12} />
          {status.label}
        </span>

        <p className={styles.mobileCourseStats}>{course.stats}</p>

        {course.actionType === "edit" ? (
          <Link
            href={`/instructor/cursos/${course.id}/editar`}
            className={styles.mobileCourseAction}
          >
            <Image src="/icons/instructor-edit.svg" alt="" width={16} height={16} />
            {course.actionLabel}
          </Link>
        ) : (
          <button type="button" className={styles.mobileCourseAction}>
            {course.actionLabel}
          </button>
        )}
      </div>
    </article>
  );
}

export default function InstructorPageContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(
    () => filterInstructorCourses(instructorCourses, searchQuery),
    [searchQuery],
  );

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

            <div className={styles.desktopCourseList}>
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              {filteredCourses.length === 0 && (
                <p className={styles.emptyState}>No se encontraron cursos.</p>
              )}
            </div>

            <div className={styles.mobileCourseList}>
              {filteredCourses.map((course) => (
                <MobileCourseCard key={course.id} course={course} />
              ))}
              {filteredCourses.length === 0 && (
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
