import IntroNav from "@/components/intro/intro-nav";
import IntroHero from "@/components/intro/intro-hero";
import IntroFeatures from "@/components/intro/intro-features";
import IntroFeaturedCourses from "@/components/intro/intro-featured-courses";
import Footer from "@/components/footer";
import { introFeatures, introFeaturedCourses } from "@/data/intro-data";
import styles from "./intro-page.module.css";

export default function IntroPage() {
  return (
    <div className={styles.page}>
      <div className={styles.glowTeal} aria-hidden="true" />
      <div className={styles.glowBlue} aria-hidden="true" />

      <IntroNav />
      <IntroHero />
      <IntroFeatures features={introFeatures} />
      <IntroFeaturedCourses courses={introFeaturedCourses} />
      <Footer />
    </div>
  );
}
