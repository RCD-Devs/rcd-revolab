"use client";

import { useState } from "react";

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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#0f1420",
          border: "1px solid #2a3142",
          borderRadius: 12,
          padding: 24,
          width: 380,
          color: "#fff",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Crear usuario</h3>

        {result ? (
          <div>
            <p>Usuario creado: {result.user.email}</p>
            <p>
              Contraseña temporal: <strong>{result.temporaryPassword}</strong>
            </p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Cópiala y compártela con la persona ahora — no se volverá a mostrar.
            </p>
            <button type="button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="email"
              placeholder="nombre@rompecabeza.cl"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              {ROLES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}>
              <option value="">Sin departamento</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.label}
                </option>
              ))}
            </select>

            {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button type="submit" disabled={isSaving}>
                Crear
              </button>
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
