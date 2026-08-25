import HomeHero from "@/components/home/home-hero";
import CourseCarousel from "@/components/home/course-carousel";
import ContinueCard from "@/components/home/continue-card";
import { auth } from "@/auth";
import { listCourses, getRecommendedCourses } from "@revolab/backend/services/courses";
import { getProfileCourses } from "@revolab/backend/services/profile";
import styles from "./home.module.css";

export default async function Home() {
  const session = await auth();

  const [recommendedCourses, newCourses, continueCourses] = await Promise.all([
    getRecommendedCourses(),
    listCourses({ filter: "nuevos" }),
    session?.user?.id ? getProfileCourses(session.user.id, "in-progress") : Promise.resolve([]),
  ]);

  return (
    <div className={styles.page}>
      <HomeHero slides={recommendedCourses.slice(0, 2).map((course) => ({
        id: course.id,
        courseId: course.id,
        title: course.title,
        description: course.description,
        backgroundImage: course.image,
        instructorName: course.instructor?.name ?? "Equipo RevoLab",
        instructorRole: course.instructor?.role ?? "Instructor",
        instructorImage: course.instructor?.avatarUrl || "/images/home/instructor-ariel.webp",
      }))} />

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

        {continueCourses.length > 0 && (
          <section className={styles.continueSection}>
            <h2 className={styles.continueTitle}>Continúa donde lo dejaste</h2>
            <div className={styles.continueGrid}>
              {continueCourses.map((course) => (
                <ContinueCard
                  key={course.id}
                  title={course.title}
                  module="Continuar viendo"
                  progress={course.progress}
                  image={course.image}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
