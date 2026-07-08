import Image from "next/image";
import Link from "next/link";
import styles from "./intro-hero.module.css";

export default function IntroHero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        <span className={styles.titleLine}>Eleva tu potencial y</span>
        <span className={styles.titleAccent}>revoluciona tu carrera</span>
      </h1>

      <p className={styles.description}>
        RevoLab es la plataforma de e-learning diseñada exclusivamente para impulsar el
        talento de nuestro equipo. Aprende a tu ritmo, valida tus conocimientos y haz
        crecer tu perfil profesional.
      </p>

      <Link href="#cursos-destacados" className={styles.cta}>
        Explorar Cursos
        <Image src="/icons/arrow-right-dark.svg" alt="" width={20} height={20} />
      </Link>
    </section>
  );
}
