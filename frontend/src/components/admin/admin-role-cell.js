"use client";

import { useState } from "react";
import styles from "./admin-page.module.css";

const ROLES = ["STUDENT", "INSTRUCTOR", "ADMIN"];

// El cambio de rol no se aplica al vuelo (es sensible: puede otorgar
// acceso de administrador) — queda en borrador local hasta que se
// confirma con "Guardar".
export default function AdminRoleCell({ user, onSave }) {
  const [draftRole, setDraftRole] = useState(user.role);
  const isDirty = draftRole !== user.role;

  return (
    <div className={styles.roleCell}>
      <select
        className={styles.tableSelect}
        value={draftRole}
        onChange={(event) => setDraftRole(event.target.value)}
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      {isDirty && (
        <button
          type="button"
          className={styles.roleSaveButton}
          onClick={() => onSave(user.id, draftRole)}
        >
          Guardar
        </button>
      )}
    </div>
  );
}
