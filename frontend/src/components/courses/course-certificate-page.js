"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteLogo from "@/components/site-logo";
import CourseCertificateLinkedinModal from "./course-certificate-linkedin-modal";
import styles from "./course-certificate-page.module.css";

export default function CourseCertificatePage({ courseId, certificate }) {
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);

  const issuedAtLabel = new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(certificate.issuedAt));

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link href={`/cursos/${courseId}`} className={styles.backLink}>
          <Image src="/icons/chevron-left.svg" alt="" width={16} height={16} />
          Volver al curso
        </Link>

        <div className={styles.layout}>
          <article className={styles.certificateCard} aria-label="Certificado del curso">
            <div className={styles.certificateGlowTeal} aria-hidden="true" />
            <div className={styles.certificateGlowPurple} aria-hidden="true" />

            <div className={styles.certificateInner}>
              <SiteLogo
                href={`/cursos/${courseId}`}
                className={styles.certificateLogo}
                imageClassName={styles.certificateLogoImage}
              />

              <div className={styles.certificateBody}>
                <p className={styles.eyebrow}>Este certificado se otorga a</p>
                <h1 className={styles.recipient}>{certificate.recipientName}</h1>
                <p className={styles.eyebrow}>Por haber completado con éxito</p>
                <h2 className={styles.courseTitle}>{certificate.courseTitle}</h2>
              </div>

              <div className={styles.certificateFooter}>
                <div className={styles.dateBlock}>
                  <p className={styles.dateValue}>{issuedAtLabel}</p>
                  <p className={styles.dateLabel}>Fecha de emisión</p>
                </div>
              </div>
            </div>
          </article>

          <aside className={styles.sidebar}>
            <div>
              <h3 className={styles.missionTitle}>¡Misión cumplida!</h3>
              <p className={styles.missionDescription}>
                Tu certificado oficial ya está disponible. Puedes descargarlo o compartirlo en
                LinkedIn.
              </p>
            </div>

            <div className={styles.actions}>
              <a
                href={`/api/certificates/${certificate.id}/pdf`}
                className={styles.downloadButton}
              >
                <Image src="/icons/download-white.svg" alt="" width={16} height={16} />
                Descargar PDF
              </a>

              <button
                type="button"
                className={styles.linkedinButton}
                onClick={() => setShowLinkedinModal(true)}
              >
                <Image src="/icons/linkedin.svg" alt="" width={16} height={16} />
                Compartir en LinkedIn
              </button>
            </div>
          </aside>
        </div>
      </div>

      {showLinkedinModal && (
        <CourseCertificateLinkedinModal
          message={certificate.linkedinMessage}
          onClose={() => setShowLinkedinModal(false)}
        />
      )}
    </div>
  );
}
