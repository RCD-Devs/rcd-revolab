import CourseDetailHero from "@/components/courses/course-detail-hero";
import CourseDetailPanel from "@/components/courses/course-detail-panel";
import CourseDetailContent from "@/components/courses/course-detail-content";
import styles from "./course-detail-page.module.css";

export default function CourseDetailPage({ course, modules }) {
  return (
    <div className={styles.page}>
      <CourseDetailHero course={course} />

      <div className={styles.layout}>
        <div className={styles.mobilePanel}>
          <CourseDetailPanel course={course} />
        </div>

        <div className={styles.main}>
          <CourseDetailContent course={course} modules={modules} />
        </div>

        <div className={styles.desktopPanel}>
          <CourseDetailPanel course={course} />
        </div>
      </div>
    </div>
  );
}
