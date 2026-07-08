"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./profile-sidebar.module.css";

export default function ProfileSidebar({ user, rank }) {
  const fileInputRef = useRef(null);

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

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
          >
            <Image
              src={user.avatar}
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
            onChange={() => {}}
          />
        </div>

        <h2 className={styles.name}>{user.name}</h2>
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
      </div>
    </aside>
  );
}
