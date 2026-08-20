"use client";

import { useState } from "react";
import styles from "./admin-create-user-modal.module.css";

const ROLES = [
  { value: "STUDENT", label: "Estudiante" },
  { value: "INSTRUCTOR", label: "Instructor" },
  { value: "ADMIN", label: "Administrador" },
];

export default function AdminCreateUserModal({ departments, onClose, onCreated }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [departmentId, setDepartmentId] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role, departmentId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "No se pudo crear el usuario");
        return;
      }
      setResult(data);
      onCreated?.();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-user-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="create-user-modal-title" className={styles.title}>
          Crear usuario
        </h3>

        {result ? (
          <div className={styles.result}>
            <p className={styles.resultText}>Usuario creado: {result.user.email}</p>
            <p className={styles.resultText}>Contraseña temporal:</p>
            <p className={styles.resultPassword}>{result.temporaryPassword}</p>
            <p className={styles.resultHint}>
              Cópiala y compártela con la persona ahora — no se volverá a mostrar.
            </p>
            <button type="button" className={styles.closeButton} onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="create-user-email">
                Correo
              </label>
              <input
                id="create-user-email"
                type="email"
                className={styles.input}
                placeholder="nombre@rompecabeza.cl"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="create-user-name">
                Nombre completo
              </label>
              <input
                id="create-user-name"
                type="text"
                className={styles.input}
                placeholder="Nombre completo"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="create-user-role">
                Rol
              </label>
              <select
                id="create-user-role"
                className={styles.select}
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                {ROLES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="create-user-department">
                Departamento
              </label>
              <select
                id="create-user-department"
                className={styles.select}
                value={departmentId}
                onChange={(event) => setDepartmentId(event.target.value)}
              >
                <option value="">Sin departamento</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="submit" className={styles.primaryButton} disabled={isSaving}>
                Crear
              </button>
              <button type="button" className={styles.secondaryButton} onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
