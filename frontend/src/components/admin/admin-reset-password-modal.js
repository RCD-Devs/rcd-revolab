"use client";

import styles from "./admin-create-user-modal.module.css";

export default function AdminResetPasswordModal({ name, temporaryPassword, onClose }) {
  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="reset-password-modal-title" className={styles.title}>
          Contraseña restablecida
        </h3>

        <div className={styles.result}>
          <p className={styles.resultText}>Nueva contraseña temporal para {name}:</p>
          <p className={styles.resultPassword}>{temporaryPassword}</p>
          <p className={styles.resultHint}>
            Cópiala y compártela con la persona ahora — no se volverá a mostrar.
          </p>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
