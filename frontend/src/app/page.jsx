import LoginLogo from "@/components/login/login-logo";
import LoginHeader from "@/components/login/login-header";
import LoginForm from "@/components/login/login-form";
import styles from "./login.module.css";

export const metadata = {
  title: "Iniciar sesión",
  description: "Ingresa con tu cuenta institucional a RevoLab.",
};

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.decor} aria-hidden="true">
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
        <div className={styles.glow} />
      </div>

      <div className={styles.content}>
        <article className={styles.card}>
          <LoginLogo />
          <LoginHeader />
          <LoginForm />
        </article>
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerBrand}>R E V O</p>
        <p className={styles.footerTagline}>BUSINESS EVOLUTION</p>
      </footer>
    </div>
  );
}
