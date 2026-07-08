import Image from "next/image";
import styles from "./profile-certificate-card.module.css";

export default function ProfileCertificateCard({ certificate }) {
  return (
    <article className={styles.card}>
      <span className={styles.glow} aria-hidden="true" />

      <div className={styles.iconWrap}>
        <Image src="/icons/profile-certificate-medal.svg" alt="" width={32} height={32} />
      </div>

      <h3 className={styles.title}>{certificate.title}</h3>
      <p className={styles.date}>{certificate.issuedAt}</p>

      <a href={certificate.pdfUrl} className={styles.download} download>
        <Image src="/icons/profile-download.svg" alt="" width={16} height={16} />
        Descargar PDF
      </a>
    </article>
  );
}
