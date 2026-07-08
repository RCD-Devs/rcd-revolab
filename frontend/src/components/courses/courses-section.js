import Image from "next/image";
import CourseCard from "@/components/home/course-card";
import CoursesMobileCarousel from "./courses-mobile-carousel";
import styles from "./courses-section.module.css";

export default function CoursesSection({
  title,
  courses,
  showLink = true,
  featured = false,
  onViewAll,
}) {
  return (
    <section className={styles.section}>
      <div className={`${styles.header} ${featured ? styles.headerFeatured : ""}`}>
        <h2 className={featured ? styles.featuredTitle : styles.title}>{title}</h2>
        {showLink && !featured && onViewAll && (
          <button type="button" className={styles.linkButton} onClick={onViewAll}>
            <span>Ver todo el catálogo</span>
            <Image
              src="/icons/arrow-right-primary.svg"
              alt=""
              width={16}
              height={16}
            />
          </button>
        )}
      </div>

      <div className={styles.grid}>
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} compact />
        ))}
      </div>

      <CoursesMobileCarousel courses={courses} />
    </section>
  );
}
