import Link from "next/link";
import SiteLogo from "@/components/site-logo";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <SiteLogo className={styles.logo} />
        <Link href="/equipo" className={styles.credit}>
          Desarrollado por el Equipo Experiencia Digital
        </Link>
      </div>
    </footer>
  );
}
