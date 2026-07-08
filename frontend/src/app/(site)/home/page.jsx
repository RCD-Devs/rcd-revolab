import HomeHero from "@/components/home/home-hero";
import CourseCarousel from "@/components/home/course-carousel";
import ContinueCard from "@/components/home/continue-card";
import {
  featuredSlides,
  recommendedCourses,
  newCourses,
  continueCourses,
} from "@/data/home-data";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <HomeHero slides={featuredSlides} />

      <div className={styles.sections}>
        <CourseCarousel
          title="Recomendado para ti"
          linkLabel="Ver todo el catálogo"
          linkLabelMobile="Ver todo"
          courses={recommendedCourses}
          loop
        />

        <CourseCarousel
          title="Nuevos cursos"
          courses={newCourses}
          compact
          eyebrow="CURSOS NUEVOS"
          loop
        />

        <section className={styles.continueSection}>
          <h2 className={styles.continueTitle}>Continúa donde lo dejaste</h2>
          <div className={styles.continueGrid}>
            {continueCourses.map((course) => (
              <ContinueCard key={course.id} {...course} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
