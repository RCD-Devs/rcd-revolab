import Image from "next/image";
import styles from "./intro-features.module.css";

export default function IntroFeatures({ features }) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {features.map((feature) => (
          <article key={feature.id} className={styles.card}>
            <Image src={feature.icon} alt="" width={48} height={48} className={styles.icon} />
            <h2 className={styles.title}>{feature.title}</h2>
            <p className={styles.description}>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
