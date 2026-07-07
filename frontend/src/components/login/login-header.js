import styles from "./login-header.module.css";

export default function LoginHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        Tu viaje de aprendizaje comienza aquí
      </h1>
      <p className={styles.subtitle}>Ingresa con tu cuenta institucional</p>
    </header>
  );
}
