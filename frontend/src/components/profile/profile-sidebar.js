"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./profile-sidebar.module.css";

export default function ProfileSidebar({ user, rank }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user.name);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordFields, setPasswordFields] = useState({ current: "", next: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      const data = await response.json();
      if (data.avatar) setAvatar(data.avatar);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleSaveName() {
    if (!name.trim() || name === user.name) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      router.refresh();
    } finally {
      setIsSavingName(false);
      setIsEditingName(false);
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();
    setIsSavingPassword(true);
    setPasswordMessage("");
    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordFields.current,
          newPassword: passwordFields.next,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPasswordMessage(data.error ?? "No se pudo cambiar la contraseña");
        return;
      }
      setPasswordMessage("Contraseña actualizada.");
      setPasswordFields({ current: "", next: "" });
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mi Perfil</h1>
        </div>

        <div className={styles.avatarWrap}>
          <button
            type="button"
            className={styles.avatarButton}
            aria-label="Editar foto de perfil"
            onClick={handleEditPhoto}
            disabled={isUploadingAvatar}
          >
            <Image
              src={avatar || "/images/profile/avatar.webp"}
              alt=""
              width={110}
              height={110}
              className={styles.avatarImage}
            />
            <span className={styles.avatarOverlay}>
              <Image src="/icons/profile-edit.svg" alt="" width={28} height={28} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            aria-hidden="true"
            tabIndex={-1}
            onChange={handleAvatarChange}
          />
        </div>

        {isEditingName ? (
          <input
            type="text"
            className={styles.name}
            value={name}
            autoFocus
            disabled={isSavingName}
            onChange={(event) => setName(event.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSaveName();
            }}
          />
        ) : (
          <h2 className={styles.name} onClick={() => setIsEditingName(true)} role="button" tabIndex={0}>
            {name}
          </h2>
        )}
        <p className={styles.email}>{user.email}</p>
        <span className={styles.department}>{user.department}</span>

        <div className={styles.rankCard}>
          <Image
            src={rank.background}
            alt=""
            fill
            className={styles.rankBackground}
          />
          <div className={styles.rankContent}>
            <p className={styles.rankLabel}>{rank.label}</p>
            <div className={styles.rankIconWrap}>
              <Image src="/icons/profile-rank.svg" alt="" width={40} height={40} />
            </div>
            <div className={styles.rankTitle}>
              {rank.title.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.avatarButton}
          style={{ width: "100%", marginTop: 16, borderRadius: 8, padding: "10px 0" }}
          onClick={() => setShowPasswordForm((show) => !show)}
        >
          {showPasswordForm ? "Cancelar" : "Cambiar contraseña"}
        </button>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              type="password"
              placeholder="Contraseña actual"
              value={passwordFields.current}
              onChange={(event) =>
                setPasswordFields((f) => ({ ...f, current: event.target.value }))
              }
              required
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={passwordFields.next}
              onChange={(event) => setPasswordFields((f) => ({ ...f, next: event.target.value }))}
              minLength={8}
              required
            />
            <button type="submit" disabled={isSavingPassword}>
              Guardar contraseña
            </button>
            {passwordMessage && <p>{passwordMessage}</p>}
          </form>
        )}
      </div>
    </aside>
  );
}
