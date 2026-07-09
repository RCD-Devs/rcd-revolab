"use client";

import { useEffect } from "react";
import styles from "./course-certificate-linkedin-modal.module.css";

export default function CourseCertificateLinkedinModal({ message, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handlePublish = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.origin
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="linkedin-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="linkedin-modal-title" className={styles.title}>
          Compartir Logro
        </h2>

        <div className={styles.preview}>
          <p>{message}</p>
        </div>

        <button type="button" className={styles.publish} onClick={handlePublish}>
          Publicar en LinkedIn
        </button>
      </div>
    </div>
  );
}
