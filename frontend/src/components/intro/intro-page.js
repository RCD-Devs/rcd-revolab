import IntroNav from "@/components/intro/intro-nav";
import IntroHero from "@/components/intro/intro-hero";
import IntroFeatures from "@/components/intro/intro-features";
import IntroFeaturedCourses from "@/components/intro/intro-featured-courses";
import Footer from "@/components/footer";
import { introFeatures } from "@/data/intro-data";
import { listCourses } from "@revolab/backend/services/courses";
import styles from "./intro-page.module.css";

export default async function IntroPage() {
  const courses = await listCourses({ filter: "populares" });
  const featuredCourses = courses.slice(0, 3).map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    students: `${course.students} estudiantes`,
    image: course.image,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.glowTeal} aria-hidden="true" />
      <div className={styles.glowBlue} aria-hidden="true" />

      <IntroNav />
      <IntroHero />
      <IntroFeatures features={introFeatures} />
      {featuredCourses.length > 0 && <IntroFeaturedCourses courses={featuredCourses} />}
      <Footer />
    </div>
  );
}
