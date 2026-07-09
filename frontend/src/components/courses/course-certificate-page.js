"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteLogo from "@/components/site-logo";
import CourseCertificateLinkedinModal from "./course-certificate-linkedin-modal";
import styles from "./course-certificate-page.module.css";

export default function CourseCertificatePage({ examData }) {
  const { course, exam } = examData;
  const { certificate } = exam;
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link href={`/cursos/${course.id}`} className={styles.backLink}>
          <Image src="/icons/chevron-left.svg" alt="" width={16} height={16} />
          Volver al curso
        </Link>

        <div className={styles.layout}>
          <article className={styles.certificateCard} aria-label="Certificado del curso">
            <div className={styles.certificateGlowTeal} aria-hidden="true" />
            <div className={styles.certificateGlowPurple} aria-hidden="true" />

            <div className={styles.certificateInner}>
              <SiteLogo
                href={`/cursos/${course.id}`}
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
                  <p className={styles.dateValue}>{certificate.issuedAt}</p>
                  <p className={styles.dateLabel}>{certificate.issuedAtLabel}</p>
                </div>

                <div className={styles.signatureBlock}>
                  <span className={styles.signatureLine} aria-hidden="true" />
                  <p className={styles.signatureLabel}>{certificate.instructorSignature}</p>
                </div>
              </div>
            </div>
          </article>

          <aside className={styles.sidebar}>
            <div>
              <h3 className={styles.missionTitle}>{certificate.missionTitle}</h3>
              <p className={styles.missionDescription}>{certificate.missionDescription}</p>
            </div>

            <div className={styles.careerBox}>
              <Image src="/icons/intro-career.svg" alt="" width={24} height={24} />
              <div className={styles.careerCopy}>
                <p className={styles.careerTitle}>{certificate.careerIqTitle}</p>
                <p className={styles.careerDescription}>{certificate.careerIqDescription}</p>
              </div>
            </div>

            <div className={styles.actions}>
              <a href={certificate.pdfUrl} className={styles.downloadButton} download>
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
